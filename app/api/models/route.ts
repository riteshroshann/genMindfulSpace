import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get backend URL from environment, fallback to localhost for development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    
    // Forward the request to our backend
    const response = await fetch(`${backendUrl}/api/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Backend request failed" }))
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Models API proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
