import express, { Request, Response, NextFunction } from "express"
import { body, query, param, validationResult } from "express-validator"
import { supabase } from "../server"

const router = express.Router()

// Middleware to authenticate user for all mood routes
const authenticateMood = async (req: any, res: Response, next: NextFunction) => {
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
router.use(authenticateMood)

// Get mood entries with filtering and pagination
router.get("/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("minScore").optional().isInt({ min: 1, max: 10 }),
    query("maxScore").optional().isInt({ min: 1, max: 10 }),
    query("emotions").optional().isString()
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const {
        page = 1,
        limit = 50,
        startDate,
        endDate,
        minScore,
        maxScore,
        emotions
      } = req.query

      const offset = (Number(page) - 1) * Number(limit)

      let query = supabase
        .from("mood_entries")
        .select("*", { count: "exact" })
        .eq("user_id", req.user.id)

      // Apply filters
      if (startDate) {
        query = query.gte("created_at", startDate)
      }

      if (endDate) {
        query = query.lte("created_at", endDate)
      }

      if (minScore) {
        query = query.gte("mood_score", Number(minScore))
      }

      if (maxScore) {
        query = query.lte("mood_score", Number(maxScore))
      }

      if (emotions) {
        const emotionArray = emotions.split(",").map((emotion: string) => emotion.trim())
        query = query.overlaps("emotions", emotionArray)
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
      console.error("Mood fetch error:", error)
      res.status(500).json({ error: "Failed to fetch mood entries" })
    }
  }
)

// Get single mood entry
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
        .from("mood_entries")
        .select("*")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: "Mood entry not found" })
        }
        throw error
      }

      res.json({ entry: data })
    } catch (error) {
      console.error("Mood entry fetch error:", error)
      res.status(500).json({ error: "Failed to fetch mood entry" })
    }
  }
)

// Create mood entry
router.post("/",
  [
    body("mood_score").isInt({ min: 1, max: 10 }),
    body("emotions").optional().isArray().custom((value) => {
      if (!Array.isArray(value)) return false
      return value.every((emotion: any) => 
        typeof emotion === 'string' && 
        ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'lonely', 'confident', 'overwhelmed', 'content'].includes(emotion)
      )
    }),
    body("notes").optional().isString().isLength({ max: 1000 }).trim(),
    body("activities").optional().isArray().custom((value) => {
      if (!Array.isArray(value)) return false
      return value.every((activity: any) => typeof activity === 'string' && activity.length <= 100)
    }),
    body("sleep_hours").optional().isFloat({ min: 0, max: 24 }),
    body("energy_level").optional().isInt({ min: 1, max: 10 }),
    body("stress_level").optional().isInt({ min: 1, max: 10 }),
    body("social_interactions").optional().isInt({ min: 0, max: 20 })
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const {
        mood_score,
        emotions,
        notes,
        activities,
        sleep_hours,
        energy_level,
        stress_level,
        social_interactions
      } = req.body

      // Check for duplicate entry today
      const today = new Date().toISOString().split('T')[0]
      const { data: existingEntry } = await supabase
        .from("mood_entries")
        .select("id")
        .eq("user_id", req.user.id)
        .gte("created_at", `${today}T00:00:00Z`)
        .lt("created_at", `${today}T23:59:59Z`)
        .single()

      if (existingEntry) {
        return res.status(400).json({ 
          error: "Mood entry already exists for today",
          suggestion: "You can update your existing entry instead"
        })
      }

      const { data, error } = await supabase
        .from("mood_entries")
        .insert({
          user_id: req.user.id,
          mood_score,
          emotions: emotions || [],
          notes: notes?.trim(),
          activities: activities || [],
          sleep_hours,
          energy_level,
          stress_level,
          social_interactions
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      res.status(201).json({ entry: data })
    } catch (error) {
      console.error("Mood create error:", error)
      res.status(500).json({ error: "Failed to create mood entry" })
    }
  }
)

// Update mood entry
router.put("/:id",
  [
    param("id").isUUID(),
    body("mood_score").optional().isInt({ min: 1, max: 10 }),
    body("emotions").optional().isArray(),
    body("notes").optional().isString().isLength({ max: 1000 }),
    body("activities").optional().isArray(),
    body("sleep_hours").optional().isFloat({ min: 0, max: 24 }),
    body("energy_level").optional().isInt({ min: 1, max: 10 }),
    body("stress_level").optional().isInt({ min: 1, max: 10 }),
    body("social_interactions").optional().isInt({ min: 0, max: 20 })
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
        .from("mood_entries")
        .select("id")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({ error: "Mood entry not found" })
        }
        throw fetchError
      }

      const { data, error } = await supabase
        .from("mood_entries")
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
      console.error("Mood update error:", error)
      res.status(500).json({ error: "Failed to update mood entry" })
    }
  }
)

