import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Book, Heart, Users, Palette, Phone } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Get 24/7 emotional support from our AI companion",
      link: "/ai-chat",
    },
    {
      icon: Book,
      title: "Digital Journal",
      description: "Track your thoughts and feelings privately",
      link: "/journal",
    },
    {
      icon: Heart,
      title: "Mood Tracker",
      description: "Monitor your emotional patterns over time",
      link: "/mood-tracker",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with others on similar journeys",
      link: "/community",
    },
    {
      icon: Palette,
      title: "Art Therapy",
      description: "Express yourself through creative activities",
      link: "/art-therapy",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about using MindfulSpace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={feature.link}>Try Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the AI chat support work?</AccordionTrigger>
                  <AccordionContent>
                    Our AI companion uses advanced language models to provide empathetic, supportive responses. It's
                    trained specifically for mental health support and available 24/7. However, it's not a replacement
                    for professional therapy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is my data private and secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we take privacy seriously. Your journal entries and personal data are encrypted and stored
                    securely. We never share your personal information with third parties.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I use this app alongside therapy?</AccordionTrigger>
                  <AccordionContent>
                    MindfulSpace is designed to complement professional mental health care, not replace it. Many users
                    find it helpful for daily support between therapy sessions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What if I'm having a mental health crisis?</AccordionTrigger>
                  <AccordionContent>
                    If you're experiencing a mental health emergency, please contact emergency services or visit our
                    Crisis Support page for immediate resources and hotlines.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>Can't find what you're looking for? We're here to help.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/crisis-support">
                  <Phone className="w-4 h-4 mr-2" />
                  Crisis Resources
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
