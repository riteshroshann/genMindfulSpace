import { Router, Request, Response } from "express"
import { authenticateUser, optionalAuth } from "../middleware/auth"

const router = Router()

// Predefined soundscape library
const SOUNDSCAPES = {
  anxious: [
    {
      id: 'calm_ocean',
      title: 'Calm Ocean Waves',
      description: 'Gentle ocean sounds to reduce anxiety and promote relaxation',
      duration: 600, // 10 minutes
      url: 'https://www.soundjay.com/misc/sounds-1015.mp3',
      tags: ['nature', 'water', 'calming'],
      mood_match: ['anxious', 'stressed', 'overwhelmed']
    },
    {
      id: 'forest_rain',
      title: 'Peaceful Forest Rain',
      description: 'Soft rainfall in a tranquil forest setting',
      duration: 480,
      url: 'https://www.soundjay.com/nature/sounds-1014.mp3',
      tags: ['nature', 'rain', 'peaceful'],
      mood_match: ['anxious', 'restless', 'worried']
    }
  ],
  sad: [
    {
      id: 'warm_fireplace',
      title: 'Cozy Fireplace',
      description: 'Comforting crackling fire sounds for emotional warmth',
      duration: 720,
      url: 'https://www.soundjay.com/misc/sounds-1016.mp3',
      tags: ['cozy', 'warmth', 'comfort'],
      mood_match: ['sad', 'lonely', 'melancholy']
    },
    {
      id: 'gentle_piano',
      title: 'Gentle Piano Melodies',
      description: 'Soft, uplifting piano music to ease sadness',
      duration: 420,
      url: 'https://www.soundjay.com/music/sounds-1017.mp3',
      tags: ['music', 'piano', 'uplifting'],
      mood_match: ['sad', 'down', 'blue']
    }
  ],
  stressed: [
    {
      id: 'mountain_breeze',
      title: 'Mountain Breeze',
      description: 'Calming mountain wind sounds for stress relief',
      duration: 540,
      url: 'https://www.soundjay.com/nature/sounds-1018.mp3',
      tags: ['nature', 'wind', 'mountains'],
      mood_match: ['stressed', 'pressured', 'tense']
    },
    {
      id: 'meditation_bells',
      title: 'Tibetan Singing Bowls',
      description: 'Resonant bell sounds for deep relaxation and stress relief',
      duration: 600,
      url: 'https://www.soundjay.com/misc/sounds-1019.mp3',
      tags: ['meditation', 'spiritual', 'healing'],
      mood_match: ['stressed', 'anxious', 'overwhelmed']
    }
  ],
  energetic: [
    {
      id: 'morning_birds',
      title: 'Dawn Chorus',
      description: 'Energizing morning bird songs to boost mood',
      duration: 360,
      url: 'https://www.soundjay.com/nature/sounds-1020.mp3',
      tags: ['nature', 'birds', 'morning'],
      mood_match: ['low_energy', 'tired', 'sluggish']
    }
  ],
  peaceful: [
    {
      id: 'zen_garden',
      title: 'Zen Garden',
      description: 'Peaceful sounds of a Japanese zen garden',
      duration: 480,
      url: 'https://www.soundjay.com/misc/sounds-1021.mp3',
      tags: ['zen', 'peaceful', 'meditation'],
      mood_match: ['peaceful', 'content', 'balanced']
    }
  ]
}

// Get mood-based soundscape recommendations
router.get("/recommend/:mood", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { mood } = req.params
    const userId = (req as any).user?.id

    // Normalize mood input
    const normalizedMood = mood.toLowerCase()
    
    // Find matching soundscapes
    let recommendations: any[] = []
    
    // Direct mood match
    if (SOUNDSCAPES[normalizedMood as keyof typeof SOUNDSCAPES]) {
      recommendations = SOUNDSCAPES[normalizedMood as keyof typeof SOUNDSCAPES]
    } else {
      // Search by mood_match tags
      Object.values(SOUNDSCAPES).flat().forEach(soundscape => {
        if (soundscape.mood_match.some(tag => 
          tag.includes(normalizedMood) || normalizedMood.includes(tag)
        )) {
          recommendations.push(soundscape)
        }
      })
    }

    // If no specific matches, provide general calming sounds
    if (recommendations.length === 0) {
      recommendations = [
        ...SOUNDSCAPES.peaceful,
        ...SOUNDSCAPES.anxious.slice(0, 1) // Add one calming sound
      ]
    }

    // Shuffle and limit results
    const shuffled = recommendations.sort(() => 0.5 - Math.random())
    const limited = shuffled.slice(0, 3)

    res.json({
      mood: normalizedMood,
      recommendations: limited,
      totalFound: recommendations.length,
      personalized: !!userId,
      message: userId 
        ? "Personalized recommendations based on your mood" 
        : "General recommendations for your mood"
    })

  } catch (error) {
    console.error('Error getting soundscape recommendations:', error)
    res.status(500).json({ error: "Failed to get recommendations" })
  }
})

// Get all available soundscapes
router.get("/all", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, tag } = req.query

    let soundscapes = Object.values(SOUNDSCAPES).flat()

    // Filter by category if specified
    if (category) {
      const categoryKey = category as string
      if (SOUNDSCAPES[categoryKey as keyof typeof SOUNDSCAPES]) {
        soundscapes = SOUNDSCAPES[categoryKey as keyof typeof SOUNDSCAPES]
      }
    }

    // Filter by tag if specified
    if (tag) {
      soundscapes = soundscapes.filter(s => 
        s.tags.includes(tag as string) || 
        s.mood_match.includes(tag as string)
      )
    }

    res.json({
      soundscapes,
      categories: Object.keys(SOUNDSCAPES),
      totalCount: soundscapes.length
    })

  } catch (error) {
    console.error('Error getting all soundscapes:', error)
    res.status(500).json({ error: "Failed to get soundscapes" })
  }
})

// Log soundscape usage (for analytics and personalization)
router.post("/played", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    const { soundscapeId, duration, mood, completed } = req.body

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // TODO: Store usage data in database for future personalization
    // For now, just return success
    
    res.json({
      success: true,
      message: "Soundscape usage logged",
      data: {
        userId,
        soundscapeId,
        duration,
        mood,
        completed,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error logging soundscape usage:', error)
    res.status(500).json({ error: "Failed to log usage" })
  }
})

// Get user's soundscape history and preferences
router.get("/history", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // TODO: Implement database tracking of user soundscape history
    // For now, return mock data
    
    res.json({
      recentlyPlayed: [],
      favorites: [],
      totalListenTime: 0,
      preferredMoods: ['anxious', 'peaceful'],
      message: "Soundscape history tracking coming soon"
    })

  } catch (error) {
    console.error('Error getting soundscape history:', error)
    res.status(500).json({ error: "Failed to get history" })
  }
})

export default router