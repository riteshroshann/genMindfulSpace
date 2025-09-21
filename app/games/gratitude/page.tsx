"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Star, ArrowLeft, Check, Sparkles } from "lucide-react"
import Link from "next/link"

interface GratitudePrompt {
  id: number
  text: string
  category: string
}

export default function GratitudeGamePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [currentResponse, setCurrentResponse] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  const prompts: GratitudePrompt[] = [
    { id: 1, text: "What is something small that made you smile today?", category: "Daily Joy" },
    { id: 2, text: "Name a person who has positively impacted your life recently.", category: "Relationships" },
    { id: 3, text: "What is a skill or ability you have that you're grateful for?", category: "Personal Strengths" },
    { id: 4, text: "Describe a place that brings you peace or happiness.", category: "Environment" },
    {
      id: 5,
      text: "What is something you often take for granted but are thankful for?",
      category: "Everyday Blessings",
    },
  ]

  const handleNext = () => {
    if (currentResponse.trim()) {
      const newResponses = [...responses, currentResponse.trim()]
      setResponses(newResponses)
      setCurrentResponse("")

      if (currentStep < prompts.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        completeExercise(newResponses)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCurrentResponse(responses[currentStep - 1] || "")
      setResponses(responses.slice(0, currentStep))
    }
  }

  const completeExercise = async (finalResponses: string[]) => {
    setIsCompleted(true)
    const completionScore = Math.round((finalResponses.length / prompts.length) * 100)
    setScore(completionScore)
  }

  const resetExercise = () => {
    setCurrentStep(0)
    setResponses([])
    setCurrentResponse("")
    setIsCompleted(false)
    setScore(0)
  }

  const progress = ((currentStep + 1) / prompts.length) * 100

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

            {!isCompleted ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Exercise Area */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <span>Gratitude Challenge</span>
                      </CardTitle>
                      <p className="text-muted-foreground">Reflect on the positive aspects of your life</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {currentStep + 1}/{prompts.length}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      {/* Current Prompt */}
                      <div className="space-y-4">
                        <div className="text-center space-y-2">
                          <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {prompts[currentStep].category}
                          </div>
                          <h3 className="text-xl font-semibold">{prompts[currentStep].text}</h3>
                        </div>

                        <Textarea
                          value={currentResponse}
                          onChange={(e) => setCurrentResponse(e.target.value)}
                          placeholder="Take your time to reflect and write your thoughts..."
                          className="min-h-[150px] text-base"
                        />

                        <div className="text-sm text-muted-foreground">
                          Tip: Be specific and think about why this makes you grateful. The more detail, the more
                          meaningful the reflection.
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <Button
                          onClick={handlePrevious}
                          variant="outline"
                          disabled={currentStep === 0}
                          className="w-24 bg-transparent"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={!currentResponse.trim()}
                          className="w-24 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {currentStep === prompts.length - 1 ? "Finish" : "Next"}
                        </Button>
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
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        This exercise helps you focus on positive aspects of your life through guided reflection.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                          <span>Read each prompt carefully</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                          <span>Take time to reflect deeply</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                          <span>Write honest, specific responses</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></div>
                          <span>Focus on the feeling of gratitude</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Benefits */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Improves overall mood and happiness</li>
                        <li>• Reduces stress and anxiety</li>
                        <li>• Enhances life satisfaction</li>
                        <li>• Builds resilience to challenges</li>
                        <li>• Strengthens relationships</li>
                        <li>• Promotes better sleep</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Completed Responses */}
                  {responses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Your Reflections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {responses.map((response, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <div className="font-medium text-green-700">{prompts[index].category}</div>
                                <div className="text-muted-foreground line-clamp-2">{response}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              /* Completion Screen */
              <div className="max-w-2xl mx-auto">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-yellow-800">Gratitude Challenge Complete!</CardTitle>
                    <p className="text-yellow-700">
                      You've successfully reflected on {responses.length} aspects of gratitude
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600">{score}%</div>
                      <div className="text-sm text-yellow-700">Completion Score</div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-yellow-800">Your Gratitude Reflections:</h3>
                      <div className="space-y-3">
                        {responses.map((response, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-yellow-200">
                            <div className="font-medium text-yellow-800 text-sm mb-1">{prompts[index].category}</div>
                            <div className="text-sm text-gray-700">{response}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Remember:</h4>
                      <p className="text-sm text-yellow-700">
                        Gratitude is a practice. Try to carry these positive feelings with you throughout your day.
                        Consider revisiting these reflections when you need a mood boost.
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={resetExercise} className="flex-1 bg-transparent" variant="outline">
                        Practice Again
                      </Button>
                      <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/games">Back to Games</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
