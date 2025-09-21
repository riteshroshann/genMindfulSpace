"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { BookOpen, Plus, Search, Calendar, Heart, Trash2, Edit, Save, X } from "lucide-react"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood_rating: number
  tags: string[]
  created_at: string
  updated_at: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [moodRating, setMoodRating] = useState([5])
  const [tags, setTags] = useState("")

  useEffect(() => {
    loadMockEntries()
  }, [])

  const loadMockEntries = () => {
    const mockEntries = [
      {
        id: "entry-1",
        title: "Welcome to Your Journal",
        content:
          "This is your private space for reflection and growth. Feel free to write about anything on your mind. Your thoughts are safe here, and this space is entirely yours to explore your feelings, track your progress, and celebrate your journey.",
        mood_rating: 7,
        tags: ["welcome", "reflection"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "entry-2",
        title: "Gratitude Practice",
        content:
          "Today I'm grateful for the small moments of peace I found throughout the day. The morning coffee tasted especially good, and I noticed how the sunlight filtered through my window in a beautiful way.",
        mood_rating: 8,
        tags: ["gratitude", "mindfulness"],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    setEntries(mockEntries)
    setIsLoading(false)
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setMoodRating([5])
    setTags("")
  }

  const handleSaveEntry = () => {
    if (!content.trim()) return

    const entryData = {
      title: title.trim() || "Untitled Entry",
      content: content.trim(),
      mood_rating: moodRating[0],
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }

    const mockEntry = {
      id: `entry-${Date.now()}`,
      ...entryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (isEditing && selectedEntry) {
      setEntries((prev) => prev.map((entry) => (entry.id === selectedEntry.id ? mockEntry : entry)))
      setSelectedEntry(mockEntry)
      setIsEditing(false)
    } else {
      setEntries((prev) => [mockEntry, ...prev])
      setSelectedEntry(mockEntry)
      setIsNewEntryOpen(false)
    }
    resetForm()
  }

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null)
    }
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setMoodRating([entry.mood_rating])
    setTags(entry.tags.join(", "))
    setIsEditing(true)
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getMoodColor = (rating: number) => {
    if (rating <= 3) return "bg-red-500"
    if (rating <= 5) return "bg-yellow-500"
    if (rating <= 7) return "bg-blue-500"
    return "bg-green-500"
  }

  const getMoodLabel = (rating: number) => {
    if (rating <= 2) return "Very Low"
    if (rating <= 4) return "Low"
    if (rating <= 6) return "Neutral"
    if (rating <= 8) return "Good"
    return "Excellent"
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Journal Entries</CardTitle>
                      </div>
                      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>New Journal Entry</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title">Title (optional)</Label>
                              <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Give your entry a title..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="content">Your thoughts</Label>
                              <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind today? This is your safe space to express yourself..."
                                className="min-h-[200px] resize-none"
                              />
                            </div>
                            <div>
                              <Label>Mood Rating: {getMoodLabel(moodRating[0])}</Label>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-muted-foreground">1</span>
                                <Slider
                                  value={moodRating}
                                  onValueChange={setMoodRating}
                                  max={10}
                                  min={1}
                                  step={1}
                                  className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">10</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <div className={`w-3 h-3 rounded-full ${getMoodColor(moodRating[0])}`}></div>
                                <span className="text-sm font-medium">{moodRating[0]}/10</span>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="tags">Tags (comma-separated)</Label>
                              <Input
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="gratitude, reflection, goals..."
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSaveEntry}
                                disabled={!content.trim()}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Entry
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                      <div className="space-y-2 p-4">
                        {isLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          </div>
                        ) : filteredEntries.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              {searchTerm ? "No entries found" : "No journal entries yet. Start writing!"}
                            </p>
                          </div>
                        ) : (
                          filteredEntries.map((entry) => (
                            <Card
                              key={entry.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedEntry?.id === entry.id ? "ring-2 ring-primary" : ""
                              }`}
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <h3 className="font-medium text-sm truncate flex-1">{entry.title}</h3>
                                    <div className="flex items-center space-x-1 ml-2">
                                      <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood_rating)}`}></div>
                                      <span className="text-xs text-muted-foreground">{entry.mood_rating}</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{entry.content}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {entry.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {entry.tags.slice(0, 2).map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {entry.tags.length > 2 && (
                                          <Badge variant="secondary" className="text-xs px-1 py-0">
                                            +{entry.tags.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  {selectedEntry ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            {isEditing ? (
                              <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Entry title..."
                                className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                              />
                            ) : (
                              <CardTitle className="text-xl">{selectedEntry.title}</CardTitle>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(selectedEntry.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${getMoodColor(selectedEntry.mood_rating)}`}
                                ></div>
                                <span>Mood: {getMoodLabel(selectedEntry.mood_rating)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isEditing ? (
                              <>
                                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSaveEntry}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleEditEntry(selectedEntry)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteEntry(selectedEntry.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-6">
                        <div className="space-y-4 h-full">
                          {isEditing ? (
                            <div className="space-y-4">
                              <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[300px] resize-none border-none p-0 focus-visible:ring-0"
                                placeholder="Your thoughts..."
                              />
                              <div>
                                <Label>Mood Rating: {getMoodLabel(moodRating[0])}</Label>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-sm text-muted-foreground">1</span>
                                  <Slider
                                    value={moodRating}
                                    onValueChange={setMoodRating}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="flex-1"
                                  />
                                  <span className="text-sm text-muted-foreground">10</span>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit-tags">Tags</Label>
                                <Input
                                  id="edit-tags"
                                  value={tags}
                                  onChange={(e) => setTags(e.target.value)}
                                  placeholder="gratitude, reflection, goals..."
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <ScrollArea className="h-[400px]">
                                <div className="prose prose-sm max-w-none">
                                  <p className="whitespace-pre-wrap leading-relaxed">{selectedEntry.content}</p>
                                </div>
                              </ScrollArea>
                              {selectedEntry.tags.length > 0 && (
                                <div className="border-t pt-4">
                                  <div className="flex flex-wrap gap-2">
                                    {selectedEntry.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
                          <Heart className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Your Private Journal</h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            This is your safe space for reflection and personal growth. Select an entry to read, or
                            create a new one to start writing.
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsNewEntryOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Write Your First Entry
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
