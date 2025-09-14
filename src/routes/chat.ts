import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import rateLimit from "express-rate-limit"
import { supabase } from "../server"

const router = express.Router()

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

// Enhanced system prompt with crisis detection
const getSystemPrompt = () => `You are a compassionate, empathetic AI companion designed specifically for mental health support. Your role is to:

1. Listen without judgment and validate feelings
2. Provide emotional support and encouragement
3. Offer practical coping strategies when appropriate
4. Recognize when professional help may be needed
5. Maintain a warm, understanding, and hopeful tone

CRISIS DETECTION: If someone mentions:
- Self-harm, suicide, or wanting to hurt themselves
- Feeling hopeless with no way out
- Specific plans to harm themselves or others
- Substance abuse or dangerous behaviors

Respond with empathy and gently encourage immediate professional help:
"I hear how much pain you're in right now, and I'm genuinely concerned about you. Please reach out to a crisis hotline or emergency services immediately. In the US: 988 Suicide & Crisis Lifeline (call or text 988). You don't have to go through this alone."

Guidelines:
- Always acknowledge the person's feelings as valid
- Use "I" statements to show empathy ("I hear you", "I understand")
- Avoid giving medical advice or diagnoses
- Encourage professional help for serious concerns
- Focus on the person's strengths and resilience
- Keep responses supportive but not overly lengthy
- Provide grounding techniques when appropriate
- Suggest healthy coping strategies

Remember: You are a supportive companion, not a replacement for professional mental health care.`

// Send chat message
router.post("/",
  chatLimiter,
  [
    body("message").isString().isLength({ min: 1, max: 2000 }).trim(),
    body("model").optional().isString(),
    body("sessionId").optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { message, model = "meta-llama/llama-3.1-8b-instruct:free", sessionId } = req.body

      // Get user if authenticated
      let user = null
      const authHeader = req.headers.authorization
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "")
        const { data: { user: authUser } } = await supabase.auth.getUser(token)
        user = authUser
      }

      const openRouterApiKey = process.env.OPENROUTER_API_KEY
      if (!openRouterApiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" })
      }

      // Create or get chat session
      let chatSession = null
      if (user && sessionId) {
        const { data: session } = await supabase
          .from("ai_chat_sessions")
          .select("*")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .single()
        chatSession = session
      } else if (user) {
        // Create new session
        const { data: newSession, error: sessionError } = await supabase
          .from("ai_chat_sessions")
          .insert({
            user_id: user.id,
            title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
            model: model
          })
          .select()
          .single()
        
        if (!sessionError) {
          chatSession = newSession
        }
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:3001",
          "X-Title": "MindfulSpace - Mental Wellness App",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: getSystemPrompt(),
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      })

      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}))
        console.error("OpenRouter API error:", errorData)
        return res.status(response.status).json({ 
          error: "Failed to get AI response", 
          details: errorData.error?.message || "Unknown error"
        })
      }

      const data: any = await response.json()

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        return res.status(500).json({ error: "Invalid response from AI service" })
      }

      const aiMessage = data.choices[0].message.content

      // Save messages to database if user is authenticated
      if (user && chatSession) {
        await Promise.all([
          // Save user message
          supabase.from("ai_chat_messages").insert({
            session_id: chatSession.id,
            user_id: user.id,
            content: message,
            role: "user"
          }),
          // Save AI response
          supabase.from("ai_chat_messages").insert({
            session_id: chatSession.id,
            user_id: user.id,
            content: aiMessage,
            role: "assistant",
            model: model
          })
        ])
      }

      res.json({
        message: aiMessage,
        model: model,
        sessionId: chatSession?.id || null,
        usage: data.usage,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("Chat API error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
)

// Get chat sessions for authenticated user
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    const { data: sessions, error } = await supabase
      .from("ai_chat_sessions")
      .select(`
        id,
        title,
        model,
        created_at,
        updated_at,
        ai_chat_messages(count)
      `)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    res.json({ sessions: sessions || [] })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    res.status(500).json({ error: "Failed to fetch chat sessions" })
  }
})

// Get messages for a specific session
router.get("/sessions/:sessionId/messages", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "Authentication required" })
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    const { sessionId } = req.params

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from("ai_chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (sessionError || !session) {
      return res.status(404).json({ error: "Session not found" })
    }

    const { data: messages, error } = await supabase
      .from("ai_chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    res.json({ messages: messages || [] })
  } catch (error) {
    console.error("Messages fetch error:", error)
    res.status(500).json({ error: "Failed to fetch messages" })
  }
})

// Create new chat session
router.post("/sessions",
  [body("title").optional().isString().isLength({ max: 200 })],
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).json({ error: "Authentication required" })
      }

      const token = authHeader.replace("Bearer ", "")
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)

      if (authError || !user) {
        return res.status(401).json({ error: "Invalid token" })
      }

      const { title = "New Chat" } = req.body

      const { data: session, error } = await supabase
        .from("ai_chat_sessions")
        .insert({
          user_id: user.id,
          title: title,
          model: "meta-llama/llama-3.1-8b-instruct:free"
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      res.status(201).json({ session })
    } catch (error) {
      console.error("Session creation error:", error)
      res.status(500).json({ error: "Failed to create session" })
    }
  }
)

export default router
