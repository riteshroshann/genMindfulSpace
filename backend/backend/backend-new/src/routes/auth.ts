import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { supabase } from "../server"

const router = express.Router()

// Verify JWT token
router.post("/verify", 
  [body("token").isString().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { token } = req.body
      
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return res.status(401).json({ error: "Invalid token", details: error?.message })
      }

      res.json({ 
        valid: true, 
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        }
      })
    } catch (error) {
      console.error("Token verification error:", error)
      res.status(500).json({ error: "Token verification failed" })
    }
  }
)

// Get current user from auth header
router.get("/user", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" })
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token", details: error?.message })
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Profile fetch error:", profileError)
    }

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        profile: profile || null
      }
    })
  } catch (error) {
    console.error("User fetch error:", error)
    res.status(500).json({ error: "Failed to fetch user data" })
  }
})

// Refresh user session
router.post("/refresh",
  [body("refreshToken").isString().notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { refreshToken } = req.body

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error || !data.session) {
        return res.status(401).json({ error: "Failed to refresh session", details: error?.message })
      }

      res.json({
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          user: {
            id: data.session.user.id,
            email: data.session.user.email
          }
        }
      })
    } catch (error) {
      console.error("Session refresh error:", error)
      res.status(500).json({ error: "Session refresh failed" })
    }
  }
)

// Logout - invalidate session
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" })
    }

    const token = authHeader.replace("Bearer ", "")
    
    const { error } = await supabase.auth.admin.signOut(token)
    
    if (error) {
      console.error("Logout error:", error)
      // Don't fail if logout doesn't work on server side
    }

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    res.json({ message: "Logged out successfully" }) // Always succeed for logout
  }
})

export default router