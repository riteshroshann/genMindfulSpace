"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BreathingGamePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale")
  const [cycleCount, setCycleCount] = useState(0)
  const [totalCycles, setTotalCycles] = useState(5)
  const [timeRemaining, setTimeRemaining] = useState(4)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  }

  const phaseInstructions = {
    inhale: "Breathe in slowly through your nose",
    hold: "Hold your breath gently",
    exhale: "Breathe out slowly through your mouth",
    rest: "Rest and prepare for the next breath",
  }

  useEffect(() => {
    if (isPlaying && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            moveToNextPhase()
            return phaseDurations[getNextPhase()]
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentPhase, isCompleted])

  const getNextPhase = (): "inhale" | "hold" | "exhale" | "rest" => {
    switch (currentPhase) {
      case "inhale":
        return "hold"
      case "hold":
        return "exhale"
      case "exhale":
        return "rest"
      case "rest":
        return "inhale"
    }
  }

  const moveToNextPhase = () => {
    const nextPhase = getNextPhase()
    setCurrentPhase(nextPhase)

    if (nextPhase === "inhale") {
      const newCycleCount = cycleCount + 1
      setCycleCount(newCycleCount)

      if (newCycleCount >= totalCycles) {
        completeExercise()
      }
    }
  }

  const completeExercise = async () => {
    setIsPlaying(false)
    setIsCompleted(true)
    const finalScore = Math.round((cycleCount / totalCycles) * 100)
    setScore(finalScore)
  }

  const startExercise = () => {
    setIsPlaying(true)
    setIsCompleted(false)
    setCurrentPhase("inhale")
    setTimeRemaining(phaseDurations.inhale)
  }

  const pauseExercise = () => {
    setIsPlaying(false)
  }

  const resetExercise = () => {
    setIsPlaying(false)
    setIsCompleted(false)
    setCurrentPhase("inhale")
    setCycleCount(0)
    setTimeRemaining(phaseDurations.inhale)
    setScore(0)
  }

  const getCircleScale = () => {
    const progress = (phaseDurations[currentPhase] - timeRemaining) / phaseDurations[currentPhase]
    switch (currentPhase) {
      case "inhale":
        return 0.5 + progress * 0.5 // Scale from 0.5 to 1
      case "hold":
        return 1 // Stay at full size
      case "exhale":
        return 1 - progress * 0.5 // Scale from 1 to 0.5
      case "rest":
        return 0.5 // Stay at small size
    }
  }

  const getCircleColor = () => {
    switch (currentPhase) {
      case "inhale":
        return "bg-blue-500"
      case "hold":
        return "bg-purple-500"
      case "exhale":
        return "bg-green-500"
      case "rest":
        return "bg-gray-400"
    }
  }

  const progress = (cycleCount / totalCycles) * 100

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/games">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Games
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Exercise Area */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                      <Heart className="h-6 w-6 text-red-500" />
                      <span>Breathing Exercise</span>
                    </CardTitle>
                    <p className="text-muted-foreground">4-4-6-2 Breathing Pattern</p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-8">
                    {/* Breathing Circle */}
                    <div className="relative w-80 h-80 flex items-center justify-center">
                      <div
                        className={`w-64 h-64 rounded-full ${getCircleColor()} transition-all duration-1000 ease-in-out flex items-center justify-center`}
                        style={{
                          transform: `scale(${getCircleScale()})`,
                        }}
                      >
                        <div className="text-white text-center">
                          <div className="text-4xl font-bold">{timeRemaining}</div>
                          <div className="text-lg capitalize">{currentPhase}</div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold capitalize">{currentPhase}</h3>
                      <p className="text-muted-foreground">{phaseInstructions[currentPhase]}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                      {!isPlaying && !isCompleted && (
                        <Button
                          onClick={startExercise}
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start
                        </Button>
                      )}
                      {isPlaying && (
                        <Button onClick={pauseExercise} size="lg" variant="outline">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetExercise} size="lg" variant="outline">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Progress */}
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {cycleCount}/{totalCycles} cycles
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How it Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Inhale (4s)</div>
                          <div className="text-sm text-muted-foreground">Breathe in through nose</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Hold (4s)</div>
                          <div className="text-sm text-muted-foreground">Hold breath gently</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Exhale (6s)</div>
                          <div className="text-sm text-muted-foreground">Breathe out through mouth</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        <div>
                          <div className="font-medium">Rest (2s)</div>
                          <div className="text-sm text-muted-foreground">Prepare for next cycle</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Reduces anxiety and stress</li>
                      <li>• Improves focus and concentration</li>
                      <li>• Promotes relaxation</li>
                      <li>• Regulates heart rate</li>
                      <li>• Enhances emotional control</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Completion */}
                {isCompleted && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Exercise Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{score}%</div>
                        <div className="text-sm text-green-700">Completion Score</div>
                      </div>
                      <p className="text-sm text-green-700">
                        Great job! You've completed {cycleCount} breathing cycles. Regular practice will help build your
                        resilience and emotional regulation skills.
                      </p>
                      <div className="flex space-x-2">
                        <Button onClick={resetExercise} className="flex-1 bg-transparent" variant="outline">
                          Practice Again
                        </Button>
                        <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Link href="/games">Back to Games</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
