import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { authenticateUser } from '../middleware/auth'
import { supabase, vertexAI } from '../server'
import { HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai'

const router = express.Router()

// CBT-focused system prompt for mental health conversations
const MENTAL_HEALTH_SYSTEM_PROMPT = `You are a compassionate mental health support assistant trained in Cognitive Behavioral Therapy (CBT) principles. Your role is to:

1. Listen actively and validate emotions without judgment
2. Apply CBT techniques such as identifying thought patterns and cognitive distortions
3. Maintain boundaries - you are supportive but not a replacement for professional therapy
4. Recognize crisis situations and provide appropriate resources
5. Encourage self-reflection and emotional awareness
6. Promote healthy coping strategies and self-care practices

Guidelines:
- Use warm, empathetic language
- Ask open-ended questions to encourage exploration
- Suggest practical CBT exercises when appropriate
- Always validate feelings while gently challenging negative thought patterns
- If someone expresses suicidal thoughts or crisis, immediately provide crisis resources
- Keep responses conversational and supportive, not clinical
- Remember that this is a mental wellness app context

Crisis Resources:
- National Suicide Prevention Lifeline: 988 or 1-800-273-8255
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

Respond in a supportive, therapeutic manner that incorporates CBT principles while being conversational and accessible.`

// Crisis detection keywords and phrases
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'suicidal', 'self harm', 'hurt myself', 'cut myself', 'overdose',
  'not worth living', 'no point in living', 'can\'t go on', 'give up',
  'hopeless', 'worthless', 'burden', 'ending it all'
]

// Rate limiting for chat endpoint
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 chat requests per minute
  message: {
    error: "Too many chat requests, please slow down.",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Get chat history for a user
router.get('/', authenticateUser, async (req: any, res: Response) => {
  try {
    const userId = req.user?.id
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const { data: chatHistory, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch chat history' })
    }

    res.json({
      messages: chatHistory ? chatHistory.reverse() : [],
      pagination: {
        limit,
        offset,
        hasMore: chatHistory ? chatHistory.length === limit : false
      }
    })
  } catch (error) {
    console.error('Error fetching chat history:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send a message and get AI response
router.post(
  '/message',
  chatLimiter,
  authenticateUser,
  [
    body('message')
      .isString()
      .trim()
      .isLength({ min: 1, max: 4000 })
      .withMessage('Message must be between 1 and 4000 characters'),
    body('session_id')
      .optional()
      .isUUID()
      .withMessage('Session ID must be a valid UUID')
  ],
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { message, session_id } = req.body
      const userId = req.user?.id

      // Check for crisis keywords
      const messageText = message.toLowerCase()
      const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword => 
        messageText.includes(keyword.toLowerCase())
      )

      // Generate session ID if not provided
      const sessionId = session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Save user message to database
      const { data: userMessage, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          session_id: sessionId,
          role: 'user',
          content: message,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (userMessageError) {
        console.error('Error saving user message:', userMessageError)
        return res.status(500).json({ error: 'Failed to save message' })
      }

      // Get recent conversation history for context
      const { data: recentMessages, error: historyError } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(20)

      if (historyError) {
        console.error('Error fetching conversation history:', historyError)
      }

      // Prepare conversation context for Vertex AI
      const conversationHistory = (recentMessages || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

      try {
        // Initialize Vertex AI Gemini model
        const model = vertexAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: MENTAL_HEALTH_SYSTEM_PROMPT,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            },
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
            }
          ]
        })

        let aiPrompt = message
        if (hasCrisisKeywords) {
          aiPrompt = `CRISIS ALERT: The user's message contains potential crisis indicators. Please provide immediate supportive response with crisis resources. User message: "${message}"`
        }

        const chat = model.startChat({
          history: conversationHistory.slice(0, -1)
        })

        const result = await chat.sendMessage(aiPrompt)
        const aiResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.'

        // Save AI response to database
        const { data: aiMessage, error: aiMessageError } = await supabase
          .from('chat_messages')
          .insert({
            user_id: userId,
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse,
            created_at: new Date().toISOString(),
            metadata: {
              model: 'gemini-1.5-flash',
              crisis_detected: hasCrisisKeywords,
              token_usage: {
                input_tokens: result.response.usageMetadata?.promptTokenCount || 0,
                output_tokens: result.response.usageMetadata?.candidatesTokenCount || 0,
                total_tokens: result.response.usageMetadata?.totalTokenCount || 0
              }
            }
          })
          .select()
          .single()

        if (aiMessageError) {
          console.error('Error saving AI message:', aiMessageError)
        }

        // Log crisis detection
        if (hasCrisisKeywords) {
          console.warn(`🚨 Crisis keywords detected for user ${userId} in session ${sessionId}`)
          
          await supabase
            .from('crisis_events')
            .insert({
              user_id: userId,
              session_id: sessionId,
              message_content: message,
              keywords_detected: CRISIS_KEYWORDS.filter(keyword => 
                messageText.includes(keyword.toLowerCase())
              ),
              created_at: new Date().toISOString()
            })
        }

        res.json({
          message: {
            id: aiMessage?.id,
            content: aiResponse,
            role: 'assistant',
            session_id: sessionId,
            created_at: aiMessage?.created_at || new Date().toISOString(),
            crisis_detected: hasCrisisKeywords
          },
          usage: {
            input_tokens: result.response.usageMetadata?.promptTokenCount || 0,
            output_tokens: result.response.usageMetadata?.candidatesTokenCount || 0,
            total_tokens: result.response.usageMetadata?.totalTokenCount || 0
          }
        })

      } catch (aiError: any) {
        console.error('Vertex AI error:', aiError)
        
        const fallbackResponse = hasCrisisKeywords 
          ? `I understand you're going through a difficult time. While I'm having technical difficulties, please know that help is available:

🚨 Crisis Resources:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

You are not alone, and your life has value. Please reach out to one of these resources right away.`
          : `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment.`

        const { data: fallbackMessage } = await supabase
          .from('chat_messages')
          .insert({
            user_id: userId,
            session_id: sessionId,
            role: 'assistant',
            content: fallbackResponse,
            created_at: new Date().toISOString(),
            metadata: {
              model: 'fallback',
              crisis_detected: hasCrisisKeywords,
              error: 'ai_generation_failed'
            }
          })
          .select()
          .single()

        res.json({
          message: {
            id: fallbackMessage?.id,
            content: fallbackResponse,
            role: 'assistant',
            session_id: sessionId,
            created_at: fallbackMessage?.created_at || new Date().toISOString(),
            crisis_detected: hasCrisisKeywords,
            fallback: true
          }
        })
      }

    } catch (error) {
      console.error('Error in chat message endpoint:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router