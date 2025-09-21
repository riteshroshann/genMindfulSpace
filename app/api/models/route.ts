import { NextResponse } from "next/server"

export async function GET() {
  try {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch models" }, { status: response.status })
    }

    const data = await response.json()

    const suitableModels = data.data
      .filter((model: any) => {
        // Filter for models that are good for conversation and mental health support
        const name = model.id.toLowerCase()
        return (
          (name.includes("llama") ||
            name.includes("mistral") ||
            name.includes("qwen") ||
            name.includes("gemma") ||
            name.includes("phi") ||
            name.includes("claude")) &&
          !name.includes("code") && // Exclude code-specific models
          !name.includes("vision") && // Exclude vision models
          model.context_length >= 4000 // Ensure sufficient context
        )
      })
      .map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || "",
        context_length: model.context_length,
        pricing: model.pricing,
        top_provider: model.top_provider,
      }))
      .sort((a: any, b: any) => {
        // Sort by preference: free models first, then by context length
        const aFree = a.pricing?.prompt === "0" || a.id.includes("free")
        const bFree = b.pricing?.prompt === "0" || b.id.includes("free")

        if (aFree && !bFree) return -1
        if (!aFree && bFree) return 1

        return b.context_length - a.context_length
      })

    return NextResponse.json({
      models: suitableModels,
      total: suitableModels.length,
    })
  } catch (error) {
    console.error("Models API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
