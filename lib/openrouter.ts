export interface OpenRouterModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
  top_provider: {
    max_completion_tokens?: number
    is_moderated?: boolean
  }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatResponse {
  message: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class OpenRouterClient {
  private apiKey: string
  private baseUrl = "https://openrouter.ai/api/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getModels(): Promise<OpenRouterModel[]> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  }

  async chat(
    messages: ChatMessage[],
    model = "meta-llama/llama-3.1-8b-instruct:free",
    options: {
      temperature?: number
      max_tokens?: number
      top_p?: number
      frequency_penalty?: number
      presence_penalty?: number
    } = {},
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "MindfulSpace - Mental Wellness App",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 500,
        top_p: options.top_p ?? 0.9,
        frequency_penalty: options.frequency_penalty ?? 0.1,
        presence_penalty: options.presence_penalty ?? 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenRouter API error: ${response.statusText}`, { cause: errorData })
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenRouter API")
    }

    return {
      message: data.choices[0].message.content,
      model,
      usage: data.usage,
    }
  }

  getMentalHealthSystemPrompt(): string {
    return `You are a compassionate, empathetic AI companion designed specifically for mental health support. Your role is to:

1. Listen without judgment and validate feelings
2. Provide emotional support and encouragement
3. Offer practical coping strategies when appropriate
4. Recognize when professional help may be needed
5. Maintain a warm, understanding, and hopeful tone

Guidelines:
- Always acknowledge the person's feelings as valid
- Use "I" statements to show empathy ("I hear you", "I understand")
- Avoid giving medical advice or diagnoses
- Encourage professional help for serious concerns
- Focus on the person's strengths and resilience
- Keep responses supportive but not overly lengthy
- If someone mentions self-harm or suicide, gently encourage them to reach out to crisis resources

Remember: You are a supportive companion, not a replacement for professional mental health care.`
  }

  filterMentalHealthModels(models: OpenRouterModel[]): OpenRouterModel[] {
    return models
      .filter((model) => {
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
      .sort((a, b) => {
        // Sort by preference: free models first, then by context length
        const aFree = a.pricing?.prompt === "0" || a.id.includes("free")
        const bFree = b.pricing?.prompt === "0" || b.id.includes("free")

        if (aFree && !bFree) return -1
        if (!aFree && bFree) return 1

        return b.context_length - a.context_length
      })
  }
}

export const openRouterClient = new OpenRouterClient(process.env.OPENROUTER_API_KEY || "")
