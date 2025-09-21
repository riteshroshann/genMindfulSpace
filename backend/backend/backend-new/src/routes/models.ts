import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { vertexAI } from "../server"

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

      const limit = parseInt(req.query.limit as string) || 20
      const category = req.query.category as string || 'all'

      // Check cache first
      if (modelsCache && Date.now() < cacheExpiry) {
        return res.json(modelsCache)
      }

      // For Vertex AI, we provide a static list of available models
      const availableModels = [
        {
          id: "gemini-1.5-pro",
          name: "Gemini 1.5 Pro",
          description: "Most capable multimodal model with best performance on text, code, and multimodal tasks",
          context_length: 2097152,
          pricing: {
            prompt: "$0.00125",
            completion: "$0.00375",
            currency: "USD",
            unit: "1K tokens"
          },
          top_provider: {
            name: "Google",
            url: "https://cloud.google.com/vertex-ai"
          },
          category: "premium",
          supported_features: ["chat", "vision", "code", "reasoning"],
          mental_health_optimized: true
        },
        {
          id: "gemini-1.5-flash",
          name: "Gemini 1.5 Flash",
          description: "Fast and versatile performance across diverse tasks with high volume and efficiency",
          context_length: 1048576,
          pricing: {
            prompt: "$0.000075",
            completion: "$0.0003",
            currency: "USD",
            unit: "1K tokens"
          },
          top_provider: {
            name: "Google",
            url: "https://cloud.google.com/vertex-ai"
          },
          category: "free",
          supported_features: ["chat", "vision", "code", "reasoning"],
          mental_health_optimized: true
        },
        {
          id: "gemini-1.0-pro",
          name: "Gemini 1.0 Pro",
          description: "Previous generation Gemini model, still highly capable for text tasks",
          context_length: 32768,
          pricing: {
            prompt: "$0.0005",
            completion: "$0.0015",
            currency: "USD",
            unit: "1K tokens"
          },
          top_provider: {
            name: "Google",
            url: "https://cloud.google.com/vertex-ai"
          },
          category: "free",
          supported_features: ["chat", "reasoning"],
          mental_health_optimized: true
        }
      ]

      // Filter by category
      let filteredModels = availableModels
      if (category !== 'all') {
        filteredModels = availableModels.filter(model => model.category === category)
      }

      // Apply limit
      if (limit < filteredModels.length) {
        filteredModels = filteredModels.slice(0, limit)
      }

      const response = {
        models: filteredModels,
        total: filteredModels.length,
        limit: limit,
        category: category,
        provider: "Google Vertex AI",
        last_updated: new Date().toISOString(),
        mental_health_features: {
          crisis_detection: true,
          cbt_integration: true,
          sentiment_analysis: true,
          privacy_focused: true
        }
      }

      // Cache the response
      modelsCache = response
      cacheExpiry = Date.now() + CACHE_DURATION

      res.json(response)
    } catch (error) {
      console.error("Error fetching models:", error)
      res.status(500).json({ 
        error: "Failed to fetch available models",
        provider: "Google Vertex AI"
      })
    }
  }
)