// Delete mood entry
router.delete("/:id",
  [param("id").isUUID()],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid entry ID" })
      }

      const { id } = req.params

      const { error } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", req.user.id)

      if (error) {
        throw error
      }

      res.json({ message: "Mood entry deleted successfully" })
    } catch (error) {
      console.error("Mood delete error:", error)
      res.status(500).json({ error: "Failed to delete mood entry" })
    }
  }
)

// Get mood analytics
router.get("/analytics/overview",
  [
    query("period").optional().isString().isIn(['7d', '30d', '90d', '1y']),
    query("groupBy").optional().isString().isIn(['day', 'week', 'month'])
  ],
  async (req: any, res: any) => {
    try {
      const { period = '30d', groupBy = 'day' } = req.query

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      // Get mood entries for the period
      const { data: moodEntries, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", req.user.id)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      const entries = moodEntries || []

      // Calculate statistics
      const moodScores = entries.map(entry => entry.mood_score).filter(score => score !== null)
      const averageMood = moodScores.length > 0 
        ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length 
        : 0

      const highestMood = moodScores.length > 0 ? Math.max(...moodScores) : 0
      const lowestMood = moodScores.length > 0 ? Math.min(...moodScores) : 0

      // Emotion frequency
      const emotionCounts: { [key: string]: number } = {}
      entries.forEach(entry => {
        (entry.emotions || []).forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
        })
      })

      // Activity frequency
      const activityCounts: { [key: string]: number } = {}
      entries.forEach(entry => {
        (entry.activities || []).forEach((activity: string) => {
          activityCounts[activity] = (activityCounts[activity] || 0) + 1
        })
      })

      // Mood trends (grouped data)
      const moodTrends = groupMoodData(entries, groupBy)

      // Correlations
      const correlations = calculateCorrelations(entries)

      res.json({
        period,
        totalEntries: entries.length,
        statistics: {
          averageMood: Math.round(averageMood * 100) / 100,
          highestMood,
          lowestMood,
          moodVariability: calculateVariability(moodScores)
        },
        trends: moodTrends,
        emotions: Object.entries(emotionCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([emotion, count]) => ({ emotion, count })),
        activities: Object.entries(activityCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([activity, count]) => ({ activity, count })),
        correlations,
        generatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Mood analytics error:", error)
      res.status(500).json({ error: "Failed to fetch mood analytics" })
    }
  }
)

// Helper functions
function groupMoodData(entries: any[], groupBy: string) {
  const groups: { [key: string]: number[] } = {}

  entries.forEach(entry => {
    if (!entry.mood_score) return

    const date = new Date(entry.created_at)
    let key: string

    switch (groupBy) {
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'day':
      default:
        key = date.toISOString().split('T')[0]
        break
    }

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(entry.mood_score)
  })

  return Object.entries(groups).map(([date, scores]) => ({
    date,
    averageMood: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    entryCount: scores.length,
    highestMood: Math.max(...scores),
    lowestMood: Math.min(...scores)
  })).sort((a, b) => a.date.localeCompare(b.date))
}

function calculateVariability(scores: number[]): number {
  if (scores.length < 2) return 0

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
  return Math.round(Math.sqrt(variance) * 100) / 100
}

function calculateCorrelations(entries: any[]) {
  const validEntries = entries.filter(entry => 
    entry.mood_score && entry.sleep_hours !== null && entry.energy_level !== null
  )

  if (validEntries.length < 3) {
    return null
  }

  const moodSleepCorr = calculatePearsonCorrelation(
    validEntries.map(e => e.mood_score),
    validEntries.map(e => e.sleep_hours)
  )

  const moodEnergyCorr = calculatePearsonCorrelation(
    validEntries.map(e => e.mood_score),
    validEntries.map(e => e.energy_level)
  )

  const moodStressCorr = validEntries.filter(e => e.stress_level !== null).length >= 3
    ? calculatePearsonCorrelation(
        validEntries.filter(e => e.stress_level !== null).map(e => e.mood_score),
        validEntries.filter(e => e.stress_level !== null).map(e => e.stress_level)
      )
    : null

  return {
    moodVsSleep: moodSleepCorr,
    moodVsEnergy: moodEnergyCorr,
    moodVsStress: moodStressCorr
  }
}

function calculatePearsonCorrelation(x: number[], y: number[]): number | null {
  if (x.length !== y.length || x.length < 2) return null

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

  if (denominator === 0) return null

  const correlation = numerator / denominator
  return Math.round(correlation * 1000) / 1000
}

export default router
