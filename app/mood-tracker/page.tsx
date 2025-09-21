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
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Plus, Calendar, Award, Target, Activity, Smile, Frown, Meh } from "lucide-react"

interface MoodEntry {
  id: string
  mood_score: number
  energy_level: number
  anxiety_level: number
  notes: string
  activities: string[]
  created_at: string
}

interface MoodStats {
  averageMood: number
  totalEntries: number
  currentStreak: number
  weeklyProgress: number
  moodTrend: "up" | "down" | "stable"
}

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState<MoodStats>({
    averageMood: 0,
    totalEntries: 0,
    currentStreak: 0,
    weeklyProgress: 0,
    moodTrend: "stable",
  })
  const [isLogMoodOpen, setIsLogMoodOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [moodScore, setMoodScore] = useState([5])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [anxietyLevel, setAnxietyLevel] = useState([5])
  const [notes, setNotes] = useState("")
  const [activities, setActivities] = useState("")

  useEffect(() => {
    loadMoodData()
  }, [])

  const loadMoodData = async () => {
    setIsLoading(true)
    const mockData: MoodEntry[] = [
      {
        id: "1",
        mood_score: 7,
        energy_level: 6,
        anxiety_level: 4,
        notes: "Had a good day at work",
        activities: ["work", "exercise"],
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        mood_score: 5,
        energy_level: 5,
        anxiety_level: 6,
        notes: "Feeling neutral today",
        activities: ["reading"],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    setEntries(mockData)
    calculateStats(mockData)
    setIsLoading(false)
  }

  const calculateStats = (moodEntries: MoodEntry[]) => {
    if (moodEntries.length === 0) {
      setStats({
        averageMood: 0,
        totalEntries: 0,
        currentStreak: 0,
        weeklyProgress: 0,
        moodTrend: "stable",
      })
      return
    }

    const averageMood = moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length

    // Calculate current streak (consecutive days with entries)
    const today = new Date()
    let streak = 0
    const sortedEntries = [...moodEntries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].created_at)
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }

    // Calculate weekly progress (entries this week vs last week)
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisWeekEntries = moodEntries.filter((entry) => new Date(entry.created_at) >= oneWeekAgo)
    const weeklyProgress = Math.min((thisWeekEntries.length / 7) * 100, 100)

    // Calculate mood trend (last 7 days vs previous 7 days)
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
    const lastWeekEntries = moodEntries.filter(
      (entry) => new Date(entry.created_at) >= oneWeekAgo && new Date(entry.created_at) < today,
    )
    const previousWeekEntries = moodEntries.filter(
      (entry) => new Date(entry.created_at) >= twoWeeksAgo && new Date(entry.created_at) < oneWeekAgo,
    )

    let moodTrend: "up" | "down" | "stable" = "stable"
    if (lastWeekEntries.length > 0 && previousWeekEntries.length > 0) {
      const lastWeekAvg = lastWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / lastWeekEntries.length
      const previousWeekAvg =
        previousWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / previousWeekEntries.length

      if (lastWeekAvg > previousWeekAvg + 0.5) moodTrend = "up"
      else if (lastWeekAvg < previousWeekAvg - 0.5) moodTrend = "down"
    }

    setStats({
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: moodEntries.length,
      currentStreak: streak,
      weeklyProgress: Math.round(weeklyProgress),
      moodTrend,
    })
  }

  const resetForm = () => {
    setMoodScore([5])
    setEnergyLevel([5])
    setAnxietyLevel([5])
    setNotes("")
    setActivities("")
  }

  const handleLogMood = async () => {
    const entryData: MoodEntry = {
      id: Date.now().toString(),
      mood_score: moodScore[0],
      energy_level: energyLevel[0],
      anxiety_level: anxietyLevel[0],
      notes: notes.trim(),
      activities: activities
        .split(",")
        .map((activity) => activity.trim())
        .filter((activity) => activity.length > 0),
      created_at: new Date().toISOString(),
    }

    const newEntries = [entryData, ...entries]
    setEntries(newEntries)
    calculateStats(newEntries)
    setIsLogMoodOpen(false)
    resetForm()
  }

  const getMoodIcon = (score: number) => {
    if (score <= 4) return <Frown className="h-5 w-5 text-red-500" />
    if (score <= 7) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Smile className="h-5 w-5 text-green-500" />
  }

  const getMoodColor = (score: number) => {
    if (score <= 3) return "bg-red-500"
    if (score <= 5) return "bg-yellow-500"
    if (score <= 7) return "bg-blue-500"
    return "bg-green-500"
  }

  const getMoodLabel = (score: number) => {
    if (score <= 2) return "Very Low"
    if (score <= 4) return "Low"
    if (score <= 6) return "Neutral"
    if (score <= 8) return "Good"
    return "Excellent"
  }

  // Prepare chart data
  const chartData = entries
    .slice(0, 30)
    .reverse()
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mood: entry.mood_score,
      energy: entry.energy_level,
      anxiety: 10 - entry.anxiety_level, // Invert anxiety for better visualization
    }))

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayEntries = entries.filter((entry) => new Date(entry.created_at).toDateString() === date.toDateString())
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      entries: dayEntries.length,
      avgMood:
        dayEntries.length > 0 ? dayEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / dayEntries.length : 0,
    }
  }).reverse()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-bold">Mood Tracker</h1>
                </div>
                <p className="text-muted-foreground">Track your emotional journey and celebrate progress</p>
              </div>
              <Dialog open={isLogMoodOpen} onOpenChange={setIsLogMoodOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Mood
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>How are you feeling?</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label>Mood: {getMoodLabel(moodScore[0])}</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <Frown className="h-4 w-4 text-muted-foreground" />
                        <Slider
                          value={moodScore}
                          onValueChange={setMoodScore}
                          max={10}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <Smile className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        {getMoodIcon(moodScore[0])}
                        <span className="text-sm font-medium">{moodScore[0]}/10</span>
                      </div>
                    </div>

                    <div>
                      <Label>Energy Level</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">Low</span>
                        <Slider
                          value={energyLevel}
                          onValueChange={setEnergyLevel}
                          max={10}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">High</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-sm font-medium">{energyLevel[0]}/10</span>
                      </div>
                    </div>

                    <div>
                      <Label>Anxiety Level</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-muted-foreground">Low</span>
                        <Slider
                          value={anxietyLevel}
                          onValueChange={setAnxietyLevel}
                          max={10}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">High</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-sm font-medium">{anxietyLevel[0]}/10</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="activities">Activities (comma-separated)</Label>
                      <Input
                        id="activities"
                        value={activities}
                        onChange={(e) => setActivities(e.target.value)}
                        placeholder="exercise, work, socializing..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What influenced your mood today?"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsLogMoodOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleLogMood}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Log Entry
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                  <div className={`w-3 h-3 rounded-full ${getMoodColor(stats.averageMood)}`}></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageMood}/10</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.moodTrend === "up" && "↗ Trending up"}
                    {stats.moodTrend === "down" && "↘ Trending down"}
                    {stats.moodTrend === "stable" && "→ Stable"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tracking Streak</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.currentStreak} days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEntries}</div>
                  <p className="text-xs text-muted-foreground">Logged so far</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.weeklyProgress}%</div>
                  <Progress value={stats.weeklyProgress} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Trends (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 10]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                        <Line type="monotone" dataKey="energy" stroke="#06b6d4" strokeWidth={2} name="Energy" />
                        <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} name="Calm" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="entries" fill="#8b5cf6" name="Entries" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Mood Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : entries.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Start tracking to earn badges!</h3>
                        <p className="text-muted-foreground">
                          Log your first mood entry to begin your wellness journey.
                        </p>
                      </div>
                    ) : (
                      entries.slice(0, 10).map((entry) => (
                        <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            {getMoodIcon(entry.mood_score)}
                            <span className="font-medium">{entry.mood_score}</span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                {new Date(entry.created_at).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <div className="flex space-x-2 text-xs">
                                <span>Energy: {entry.energy_level}</span>
                                <span>Anxiety: {entry.anxiety_level}</span>
                              </div>
                            </div>
                            {entry.notes && <p className="text-sm">{entry.notes}</p>}
                            {entry.activities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.activities.map((activity) => (
                                  <Badge key={activity} variant="secondary" className="text-xs">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
