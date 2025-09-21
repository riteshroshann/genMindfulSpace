import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, BookOpen, TrendingUp, Brain, Palette, Users, Heart, Phone } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        {/* Improved dashboard container alignment */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            {/* Better welcome section alignment */}
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-3xl font-bold text-balance">Welcome to Your Wellness Dashboard</h1>
              <p className="text-muted-foreground text-pretty">
                How are you feeling today? Choose a tool to support your wellness.
              </p>
            </div>

            {/* Quick Actions Grid */}
            {/* Improved grid spacing and alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">AI Chat</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Talk to your empathetic AI companion for support and guidance.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Link href="/ai-chat">Start Chatting</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Journal</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Reflect on your thoughts and track your personal growth.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Link href="/journal">Write Entry</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Mood Tracker</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">Log your mood and see patterns over time.</p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  >
                    <Link href="/mood-tracker">Track Mood</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Games</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Play resilience-building games to strengthen coping skills.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Link href="/games">Play Games</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Art Therapy</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Express yourself through creative art activities.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <Link href="/art-therapy">Create Art</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Community</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with others on similar wellness journeys.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    <Link href="/community">Join Community</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Connections</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with trusted friends and family for support.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                  >
                    <Link href="/connections">Manage Connections</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-red-200">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Crisis Support</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Immediate access to mental health hotlines and resources.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    <Link href="/crisis-support">Get Help Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
