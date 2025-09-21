import { Router, Request, Response } from "express"
import { supabase } from "../server"
import { authenticateUser } from "../middleware/auth"

const router = Router()

// Get user streaks
router.get("/me", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // Calculate daily tracking streak
    const { data: moodEntries, error: moodError } = await supabase
      .from('mood_entries')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (moodError) {
      console.error('Error fetching mood entries:', moodError)
      return res.status(500).json({ error: "Failed to fetch mood data" })
    }

    // Calculate journal streak
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (journalError) {
      console.error('Error fetching journal entries:', journalError)
      return res.status(500).json({ error: "Failed to fetch journal data" })
    }

    // Calculate AI chat streak
    const { data: chatSessions, error: chatError } = await supabase
      .from('chat_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (chatError) {
      console.error('Error fetching chat sessions:', chatError)
      return res.status(500).json({ error: "Failed to fetch chat data" })
    }

    // Helper function to calculate streak
    const calculateStreak = (entries: any[]) => {
      if (!entries || entries.length === 0) return 0

      const today = new Date()
      let streak = 0
      let currentDate = new Date(today)

      // Group entries by date
      const entriesByDate = new Set(
        entries.map(entry => 
          new Date(entry.created_at).toDateString()
        )
      )

      // Check if user has activity today or yesterday (allow for timezone differences)
      const todayString = today.toDateString()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      let hasRecentActivity = entriesByDate.has(todayString) || entriesByDate.has(yesterdayString)
      
      if (!hasRecentActivity) return 0

      // Start from yesterday if no activity today, otherwise start from today
      if (!entriesByDate.has(todayString)) {
        currentDate = yesterday
      }

      // Count consecutive days
      while (entriesByDate.has(currentDate.toDateString())) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      }

      return streak
    }

    const moodStreak = calculateStreak(moodEntries || [])
    const journalStreak = calculateStreak(journalEntries || [])
    const chatStreak = calculateStreak(chatSessions || [])

    // Calculate overall wellness streak (any activity)
    const allEntries = [
      ...(moodEntries || []),
      ...(journalEntries || []),
      ...(chatSessions || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const overallStreak = calculateStreak(allEntries)

    // Get streak milestones
    const streakMilestones = [
      { days: 3, title: "Getting Started", reward: "🌱" },
      { days: 7, title: "One Week Strong", reward: "💪" },
      { days: 14, title: "Two Week Champion", reward: "🏆" },
      { days: 30, title: "Monthly Master", reward: "🌟" },
      { days: 60, title: "Consistency King", reward: "👑" },
      { days: 100, title: "Legendary Streak", reward: "🔥" }
    ]

    const getCurrentMilestone = (streak: number) => {
      const achieved = streakMilestones.filter(m => streak >= m.days)
      return achieved[achieved.length - 1] || null
    }

    const getNextMilestone = (streak: number) => {
      return streakMilestones.find(m => streak < m.days) || null
    }

    res.json({
      streaks: {
        overall: {
          current: overallStreak,
          best: overallStreak, // TODO: Track best streak in database
          milestone: getCurrentMilestone(overallStreak),
          nextMilestone: getNextMilestone(overallStreak)
        },
        mood: {
          current: moodStreak,
          best: moodStreak,
          milestone: getCurrentMilestone(moodStreak),
          nextMilestone: getNextMilestone(moodStreak)
        },
        journal: {
          current: journalStreak,
          best: journalStreak,
          milestone: getCurrentMilestone(journalStreak),
          nextMilestone: getNextMilestone(journalStreak)
        },
        chat: {
          current: chatStreak,
          best: chatStreak,
          milestone: getCurrentMilestone(chatStreak),
          nextMilestone: getNextMilestone(chatStreak)
        }
      },
      stats: {
        totalActiveDays: allEntries.length,
        moodEntriesCount: moodEntries?.length || 0,
        journalEntriesCount: journalEntries?.length || 0,
        chatSessionsCount: chatSessions?.length || 0,
        longestStreak: Math.max(overallStreak, moodStreak, journalStreak, chatStreak)
      },
      milestones: streakMilestones
    })

  } catch (error) {
    console.error('Error in streaks endpoint:', error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update streak (called when user completes an activity)
router.post("/update", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { activityType } = req.body // 'mood', 'journal', 'chat'

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // This endpoint can be used to trigger streak calculations
    // For now, just return success as streaks are calculated on-demand
    res.json({ 
      success: true, 
      message: `${activityType} activity recorded for streak tracking`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating streak:', error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router