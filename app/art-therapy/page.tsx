"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Download, Share2, Heart, Brush, Eraser, Save, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface ArtWork {
  id: string
  title: string
  description: string
  canvas_data: string
  created_at: string
  likes_count: number
  user_has_liked: boolean
  anonymous_name: string
}

export default function ArtTherapyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState("brush")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [artworks, setArtworks] = useState<ArtWork[]>([])
  const [user, setUser] = useState<any>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [artTitle, setArtTitle] = useState("")
  const [artDescription, setArtDescription] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const supabase = createClient()
  const router = useRouter()

  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
    "#90EE90",
    "#FFB6C1",
    "#20B2AA",
  ]

  useEffect(() => {
    checkUser()
    loadArtworks()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user || { id: "guest", email: "guest@example.com" })
  }

  const loadArtworks = async () => {
    // Mock artworks for development
    const mockArtworks = [
      {
        id: "art-1",
        title: "Peaceful Sunset",
        description: "Created during a moment of calm reflection",
        canvas_data: "",
        created_at: new Date().toISOString(),
        likes_count: 12,
        user_has_liked: false,
        anonymous_name: "CreativeSpirit42",
      },
      {
        id: "art-2",
        title: "Emotional Release",
        description: "Expressing feelings through abstract colors",
        canvas_data: "",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        likes_count: 8,
        user_has_liked: true,
        anonymous_name: "ArtfulHeart23",
      },
    ]
    setArtworks(mockArtworks)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.strokeStyle = currentTool === "eraser" ? "white" : currentColor

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveArtwork = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const canvasData = canvas.toDataURL()

    const artworkData = {
      title: artTitle.trim() || "Untitled Artwork",
      description: artDescription.trim(),
      canvas_data: canvasData,
      anonymous_name: generateAnonymousName(),
      user_id: user?.id || "guest",
    }

    // Mock save for development
    const newArtwork = {
      id: `art-${Date.now()}`,
      ...artworkData,
      created_at: new Date().toISOString(),
      likes_count: 0,
      user_has_liked: false,
    }

    setArtworks([newArtwork, ...artworks])
    setIsSaveDialogOpen(false)
    setArtTitle("")
    setArtDescription("")
  }

  const generateAnonymousName = () => {
    const adjectives = ["Creative", "Artistic", "Expressive", "Colorful", "Inspired", "Peaceful", "Vibrant", "Gentle"]
    const nouns = ["Artist", "Creator", "Painter", "Dreamer", "Soul", "Spirit", "Heart", "Mind"]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adjective}${noun}${Math.floor(Math.random() * 100)}`
  }

  const downloadArtwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "my-artwork.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Palette className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Art Therapy</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Express your emotions through art. Create, share, and find healing through creative expression in a
                supportive community.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Art</TabsTrigger>
                <TabsTrigger value="gallery">Community Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Tools Panel */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tools</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Drawing Tools */}
                        <div>
                          <Label className="text-sm font-medium">Drawing Tools</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button
                              variant={currentTool === "brush" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentTool("brush")}
                            >
                              <Brush className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={currentTool === "eraser" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentTool("eraser")}
                            >
                              <Eraser className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Brush Size */}
                        <div>
                          <Label className="text-sm font-medium">Brush Size: {brushSize}px</Label>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-full mt-2"
                          />
                        </div>

                        {/* Colors */}
                        <div>
                          <Label className="text-sm font-medium">Colors</Label>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded border-2 ${
                                  currentColor === color ? "border-primary" : "border-gray-300"
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setCurrentColor(color)}
                              />
                            ))}
                          </div>
                          <Input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-full mt-2 h-8"
                          />
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <Button onClick={clearCanvas} variant="outline" className="w-full bg-transparent">
                            Clear Canvas
                          </Button>
                          <Button onClick={downloadArtwork} variant="outline" className="w-full bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                                <Save className="h-4 w-4 mr-2" />
                                Save & Share
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Save Your Artwork</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="art-title">Title (optional)</Label>
                                  <Input
                                    id="art-title"
                                    value={artTitle}
                                    onChange={(e) => setArtTitle(e.target.value)}
                                    placeholder="Give your artwork a title..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="art-description">Description (optional)</Label>
                                  <Textarea
                                    id="art-description"
                                    value={artDescription}
                                    onChange={(e) => setArtDescription(e.target.value)}
                                    placeholder="Share what this artwork means to you..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                  <p className="text-sm text-blue-800">
                                    Your artwork will be shared anonymously in the community gallery to inspire others.
                                  </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={saveArtwork}>Save & Share</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Canvas */}
                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Canvas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                          <canvas
                            ref={canvasRef}
                            width={800}
                            height={600}
                            className="border border-gray-200 rounded cursor-crosshair max-w-full h-auto"
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseMove={draw}
                            onMouseLeave={stopDrawing}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Let your creativity flow. There's no right or wrong way to express yourself.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Community Gallery</h2>
                  <p className="text-sm text-muted-foreground">Discover inspiring artwork from our community</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artworks.map((artwork) => (
                    <Card key={artwork.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Palette className="h-12 w-12 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{artwork.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {artwork.description || "A beautiful expression of creativity"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">by {artwork.anonymous_name}</span>
                            <span className="text-muted-foreground">{getTimeAgo(artwork.created_at)}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={artwork.user_has_liked ? "text-red-500" : "text-muted-foreground"}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${artwork.user_has_liked ? "fill-current" : ""}`} />
                              {artwork.likes_count}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {artworks.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No artworks yet</h3>
                      <p className="text-muted-foreground mb-4">Be the first to share your creative expression!</p>
                      <Button onClick={() => setActiveTab("create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Artwork
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
