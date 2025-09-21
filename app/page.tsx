import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Heart, Shield, Clock, Users, Brain, Palette, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Navigation />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
                Your{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Safe Space
                </span>
                <br />
                for Mental Wellness
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
                MindfulSpace is your confidential, empathetic companion designed specifically for mental health support.
                Experience stigma-free support with interactive tools and personalized guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a href="#features">Explore Features</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                <a href="#testimonials">Read Stories</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">100% Confidential</h3>
                  <p className="text-muted-foreground text-pretty">
                    Your conversations are private and secure, with military-grade encryption.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Stigma-Free</h3>
                  <p className="text-muted-foreground text-pretty">
                    No judgment, just understanding and empathetic support.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">24/7 Available</h3>
                  <p className="text-muted-foreground text-pretty">
                    Access support whenever you need it, day or night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-7xl space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl text-balance">Comprehensive Mental Health Tools</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
                Everything you need to support your mental wellness journey in one secure platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Chat Support</h3>
                    <p className="text-sm text-muted-foreground">
                      24/7 empathetic AI companion for emotional support and guidance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Anonymous Journal</h3>
                    <p className="text-sm text-muted-foreground">
                      Private space for reflection and personal growth tracking.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Mood Tracker</h3>
                    <p className="text-sm text-muted-foreground">
                      Track emotional patterns and celebrate progress over time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Resilience Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive mini-games to build emotional strength and coping skills.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Art & Music Therapy</h3>
                    <p className="text-sm text-muted-foreground">
                      Creative expression tools for emotional processing and healing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Safe Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Anonymous peer support and encouragement from others on similar journeys.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Family Connections</h3>
                    <p className="text-sm text-muted-foreground">
                      Safely connect with trusted friends and family for additional support.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Crisis Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct access to mental health hotlines and emergency resources.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold sm:text-4xl text-balance">Real voices.</h2>
                <p className="text-lg text-muted-foreground">Anonymous stories from our community</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Sam, 17</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      "MindfulSpace feels like a friend I can actually trust. I don't feel judged, and I can really be
                      honest about what I'm going through."
                    </p>
                    <div className="text-xs text-muted-foreground">High School</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Alex, 19</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      "The art therapy feature really helped me express feelings I couldn't put into words. It's like
                      therapy, but more fun and way less scary."
                    </p>
                    <div className="text-xs text-muted-foreground">University Student</div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Morgan, 16</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      "I love seeing my progress. The mood tracking helped me realize I was actually getting better,
                      even when it didn't feel like it."
                    </p>
                    <div className="text-xs text-muted-foreground">High School</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl text-balance">Ready to start your wellness journey?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
                Join thousands of others who have found support, growth, and healing in our safe space.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a href="#features">Learn More</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                <a href="/privacy">Privacy & Security</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                    <Heart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    MindfulSpace
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your safe space for mental wellness and personal growth.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Features</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link href="/ai-chat" className="block hover:text-primary">
                    AI Chat
                  </Link>
                  <Link href="/journal" className="block hover:text-primary">
                    Journal
                  </Link>
                  <Link href="/mood-tracker" className="block hover:text-primary">
                    Mood Tracker
                  </Link>
                  <Link href="/games" className="block hover:text-primary">
                    Games
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Support</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link href="/help" className="block hover:text-primary">
                    Help Center
                  </Link>
                  <Link href="/crisis" className="block hover:text-primary">
                    Crisis Resources
                  </Link>
                  <Link href="/contact" className="block hover:text-primary">
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Legal</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link href="/privacy" className="block hover:text-primary">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block hover:text-primary">
                    Terms of Service
                  </Link>
                  <Link href="/security" className="block hover:text-primary">
                    Security
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>&copy; 2024 MindfulSpace. Built with care for mental wellness.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
