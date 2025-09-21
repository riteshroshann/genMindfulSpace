import { Router, Request, Response } from "express"
import { supabase } from "../server"
import { authenticateUser } from "../middleware/auth"

const router = Router()

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first wellness activity',
    icon: '🎯',
    category: 'getting_started',
    maxProgress: 1,
    rewards: { xp: 50, badge: 'Beginner' }
  },
  {
    id: 'breathing_master',
    title: 'Breathing Master',
    description: 'Complete 10 breathing exercises',
    icon: '🫁',
    category: 'mindfulness',
    maxProgress: 10,
    rewards: { xp: 200, badge: 'Zen Master' }
  },
  {
    id: 'gratitude_guru',
    title: 'Gratitude Guru',
    description: 'Write 5 gratitude journal entries',
    icon: '🙏',
    category: 'journaling',
    maxProgress: 5,
    rewards: { xp: 150, badge: 'Grateful Heart' }
  },
  {
    id: 'consistency_champion',
    title: 'Consistency Champion',
    description: 'Log mood for 7 consecutive days',
    icon: '📈',
    category: 'tracking',
    maxProgress: 7,
    rewards: { xp: 300, badge: 'Consistent' }
  },
  {
    id: 'community_connector',
    title: 'Community Connector',
    description: 'Add 3 trusted connections',
    icon: '🤝',
    category: 'social',
    maxProgress: 3,
    rewards: { xp: 100, badge: 'Connected' }
  },
  {
    id: 'ai_companion',
    title: 'AI Companion',
    description: 'Have 5 AI chat conversations',
    icon: '🤖',
    category: 'support',
    maxProgress: 5,
    rewards: { xp: 125, badge: 'Tech Savvy' }
  }
]

// Get user achievements
router.get("/me", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // Get user's achievement progress
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching achievements:', error)
      return res.status(500).json({ error: "Failed to fetch achievements" })
    }

    // Combine achievement definitions with user progress
    const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
      const userProgress = userAchievements?.find(ua => ua.achievement_id === achievement.id)
      
      return {
        ...achievement,
        progress: userProgress?.progress || 0,
        unlocked: userProgress?.unlocked || false,
        unlockedAt: userProgress?.unlocked_at || null,
        percentage: Math.min(100, ((userProgress?.progress || 0) / achievement.maxProgress) * 100)
      }
    })

    // Calculate overall stats
    const totalAchievements = ACHIEVEMENTS.length
    const unlockedCount = achievementsWithProgress.filter(a => a.unlocked).length
    const totalXP = achievementsWithProgress
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.rewards.xp, 0)

    res.json({
      achievements: achievementsWithProgress,
      stats: {
        totalAchievements,
        unlockedCount,
        completionPercentage: Math.round((unlockedCount / totalAchievements) * 100),
        totalXP,
        level: Math.floor(totalXP / 100) + 1
      }
    })

  } catch (error) {
    console.error('Error in achievements endpoint:', error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update achievement progress
router.post("/progress", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { achievementId, increment = 1 } = req.body

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" })
    }

    // Get current progress
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    const currentProgress = existing?.progress || 0
    const newProgress = Math.min(achievement.maxProgress, currentProgress + increment)
    const isNowUnlocked = newProgress >= achievement.maxProgress

    // Upsert progress
    const { error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: newProgress,
        unlocked: isNowUnlocked,
        unlocked_at: isNowUnlocked && !existing?.unlocked ? new Date().toISOString() : existing?.unlocked_at
      })

    if (error) {
      console.error('Error updating achievement:', error)
      return res.status(500).json({ error: "Failed to update achievement" })
    }

    res.json({
      achievementId,
      progress: newProgress,
      maxProgress: achievement.maxProgress,
      unlocked: isNowUnlocked,
      justUnlocked: isNowUnlocked && !existing?.unlocked,
      achievement: achievement
    })

  } catch (error) {
    console.error('Error updating achievement progress:', error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router