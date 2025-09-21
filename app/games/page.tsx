"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, Trophy, Target, Heart, Zap, Shield, Star } from "lucide-react"
import Link from "next/link"

export default function GamesPage() {
  const [gameStats] = useState([
    { id: "1", game_type: "breathing", score: 85, completed_at: new Date().toISOString() },
    { id: "2", game_type: "gratitude", score: 92, completed_at: new Date(Date.now() - 86400000).toISOString() },
  ])

  const games = [
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Guided breathing techniques to reduce anxiety and promote calm",
      icon: <Heart className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      difficulty: "Beginner",
      duration: "3-5 min",
      benefits: ["Reduces anxiety", "Improves focus", "Promotes calm"],
    },
    {
      id: "gratitude",
      title: "Gratitude Challenge",
      description: "Interactive exercises to build appreciation and positive thinking",
      icon: <Star className="h-8 w-8" />,
      color: "from-yellow-500 to-yellow-600",
      difficulty: "Easy",
      duration: "5-10 min",
      benefits: ["Boosts mood", "Increases optimism", "Builds resilience"],
    },
    {
      id: "mindfulness",
      title: "Mindfulness Moments",
      description: "Quick mindfulness exercises for present-moment awareness",
      icon: <Brain className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      difficulty: "Intermediate",
      duration: "5-15 min",
      benefits: ["Reduces stress", "Improves awareness", "Enhances focus"],
    },
    {
      id: "cognitive",
      title: "Thought Challenger",
      description: "Cognitive exercises to reframe negative thinking patterns",
      icon: <Shield className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      difficulty: "Intermediate",
      duration: "10-15 min",
      benefits: ["Challenges negative thoughts", "Builds mental strength", "Improves perspective"],
    },
    {
      id: "stress-relief",
      title: "Stress Buster",
      description: "Quick stress-relief techniques for overwhelming moments",
      icon: <Zap className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600",
      difficulty: "Beginner",
      duration: "2-5 min",
      benefits: ["Quick relief", "Reduces tension", "Restores balance"],
    },
    {
      id: "confidence",
      title: "Confidence Builder",
      description: "Activities designed to boost self-esteem and inner strength",
      icon: <Trophy className="h-8 w-8" />,
      color: "from-pink-500 to-pink-600",
      difficulty: "Advanced",
      duration: "10-20 min",
      benefits: ["Builds confidence", "Improves self-image", "Strengthens resilience"],
    },
  ]

  const achievements = [
    {
      id: "first_game",
      title: "First Steps",
      description: "Complete your first resilience game",
      icon: "🎯",
      unlocked: gameStats.length > 0,
    },
    {
      id: "breathing_master",
      title: "Breathing Master",
      description: "Complete 5 breathing exercises",
      icon: "🫁",
      unlocked: gameStats.filter((s) => s.game_type === "breathing").length >= 1,
    },
    {
      id: "gratitude_guru",
      title: "Gratitude Guru",
      description: "Complete 10 gratitude challenges",
      icon: "🙏",
      unlocked: gameStats.filter((s) => s.game_type === "gratitude").length >= 1,
    },
  ]

  const getGameStats = (gameType: string) => {
    const stats = gameStats.filter((s) => s.game_type === gameType)
    return {
      timesPlayed: stats.length,
      bestScore: stats.length > 0 ? Math.max(...stats.map((s) => s.score)) : 0,
      lastPlayed: stats.length > 0 ? new Date(stats[0].completed_at).toLocaleDateString() : "Never",
    }
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const totalAchievements = achievements.length
  const achievementProgress = (unlockedAchievements.length / totalAchievements) * 100

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Resilience Games</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Build emotional strength and coping skills through interactive mini-games designed by mental health
                experts.
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Games Completed</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{gameStats.length}</div>
                  <p className="text-xs text-muted-foreground">Total sessions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {unlockedAchievements.length}/{totalAchievements}
                  </div>
                  <Progress value={achievementProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skill Level</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gameStats.length < 5 ? "Beginner" : gameStats.length < 20 ? "Intermediate" : "Advanced"}
                  </div>
                  <p className="text-xs text-muted-foreground">Keep playing to level up!</p>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.unlocked ? "border-primary bg-primary/5" : "border-muted bg-muted/20 opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{achievement.title}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && <Badge variant="secondary">Unlocked</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => {
                const stats = getGameStats(game.id)
                return (
                  <Card key={game.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                      >
                        {game.icon}
                      </div>
                      <CardTitle className="text-xl">{game.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{game.difficulty}</Badge>
                          <span className="text-muted-foreground">{game.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {game.benefits.map((benefit) => (
                            <Badge key={benefit} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {stats.timesPlayed > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Played: {stats.timesPlayed} times</span>
                            <span>Best: {stats.bestScore}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Last played: {stats.lastPlayed}</div>
                        </div>
                      )}

                      <Button asChild className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white`}>
                        <Link href={`/games/${game.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {stats.timesPlayed > 0 ? "Play Again" : "Start Game"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
