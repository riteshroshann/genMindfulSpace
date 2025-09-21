import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { verifyToken } from "../middleware/auth"
import { supabase, vertexAI } from "../server"

const router = express.Router()

// Mental health focused system prompt
const SYSTEM_PROMPT = "You are a compassionate mental health support assistant trained in Cognitive Behavioral Therapy (CBT) principles. Provide supportive, empathetic responses that validate emotions and offer practical coping strategies. If someone expresses suicidal thoughts or crisis, immediately provide crisis resources: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741."

// Crisis detection keywords
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'suicidal', 'self harm', 'hurt myself', 'cut myself', 'overdose',
  'not worth living', 'no point in living', 'cant go on', 'give up',
  'hopeless', 'worthless', 'burden', 'ending it all'
]

// Get chat history
router.get("/", verifyToken, async (req: Request, res: Response) => {
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

// Send message and get AI response
router.post("/message",
  verifyToken,
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
  async (req: Request, res: Response) => {
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

      // Get conversation history
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

      // Prepare conversation for Vertex AI
      const conversationHistory = (recentMessages || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

      try {
        // Initialize Vertex AI model
        const model = vertexAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.8,
            topK: 40
          }
        })

        // Prepare prompt for crisis detection
        let aiPrompt = message
        if (hasCrisisKeywords) {
          aiPrompt = `CRISIS ALERT: The user's message contains potential crisis indicators. Please provide immediate supportive response with crisis resources. User message: "${message}"`
        }

        const chat = model.startChat({
          history: conversationHistory.slice(0, -1)
        })

        const result = await chat.sendMessage(aiPrompt)
        const aiResponse = result.response.text()

        // Save AI response
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

        // Log crisis events
        if (hasCrisisKeywords) {
          console.warn(`Crisis keywords detected for user ${userId} in session ${sessionId}`)
          
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
        
        // Fallback response
        const fallbackResponse = hasCrisisKeywords 
          ? `I understand you're going through a difficult time. While I'm having technical difficulties, please know that help is available: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741. You are not alone.`
          : `I apologize, but I'm experiencing technical difficulties. Please try again in a moment. If this is urgent, please consider talking to a trusted friend, family member, or mental health professional.`

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

// Get chat sessions
router.get("/sessions", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const limit = parseInt(req.query.limit as string) || 20

    const { data: sessions, error } = await supabase
      .from('chat_messages')
      .select('session_id, created_at, content')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch sessions' })
    }

    // Group by session
    const sessionMap = new Map()
    sessions?.forEach(msg => {
      if (!sessionMap.has(msg.session_id)) {
        sessionMap.set(msg.session_id, {
          session_id: msg.session_id,
          created_at: msg.created_at,
          preview: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '')
        })
      }
    })

    res.json({
      sessions: Array.from(sessionMap.values())
    })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get messages for specific session
router.get("/sessions/:sessionId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { sessionId } = req.params

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch session messages' })
    }

    res.json({
      session_id: sessionId,
      messages: messages || []
    })
  } catch (error) {
    console.error('Error fetching session messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete chat session
router.delete("/sessions/:sessionId", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { sessionId } = req.params

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId)
      .eq('session_id', sessionId)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to delete session' })
    }

    res.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router