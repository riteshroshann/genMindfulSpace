"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, Loader2, Plus, Settings, Zap } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface ChatSession {
  id: string
  title: string
  created_at: string
}

interface AIModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: any
  top_provider: any
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-3.1-8b-instruct:free")
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeMockData()
    loadAvailableModels()
  }, [])

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId)
    }
  }, [currentSessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadAvailableModels = async () => {
    try {
      const response = await fetch("/api/models")
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models || [])
      } else {
        console.error("Failed to load models")
        // Fallback to default models if API fails
        setAvailableModels([
          {
            id: "meta-llama/llama-3.1-8b-instruct:free",
            name: "Llama 3.1 8B (Free)",
            description: "Fast and capable model, perfect for mental health support",
            context_length: 8192,
            pricing: { prompt: "0" },
            top_provider: {},
          },
        ])
      }
    } catch (error) {
      console.error("Error loading models:", error)
      // Set fallback model
      setAvailableModels([
        {
          id: "meta-llama/llama-3.1-8b-instruct:free",
          name: "Llama 3.1 8B (Free)",
          description: "Fast and capable model, perfect for mental health support",
          context_length: 8192,
          pricing: { prompt: "0" },
          top_provider: {},
        },
      ])
    } finally {
      setIsLoadingModels(false)
    }
  }

  const initializeMockData = () => {
    const mockSessions = [{ id: "session-1", title: "Welcome Chat", created_at: new Date().toISOString() }]
    setSessions(mockSessions)
    setCurrentSessionId("session-1")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = (sessionId: string) => {
    const mockMessages = [
      {
        id: "msg-1",
        role: "assistant" as const,
        content: "Hello! I'm here to listen and support you. How are you feeling today?",
        created_at: new Date().toISOString(),
      },
    ]
    setMessages(mockMessages)
  }

  const createNewSession = () => {
    const mockSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      created_at: new Date().toISOString(),
    }
    setSessions([mockSession, ...sessions])
    setCurrentSessionId(mockSession.id)
    setMessages([])
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentSessionId) return

    setIsLoading(true)
    const userMessage = input.trim()
    setInput("")

    // Add user message to UI immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const data = await response.json()

      // Add AI response to UI
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])

      // Update session title if it's the first message
      if (messages.length <= 1) {
        const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage
        setSessions((prev) => prev.map((s) => (s.id === currentSessionId ? { ...s, title } : s)))
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message to UI
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const isModelFree = (model: AIModel) => {
    return model.pricing?.prompt === "0" || model.id.includes("free")
  }

  const formatModelName = (model: AIModel) => {
    if (isModelFree(model)) {
      return `${model.name} (Free)`
    }
    return model.name
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Chat Sessions</CardTitle>
                      <Button size="sm" onClick={createNewSession} className="h-8 w-8 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-16rem)]">
                      <div className="space-y-2 p-4">
                        {sessions.map((session) => (
                          <Button
                            key={session.id}
                            variant={currentSessionId === session.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left h-auto p-3"
                            onClick={() => setCurrentSessionId(session.id)}
                          >
                            <div className="truncate">
                              <div className="font-medium truncate">{session.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(session.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </Button>
                        ))}
                        {sessions.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No chats yet. Start a conversation!</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="h-full flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">MindfulSpace AI</CardTitle>
                          <p className="text-sm text-muted-foreground">Your empathetic companion</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowModelSelector(!showModelSelector)}
                          className="bg-transparent"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Model
                        </Button>
                      </div>
                    </div>

                    {showModelSelector && (
                      <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">AI Model Selection</h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowModelSelector(false)}>
                              ×
                            </Button>
                          </div>

                          {isLoadingModels ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Loading models...</span>
                            </div>
                          ) : (
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select AI model" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div className="flex items-center space-x-2">
                                      <span>{formatModelName(model)}</span>
                                      {isModelFree(model) && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Zap className="h-3 w-3 mr-1" />
                                          Free
                                        </Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {selectedModel && availableModels.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {availableModels.find((m) => m.id === selectedModel)?.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Heart className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Welcome to your safe space</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              I'm here to listen and support you. Feel free to share what's on your mind - there's no
                              judgment here, only understanding.
                            </p>
                          </div>
                        )}

                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.role === "assistant" && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            {message.role === "user" && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                  You
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Share what's on your mind..."
                          disabled={isLoading || !currentSessionId}
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          disabled={isLoading || !input.trim() || !currentSessionId}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </form>
                      {!currentSessionId && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Create a new chat session to start the conversation
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
