import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"

const router = express.Router()

// Cache for models to avoid frequent API calls
let modelsCache: any = null
let cacheExpiry = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Get available AI models
router.get("/", 
  [
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("category").optional().isString().isIn(['free', 'premium', 'all'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { limit = 20, category = 'all' } = req.query
      
      // Check cache first
      if (modelsCache && Date.now() < cacheExpiry) {
        const filteredModels = filterModelsByCategory(modelsCache.models, category as string)
        return res.json({
          models: filteredModels.slice(0, Number(limit)),
          total: filteredModels.length,
          cached: true
        })
      }

      const openRouterApiKey = process.env.OPENROUTER_API_KEY
      if (!openRouterApiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" })
      }

      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
      }

      const data: any = await response.json()

      // Filter models suitable for mental health conversations
      const suitableModels = (data.data || []).filter((model: any) => {
        const modelId = model.id.toLowerCase()
        const modelName = model.name?.toLowerCase() || ""

        // Exclude specialized models not suitable for conversation
        const isNotSuitable = 
          modelId.includes("code") ||
          modelId.includes("vision") ||
          modelId.includes("embed") ||
          modelId.includes("whisper") ||
          modelId.includes("tts") ||
          modelName.includes("code") ||
          modelName.includes("vision") ||
          modelName.includes("embedding")

        if (isNotSuitable) return false

        // Include conversational models
        const isConversational =
          modelId.includes("chat") ||
          modelId.includes("instruct") ||
          modelId.includes("llama") ||
          modelId.includes("mistral") ||
          modelId.includes("claude") ||
          modelId.includes("gpt") ||
          model.context_length >= 4000

        return isConversational
      })

      // Sort by preference (free models first, then by context length)
      suitableModels.sort((a: any, b: any) => {
        const aFree = a.pricing?.prompt === "0" || a.id.includes("free")
        const bFree = b.pricing?.prompt === "0" || b.id.includes("free")

        if (aFree && !bFree) return -1
        if (!aFree && bFree) return 1

        // Then by context length
        return (b.context_length || 0) - (a.context_length || 0)
      })

      // Cache the results
      modelsCache = {
        models: suitableModels,
        timestamp: Date.now()
      }
      cacheExpiry = Date.now() + CACHE_DURATION

      const filteredModels = filterModelsByCategory(suitableModels, category as string)

      res.json({
        models: filteredModels.slice(0, Number(limit)),
        total: filteredModels.length,
        cached: false
      })
    } catch (error) {
      console.error("Models API error:", error)
      res.status(500).json({ 
        error: "Failed to fetch models",
        details: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }
)

// Get specific model details
router.get("/:modelId", async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return res.status(500).json({ error: "OpenRouter API key not configured" })
    }

    // Check cache first
    if (modelsCache && Date.now() < cacheExpiry) {
      const model = modelsCache.models.find((m: any) => m.id === modelId)
      if (model) {
        return res.json({ model })
      }
    }

    const response = await fetch(`https://openrouter.ai/api/v1/models/${modelId}`, {
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Model not found" })
      }
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()

    res.json({ model: data })
  } catch (error) {
    console.error("Model fetch error:", error)
    res.status(500).json({ error: "Failed to fetch model details" })
  }
})

// Helper function to filter models by category
function filterModelsByCategory(models: any[], category: string) {
  switch (category) {
    case 'free':
      return models.filter(model => 
        model.pricing?.prompt === "0" || model.id.includes("free")
      )
    case 'premium':
      return models.filter(model => 
        model.pricing?.prompt !== "0" && !model.id.includes("free")
      )
    case 'all':
    default:
      return models
  }
}

// Get model recommendations for mental health use
router.get("/recommendations/mental-health", async (req: Request, res: Response) => {
  try {
    // Return curated list of models best suited for mental health conversations
    const recommendations = [
      {
        id: "meta-llama/llama-3.1-8b-instruct:free",
        name: "Llama 3.1 8B Instruct (Free)",
        category: "free",
        description: "Excellent for empathetic conversations with good instruction following",
        strengths: ["Free", "Fast responses", "Good empathy", "Reliable"],
        suitable_for: ["General support", "Daily check-ins", "Coping strategies"]
      },
      {
        id: "anthropic/claude-3-haiku",
        name: "Claude 3 Haiku",
        category: "premium",
        description: "Fast and thoughtful responses with strong safety features",
        strengths: ["Safety-focused", "Nuanced responses", "Crisis awareness"],
        suitable_for: ["Crisis support", "Detailed therapy-like conversations", "Complex emotions"]
      },
      {
        id: "mistralai/mistral-7b-instruct:free",
        name: "Mistral 7B Instruct (Free)",
        category: "free",
        description: "Balanced performance for supportive conversations",
        strengths: ["Free", "Multilingual", "Balanced responses"],
        suitable_for: ["General wellness", "Mood tracking", "Journaling support"]
      }
    ]

    res.json({
      recommendations,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    res.status(500).json({ error: "Failed to get recommendations" })
  }
})

export default router
