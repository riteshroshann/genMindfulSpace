import express, { Request, Response, NextFunction } from "express"
import { body, query, param, validationResult } from "express-validator"
import { supabase } from "../server"

const router = express.Router()

// Middleware to authenticate user for all journal routes
const authenticateJournal = async (req: any, res: Response, next: NextFunction) => {
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

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json({ error: "Authentication failed" })
  }
}

// Apply authentication middleware to all routes
router.use(authenticateJournal)

// Get journal entries with pagination and filtering
router.get("/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("mood").optional().isString(),
    query("search").optional().isString().isLength({ max: 100 }),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("tags").optional().isString()
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const {
        page = 1,
        limit = 20,
        mood,
        search,
        startDate,
        endDate,
        tags
      } = req.query

      const offset = (Number(page) - 1) * Number(limit)

      let query = supabase
        .from("journal_entries")
        .select("*", { count: "exact" })
        .eq("user_id", req.user.id)

      // Apply filters
      if (mood) {
        query = query.eq("mood", mood)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      if (startDate) {
        query = query.gte("created_at", startDate)
      }

      if (endDate) {
        query = query.lte("created_at", endDate)
      }

      if (tags) {
        const tagArray = tags.split(",").map((tag: string) => tag.trim())
        query = query.contains("tags", tagArray)
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + Number(limit) - 1)

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / Number(limit))

      res.json({
        entries: data || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      })
    } catch (error) {
      console.error("Journal fetch error:", error)
      res.status(500).json({ error: "Failed to fetch journal entries" })
    }
  }
)

// Get single journal entry
router.get("/:id",
  [param("id").isUUID()],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid entry ID" })
      }

      const { id } = req.params

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: "Journal entry not found" })
        }
        throw error
      }

      res.json({ entry: data })
    } catch (error) {
      console.error("Journal entry fetch error:", error)
      res.status(500).json({ error: "Failed to fetch journal entry" })
    }
  }
)

// Create journal entry
router.post("/",
  [
    body("title").isString().isLength({ min: 1, max: 200 }).trim(),
    body("content").isString().isLength({ min: 1, max: 10000 }).trim(),
    body("mood").optional().isString().isIn([
      "very_happy", "happy", "neutral", "sad", "very_sad",
      "excited", "calm", "anxious", "angry", "grateful"
    ]),
    body("tags").optional().isArray().custom((value) => {
      return value.every((tag: any) => typeof tag === 'string' && tag.length <= 50)
    }),
    body("is_private").optional().isBoolean()
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { title, content, mood, tags, is_private = true } = req.body

      // Clean and validate tags
      const cleanTags = tags ? tags.filter((tag: string) => tag.trim().length > 0).slice(0, 10) : []

      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: req.user.id,
          title: title.trim(),
          content: content.trim(),
          mood,
          tags: cleanTags,
          is_private
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      res.status(201).json({ entry: data })
    } catch (error) {
      console.error("Journal create error:", error)
      res.status(500).json({ error: "Failed to create journal entry" })
    }
  }
)

// Update journal entry
router.put("/:id",
  [
    param("id").isUUID(),
    body("title").optional().isString().isLength({ min: 1, max: 200 }).trim(),
    body("content").optional().isString().isLength({ min: 1, max: 10000 }).trim(),
    body("mood").optional().isString().isIn([
      "very_happy", "happy", "neutral", "sad", "very_sad",
      "excited", "calm", "anxious", "angry", "grateful"
    ]),
    body("tags").optional().isArray(),
    body("is_private").optional().isBoolean()
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { id } = req.params
      const updates = req.body

      // Check if entry exists and belongs to user
      const { data: existing, error: fetchError } = await supabase
        .from("journal_entries")
        .select("id")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: "Journal entry not found" })
        }
        throw fetchError
      }

      // Clean tags if provided
      if (updates.tags) {
        updates.tags = updates.tags.filter((tag: string) => tag.trim().length > 0).slice(0, 10)
      }

      // Update entry
      const { data, error } = await supabase
        .from("journal_entries")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      res.json({ entry: data })
    } catch (error) {
      console.error("Journal update error:", error)
      res.status(500).json({ error: "Failed to update journal entry" })
    }
  }
)

// Delete journal entry
router.delete("/:id",
  [param("id").isUUID()],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid entry ID" })
      }

      const { id } = req.params

      // Check if entry exists and belongs to user
      const { data: existing, error: fetchError } = await supabase
        .from("journal_entries")
        .select("id")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: "Journal entry not found" })
        }
        throw fetchError
      }

      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", req.user.id)

      if (error) {
        throw error
      }

      res.json({ message: "Journal entry deleted successfully" })
    } catch (error) {
      console.error("Journal delete error:", error)
      res.status(500).json({ error: "Failed to delete journal entry" })
    }
  }
)

// Get journal statistics
router.get("/stats/overview", async (req: any, res: any) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Get total count
    const { count: totalEntries } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.user.id)

    // Get count from last 30 days
    const { count: recentEntries } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())

    // Get mood distribution
    const { data: moodData } = await supabase
      .from("journal_entries")
      .select("mood")
      .eq("user_id", req.user.id)
      .not("mood", "is", null)

    const moodCounts = (moodData || []).reduce((acc: any, entry: any) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})

    // Get most used tags
    const { data: tagData } = await supabase
      .from("journal_entries")
      .select("tags")
      .eq("user_id", req.user.id)
      .not("tags", "is", null)

    const tagCounts = (tagData || []).reduce((acc: any, entry: any) => {
      (entry.tags || []).forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))

    res.json({
      totalEntries: totalEntries || 0,
      recentEntries: recentEntries || 0,
      moodDistribution: moodCounts,
      topTags,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Journal stats error:", error)
    res.status(500).json({ error: "Failed to fetch journal statistics" })
  }
})

export default router
