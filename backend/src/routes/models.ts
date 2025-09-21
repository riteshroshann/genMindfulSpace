import express, { Request, Response } from "express"
import { query, validationResult } from "express-validator"

const router = express.Router()

// Vertex AI Gemini models available for mental health conversations
const VERTEX_AI_MODELS = [
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    category: "standard",
    description: "Fast and efficient model optimized for conversational AI with excellent safety features",
    strengths: ["Fast responses", "Safety-focused", "Good empathy", "Crisis awareness", "CBT knowledge"],
    suitable_for: ["General support", "Daily check-ins", "Coping strategies", "Crisis support"],
    context_length: 1000000,
    capabilities: ["text", "multimodal"],
    mental_health_optimized: true,
    pricing: "Pay-per-use"
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro", 
    category: "premium",
    description: "Most capable model for complex therapeutic conversations and nuanced emotional support",
    strengths: ["Advanced reasoning", "Deep empathy", "Complex problem solving", "Detailed responses", "Crisis intervention"],
    suitable_for: ["Complex therapy discussions", "Crisis intervention", "Detailed emotional support", "Advanced CBT techniques"],
    context_length: 2000000,
    capabilities: ["text", "multimodal", "advanced_reasoning"],
    mental_health_optimized: true,
    pricing: "Pay-per-use"
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    category: "standard", 
    description: "Reliable model for general mental health conversations with good safety features",
    strengths: ["Reliable", "Good safety", "Balanced responses", "CBT techniques"],
    suitable_for: ["General wellness", "Mood tracking", "Journaling support", "Basic therapy techniques"],
    context_length: 30720,
    capabilities: ["text"],
    mental_health_optimized: true,
    pricing: "Pay-per-use"
  }
]

// Get available AI models
router.get("/", 
  [
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("category").optional().isString().isIn(['standard', 'premium', 'all'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid input", details: errors.array() })
      }

      const { limit = 20, category = 'all' } = req.query
      
      let filteredModels = VERTEX_AI_MODELS
      
      // Filter by category if specified
      if (category !== 'all') {
        filteredModels = VERTEX_AI_MODELS.filter(model => model.category === category)
      }

      res.json({
        models: filteredModels.slice(0, Number(limit)),
        total: filteredModels.length,
        provider: "Google Cloud Vertex AI",
        updated_at: new Date().toISOString()
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

    const model = VERTEX_AI_MODELS.find(m => m.id === modelId)
    
    if (!model) {
      return res.status(404).json({ error: "Model not found" })
    }

    res.json({ 
      model: {
        ...model,
        provider: "Google Cloud Vertex AI",
        safety_features: [
          "Built-in safety filters",
          "Crisis detection",
          "Harmful content blocking",
          "Privacy protection"
        ],
        mental_health_features: [
          "CBT-trained responses",
          "Empathetic communication",
          "Crisis intervention awareness",
          "Therapeutic technique integration"
        ]
      }
    })
  } catch (error) {
    console.error("Model fetch error:", error)
    res.status(500).json({ error: "Failed to fetch model details" })
  }
})

// Get model recommendations for mental health use
router.get("/recommendations/mental-health", async (req: Request, res: Response) => {
  try {
    // Return curated list of Vertex AI models best suited for mental health conversations
    const recommendations = [
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        category: "recommended",
        description: "Best balance of speed, quality, and safety for daily mental health support",
        strengths: ["Fast responses", "Excellent safety", "CBT knowledge", "Crisis awareness"],
        suitable_for: ["Daily check-ins", "General support", "Coping strategies", "Mood tracking"],
        use_case: "primary",
        mental_health_score: 9.5
      },
      {
        id: "gemini-1.5-pro", 
        name: "Gemini 1.5 Pro",
        category: "premium",
        description: "Most advanced model for complex therapeutic conversations and crisis situations",
        strengths: ["Advanced reasoning", "Deep empathy", "Complex problem solving", "Crisis intervention"],
        suitable_for: ["Complex therapy discussions", "Crisis intervention", "Detailed emotional support"],
        use_case: "specialized",
        mental_health_score: 10.0
      },
      {
        id: "gemini-1.0-pro",
        name: "Gemini 1.0 Pro", 
        category: "standard",
        description: "Reliable option for general wellness conversations and basic support",
        strengths: ["Reliable", "Good safety", "Basic CBT techniques", "Cost-effective"],
        suitable_for: ["General wellness", "Journaling support", "Basic emotional support"],
        use_case: "backup",
        mental_health_score: 8.0
      }
    ]

    res.json({
      recommendations,
      provider: "Google Cloud Vertex AI",
      default_model: "gemini-1.5-flash",
      updated_at: new Date().toISOString(),
      note: "All models are optimized for mental health conversations with built-in safety features"
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    res.status(500).json({ error: "Failed to get recommendations" })
  }
})

// Get model capabilities
router.get("/capabilities/mental-health", async (req: Request, res: Response) => {
  try {
    const capabilities = {
      safety_features: [
        "Crisis keyword detection",
        "Harmful content filtering", 
        "Privacy protection",
        "Ethical guideline adherence"
      ],
      therapeutic_features: [
        "Cognitive Behavioral Therapy (CBT) techniques",
        "Empathetic response generation",
        "Emotional validation",
        "Coping strategy suggestions",
        "Mindfulness guidance",
        "Behavioral activation support"
      ],
      crisis_support: [
        "Suicide prevention resources",
        "Crisis hotline information",
        "Emergency contact guidance",
        "Immediate safety planning"
      ],
      conversation_features: [
        "Multi-turn conversation memory",
        "Context-aware responses",
        "Personalized support",
        "Progress tracking integration"
      ],
      supported_languages: [
        "English (primary)",
        "Spanish",
        "French", 
        "German",
        "Portuguese",
        "Italian",
        "And 100+ others"
      ]
    }

    res.json({
      capabilities,
      provider: "Google Cloud Vertex AI",
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error("Capabilities error:", error)
    res.status(500).json({ error: "Failed to get capabilities" })
  }
})

export default router
