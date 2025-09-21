import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, model = "meta-llama/llama-3.1-8b-instruct:free" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const systemPrompt = `You are a compassionate, empathetic AI companion designed specifically for mental health support. Your role is to:

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "MindfulSpace - Mental Wellness App",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenRouter API error:", errorData)
      return NextResponse.json({ error: "Failed to get AI response", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: "Invalid response from AI service" }, { status: 500 })
    }

    const aiMessage = data.choices[0].message.content

    return NextResponse.json({
      message: aiMessage,
      model: model,
      usage: data.usage,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
