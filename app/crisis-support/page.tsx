"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MessageCircle, Globe, Clock, Heart, Shield, AlertTriangle, ExternalLink, MapPin } from "lucide-react"

interface CrisisResource {
  name: string
  phone: string
  text?: string
  website?: string
  description: string
  availability: string
  type: "hotline" | "text" | "chat" | "local"
  urgent?: boolean
}

export default function CrisisSupportPage() {
  const [selectedCountry, setSelectedCountry] = useState("US")

  const crisisResources: Record<string, CrisisResource[]> = {
    US: [
      {
        name: "988 Suicide & Crisis Lifeline",
        phone: "988",
        text: "Text 'HELLO' to 741741",
        website: "https://988lifeline.org",
        description: "Free and confidential emotional support for people in suicidal crisis or emotional distress",
        availability: "24/7",
        type: "hotline",
        urgent: true,
      },
      {
        name: "Crisis Text Line",
        phone: "",
        text: "Text 'HOME' to 741741",
        website: "https://crisistextline.org",
        description: "Free, 24/7 support for those in crisis via text message",
        availability: "24/7",
        type: "text",
        urgent: true,
      },
      {
        name: "SAMHSA National Helpline",
        phone: "1-800-662-4357",
        website: "https://samhsa.gov",
        description: "Treatment referral and information service for mental health and substance use disorders",
        availability: "24/7",
        type: "hotline",
      },
      {
        name: "National Alliance on Mental Illness",
        phone: "1-800-950-6264",
        text: "Text 'NAMI' to 741741",
        website: "https://nami.org",
        description: "Support, education and advocacy for individuals and families affected by mental illness",
        availability: "Mon-Fri 10am-10pm ET",
        type: "hotline",
      },
    ],
    UK: [
      {
        name: "Samaritans",
        phone: "116 123",
        website: "https://samaritans.org",
        description: "Free support for anyone in emotional distress, struggling to cope, or at risk of suicide",
        availability: "24/7",
        type: "hotline",
        urgent: true,
      },
      {
        name: "Mind Infoline",
        phone: "0300 123 3393",
        website: "https://mind.org.uk",
        description: "Information and support for mental health problems",
        availability: "Mon-Fri 9am-6pm",
        type: "hotline",
      },
    ],
    CA: [
      {
        name: "Talk Suicide Canada",
        phone: "1-833-456-4566",
        text: "Text 45645",
        website: "https://talksuicide.ca",
        description: "24/7 bilingual suicide prevention service",
        availability: "24/7",
        type: "hotline",
        urgent: true,
      },
      {
        name: "Kids Help Phone",
        phone: "1-800-668-6868",
        text: "Text 'CONNECT' to 686868",
        website: "https://kidshelpphone.ca",
        description: "Professional counselling and information for young people",
        availability: "24/7",
        type: "hotline",
      },
    ],
  }

  const copingStrategies = [
    {
      title: "Grounding Techniques",
      description:
        "Use the 5-4-3-2-1 technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Deep Breathing",
      description: "Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat until you feel calmer.",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "Reach Out",
      description:
        "Contact a trusted friend, family member, or mental health professional. You don't have to face this alone.",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      title: "Safe Environment",
      description: "Remove any means of self-harm from your immediate environment. Go to a public place if needed.",
      icon: <Shield className="h-5 w-5" />,
    },
  ]

  const warningSignsData = [
    "Talking about wanting to die or hurt oneself",
    "Looking for ways to kill oneself",
    "Talking about feeling hopeless or having no purpose",
    "Talking about feeling trapped or in unbearable pain",
    "Talking about being a burden to others",
    "Increasing use of alcohol or drugs",
    "Acting anxious, agitated, or reckless",
    "Sleeping too little or too much",
    "Withdrawing or feeling isolated",
    "Showing rage or talking about seeking revenge",
    "Displaying extreme mood swings",
  ]

  const countries = [
    { code: "US", name: "United States" },
    { code: "UK", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        <div className="container px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Emergency Alert */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-red-800">If you're in immediate danger</h2>
                    <p className="text-red-700">
                      If you or someone you know is in immediate danger, please call emergency services right away:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Call 911 (US)
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Call 999 (UK)
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Call 911 (CA)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Crisis Support</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                You are not alone. Help is available 24/7. Reach out to trained professionals who care and want to help.
              </p>
            </div>

            <Tabs defaultValue="resources" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resources">Crisis Resources</TabsTrigger>
                <TabsTrigger value="coping">Coping Strategies</TabsTrigger>
                <TabsTrigger value="warning-signs">Warning Signs</TabsTrigger>
                <TabsTrigger value="support">How to Help</TabsTrigger>
              </TabsList>

              <TabsContent value="resources" className="space-y-6">
                {/* Country Selector */}
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Select your location:</span>
                  <div className="flex space-x-2">
                    {countries.map((country) => (
                      <Button
                        key={country.code}
                        variant={selectedCountry === country.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCountry(country.code)}
                      >
                        {country.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Crisis Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {crisisResources[selectedCountry]?.map((resource, index) => (
                    <Card key={index} className={`${resource.urgent ? "border-red-200 bg-red-50" : ""}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className={`text-lg ${resource.urgent ? "text-red-800" : ""}`}>
                            {resource.name}
                          </CardTitle>
                          <div className="flex space-x-2">
                            {resource.urgent && <Badge className="bg-red-600 text-white">Urgent</Badge>}
                            <Badge variant="secondary">
                              {resource.type === "hotline" && <Phone className="h-3 w-3 mr-1" />}
                              {resource.type === "text" && <MessageCircle className="h-3 w-3 mr-1" />}
                              {resource.type === "chat" && <Globe className="h-3 w-3 mr-1" />}
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className={`text-sm ${resource.urgent ? "text-red-700" : "text-muted-foreground"}`}>
                          {resource.description}
                        </p>

                        <div className="space-y-2">
                          {resource.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              <a
                                href={`tel:${resource.phone}`}
                                className="font-mono text-lg font-semibold text-green-600 hover:underline"
                              >
                                {resource.phone}
                              </a>
                            </div>
                          )}

                          {resource.text && (
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600 font-medium">{resource.text}</span>
                            </div>
                          )}

                          {resource.website && (
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-purple-600" />
                              <a
                                href={resource.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-600 hover:underline flex items-center"
                              >
                                Visit Website
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{resource.availability}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="coping" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {copingStrategies.map((strategy, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          {strategy.icon}
                          <span>{strategy.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{strategy.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-800 mb-3">Remember:</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• Crisis feelings are temporary and will pass</li>
                      <li>• You have survived difficult times before</li>
                      <li>• Asking for help is a sign of strength, not weakness</li>
                      <li>• There are people who care about you and want to help</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="warning-signs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Warning Signs of Suicide</CardTitle>
                    <p className="text-muted-foreground">
                      If you or someone you know shows these signs, seek help immediately:
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {warningSignsData.map((sign, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{sign}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-yellow-800 mb-3">What to do if you notice these signs:</h3>
                    <ol className="space-y-2 text-yellow-700 list-decimal list-inside">
                      <li>Take it seriously - don't ignore the warning signs</li>
                      <li>Ask directly if they are thinking about suicide</li>
                      <li>Listen without judgment</li>
                      <li>Help them connect with professional help</li>
                      <li>Stay with them or ensure they're not alone</li>
                      <li>Remove any means of self-harm if possible</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Help Someone in Crisis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium">Listen actively</h4>
                            <p className="text-sm text-muted-foreground">
                              Give them your full attention without trying to fix everything
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium">Ask directly</h4>
                            <p className="text-sm text-muted-foreground">
                              "Are you thinking about suicide?" It's okay to ask
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium">Don't leave them alone</h4>
                            <p className="text-sm text-muted-foreground">
                              Stay with them or ensure someone trustworthy is present
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            4
                          </div>
                          <div>
                            <h4 className="font-medium">Get professional help</h4>
                            <p className="text-sm text-muted-foreground">
                              Help them contact a crisis hotline or mental health professional
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>What NOT to Say</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">"Just think positive" or "Things could be worse"</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">"You have so much to live for"</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">"Suicide is selfish" or "You're being dramatic"</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">"I know exactly how you feel"</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700 font-medium">Instead, try:</p>
                        <p className="text-sm text-green-700">
                          "I'm here for you" • "You matter to me" • "Let's get through this together"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
