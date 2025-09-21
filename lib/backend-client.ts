export interface BackendModel {
  id: string
  name: string
  description: string
  provider: string
  contextLength: number
  capabilities: string[]
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

export interface ChatResponse {
  message: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  context?: {
    session_id: string
    conversation_id: string
  }
}

export class BackendClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  }

  async getModels(): Promise<BackendModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Backend API error: ${response.statusText}`, { cause: errorData })
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error("Error fetching models:", error)
      throw error
    }
  }

  async sendMessage(
    message: string,
    model?: string,
    authToken?: string
  ): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const response = await fetch(`${this.baseUrl}/api/chat/message`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          model: model || "gemini-1.5-flash",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Backend API error: ${response.statusText}`, { cause: errorData })
      }

      const data = await response.json()

      if (!data.message) {
        throw new Error("Invalid response from backend API")
      }

      return data
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  async getChatHistory(authToken?: string): Promise<ChatMessage[]> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const response = await fetch(`${this.baseUrl}/api/chat/history`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Backend API error: ${response.statusText}`, { cause: errorData })
      }

      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error("Error fetching chat history:", error)
      throw error
    }
  }

  // Helper method to filter models suitable for mental health support
  filterMentalHealthModels(models: BackendModel[]): BackendModel[] {
    return models.filter(model => {
      const name = model.name.toLowerCase()
      const description = model.description.toLowerCase()
      
      // Prefer models that are good for conversation and mental health
      return (
        model.capabilities.includes('chat') &&
        model.contextLength >= 4000 &&
        !description.includes('code') &&
        !description.includes('vision')
      )
    }).sort((a, b) => {
      // Sort by context length (higher is better for mental health conversations)
      return b.contextLength - a.contextLength
    })
  }
}

// Export a default instance
export const backendClient = new BackendClient()