// Get model recommendations based on use case
router.get("/recommendations",
  [
    query("use_case").optional().isString().isIn(['chat', 'analysis', 'crisis', 'general']),
    query("performance_tier").optional().isString().isIn(['fast', 'balanced', 'premium'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const useCase = req.query.use_case as string || 'general'
      const performanceTier = req.query.performance_tier as string || 'balanced'

      let recommendations: any = {}

      switch (useCase) {
        case 'chat':
          recommendations = {
            primary: "gemini-1.5-flash",
            alternatives: ["gemini-1.5-pro", "gemini-1.0-pro"],
            reasoning: "Gemini 1.5 Flash provides excellent conversational abilities with fast response times, ideal for mental health chat interactions."
          }
          break
        case 'crisis':
          recommendations = {
            primary: "gemini-1.5-pro",
            alternatives: ["gemini-1.5-flash"],
            reasoning: "Gemini 1.5 Pro offers the most sophisticated understanding for crisis detection and appropriate response generation."
          }
          break
        case 'analysis':
          recommendations = {
            primary: "gemini-1.5-pro",
            alternatives: ["gemini-1.5-flash"],
            reasoning: "Gemini 1.5 Pro excels at analyzing journal entries, mood patterns, and providing therapeutic insights."
          }
          break
        default:
          recommendations = {
            primary: "gemini-1.5-flash",
            alternatives: ["gemini-1.5-pro", "gemini-1.0-pro"],
            reasoning: "Gemini 1.5 Flash provides the best balance of capability and efficiency for general mental health applications."
          }
      }

      // Adjust based on performance tier
      if (performanceTier === 'fast') {
        recommendations.primary = "gemini-1.5-flash"
      } else if (performanceTier === 'premium') {
        recommendations.primary = "gemini-1.5-pro"
      }

      res.json({
        use_case: useCase,
        performance_tier: performanceTier,
        recommendations: recommendations,
        features: {
          mental_health_focused: true,
          crisis_detection: true,
          cbt_trained: true,
          privacy_compliant: true
        }
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
      res.status(500).json({ error: "Failed to generate model recommendations" })
    }
  }
)

// Get model capabilities and specifications
router.get("/:modelId", async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params

    const modelSpecs: Record<string, any> = {
      "gemini-1.5-pro": {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Google's most capable multimodal model with advanced reasoning capabilities",
        context_length: 2097152,
        max_output_tokens: 8192,
        input_modalities: ["text", "image", "video", "audio"],
        output_modalities: ["text"],
        capabilities: {
          reasoning: "excellent",
          creativity: "high",
          coding: "excellent",
          multimodal: "excellent",
          mental_health: "optimized"
        },
        safety_features: {
          content_filtering: true,
          bias_mitigation: true,
          harmful_content_detection: true,
          crisis_intervention: true
        },
        pricing: {
          input_tokens: "$0.00125 per 1K tokens",
          output_tokens: "$0.00375 per 1K tokens"
        }
      },
      "gemini-1.5-flash": {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        description: "Fast and efficient model optimized for high-volume applications",
        context_length: 1048576,
        max_output_tokens: 8192,
        input_modalities: ["text", "image", "video", "audio"],
        output_modalities: ["text"],
        capabilities: {
          reasoning: "good",
          creativity: "good",
          coding: "good",
          multimodal: "good",
          mental_health: "optimized"
        },
        safety_features: {
          content_filtering: true,
          bias_mitigation: true,
          harmful_content_detection: true,
          crisis_intervention: true
        },
        pricing: {
          input_tokens: "$0.000075 per 1K tokens",
          output_tokens: "$0.0003 per 1K tokens"
        }
      },
      "gemini-1.0-pro": {
        id: "gemini-1.0-pro",
        name: "Gemini 1.0 Pro",
        description: "Previous generation model, still highly capable for text tasks",
        context_length: 32768,
        max_output_tokens: 2048,
        input_modalities: ["text"],
        output_modalities: ["text"],
        capabilities: {
          reasoning: "good",
          creativity: "good",
          coding: "fair",
          multimodal: "none",
          mental_health: "basic"
        },
        safety_features: {
          content_filtering: true,
          bias_mitigation: true,
          harmful_content_detection: true,
          crisis_intervention: true
        },
        pricing: {
          input_tokens: "$0.0005 per 1K tokens",
          output_tokens: "$0.0015 per 1K tokens"
        }
      }
    }

    const modelSpec = modelSpecs[modelId]
    if (!modelSpec) {
      return res.status(404).json({ error: "Model not found" })
    }

    res.json({
      model: modelSpec,
      provider: "Google Vertex AI",
      mental_health_features: {
        cbt_integration: true,
        crisis_detection: true,
        empathetic_responses: true,
        privacy_focused: true
      }
    })
  } catch (error) {
    console.error("Error fetching model details:", error)
    res.status(500).json({ error: "Failed to fetch model details" })
  }
})

export default router