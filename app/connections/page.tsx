"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, MessageCircle, Phone, Mail, Users, Shield, UserPlus, Settings } from "lucide-react"

interface TrustedContact {
  id: string
  name: string
  relationship: string
  phone?: string
  email?: string
  notes?: string
  is_emergency_contact: boolean
  created_at: string
}

interface SupportMessage {
  id: string
  contact_id: string
  message: string
  sent_at: string
  contact_name: string
}

export default function ConnectionsPage() {
  const [contacts, setContacts] = useState<TrustedContact[]>([])
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("contacts")

  // Form state
  const [contactName, setContactName] = useState("")
  const [contactRelationship, setContactRelationship] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactNotes, setContactNotes] = useState("")
  const [isEmergencyContact, setIsEmergencyContact] = useState(false)

  const relationships = [
    "Family Member",
    "Friend",
    "Partner",
    "Therapist",
    "Counselor",
    "Doctor",
    "Mentor",
    "Colleague",
    "Support Group Member",
    "Other",
  ]

  useEffect(() => {
    loadMockConnections()
  }, [])

  const loadMockConnections = () => {
    const mockContacts = [
      {
        id: "contact-1",
        name: "Sarah Johnson",
        relationship: "Best Friend",
        phone: "+1 (555) 123-4567",
        email: "sarah@example.com",
        notes: "Always available for late night talks. Knows my triggers well.",
        is_emergency_contact: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "contact-2",
        name: "Dr. Emily Chen",
        relationship: "Therapist",
        phone: "+1 (555) 987-6543",
        email: "dr.chen@therapy.com",
        notes: "Weekly sessions on Thursdays. Specializes in anxiety and depression.",
        is_emergency_contact: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "contact-3",
        name: "Mom",
        relationship: "Family Member",
        phone: "+1 (555) 456-7890",
        email: "mom@family.com",
        notes: "Very supportive but sometimes worries too much. Call during daytime.",
        is_emergency_contact: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    const mockMessages = [
      {
        id: "msg-1",
        contact_id: "contact-1",
        message: "Hey, just checking in! How are you feeling today?",
        sent_at: new Date(Date.now() - 3600000).toISOString(),
        contact_name: "Sarah Johnson",
      },
    ]

    setContacts(mockContacts)
    setMessages(mockMessages)
  }

  const handleAddContact = () => {
    if (!contactName.trim() || !contactRelationship) return

    const newContact: TrustedContact = {
      id: `contact-${Date.now()}`,
      name: contactName.trim(),
      relationship: contactRelationship,
      phone: contactPhone.trim() || undefined,
      email: contactEmail.trim() || undefined,
      notes: contactNotes.trim() || undefined,
      is_emergency_contact: isEmergencyContact,
      created_at: new Date().toISOString(),
    }

    setContacts([newContact, ...contacts])
    setIsAddContactOpen(false)
    resetContactForm()
  }

  const resetContactForm = () => {
    setContactName("")
    setContactRelationship("")
    setContactPhone("")
    setContactEmail("")
    setContactNotes("")
    setIsEmergencyContact(false)
  }

  const sendQuickMessage = (contactId: string, message: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      contact_id: contactId,
      message,
      sent_at: new Date().toISOString(),
      contact_name: contact.name,
    }

    setMessages([newMessage, ...messages])
  }

  const quickMessages = [
    "I'm having a tough day and could use some support",
    "Feeling anxious right now, would love to talk",
    "Just wanted to reach out and connect",
    "Having some difficult thoughts, can we chat?",
    "Could use a friend right now",
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Trusted Connections</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Build and maintain your support network. Connect with trusted friends, family, and professionals who
                care about your wellbeing.
              </p>
            </div>

            {/* Support Network Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-800">Your Support Network</h3>
                    <p className="text-sm text-blue-700">
                      Having trusted people to reach out to is crucial for mental wellness. Add contacts you feel
                      comfortable talking to during difficult times.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts">My Contacts</TabsTrigger>
                <TabsTrigger value="quick-connect">Quick Connect</TabsTrigger>
                <TabsTrigger value="messages">Recent Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Trusted Contacts</h2>
                  <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Trusted Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="contact-name">Name *</Label>
                            <Input
                              id="contact-name"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Enter their name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-relationship">Relationship *</Label>
                            <select
                              id="contact-relationship"
                              value={contactRelationship}
                              onChange={(e) => setContactRelationship(e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="">Select relationship</option>
                              {relationships.map((rel) => (
                                <option key={rel} value={rel}>
                                  {rel}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="contact-phone">Phone Number</Label>
                            <Input
                              id="contact-phone"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-email">Email</Label>
                            <Input
                              id="contact-email"
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="email@example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="contact-notes">Notes</Label>
                          <Textarea
                            id="contact-notes"
                            value={contactNotes}
                            onChange={(e) => setContactNotes(e.target.value)}
                            placeholder="Any important notes about this contact (availability, preferences, etc.)"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="emergency-contact"
                            checked={isEmergencyContact}
                            onChange={(e) => setIsEmergencyContact(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="emergency-contact" className="text-sm">
                            Mark as emergency contact
                          </Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddContact} disabled={!contactName.trim() || !contactRelationship}>
                            Add Contact
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                            </div>
                          </div>
                          {contact.is_emergency_contact && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">Emergency</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {contact.notes && <p className="text-sm text-muted-foreground">{contact.notes}</p>}

                        <div className="space-y-2">
                          {contact.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              <a href={`tel:${contact.phone}`} className="text-sm text-green-600 hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                                {contact.email}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {contacts.length === 0 && (
                    <div className="col-span-full">
                      <Card>
                        <CardContent className="text-center py-12">
                          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Start building your support network by adding trusted friends, family, or professionals.
                          </p>
                          <Button onClick={() => setIsAddContactOpen(true)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Your First Contact
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="quick-connect" className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-semibold">Quick Connect</h2>
                  <p className="text-muted-foreground">
                    Need support right now? Send a quick message to your trusted contacts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {contacts
                        .filter((c) => c.is_emergency_contact)
                        .map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {contact.phone && (
                                <Button size="sm" variant="outline">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      {contacts.filter((c) => c.is_emergency_contact).length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No emergency contacts set. Add contacts and mark them as emergency contacts.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {quickMessages.map((message, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start h-auto p-3 bg-transparent"
                          onClick={() => {
                            console.log("Send message:", message)
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{message}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <h2 className="text-xl font-semibold">Recent Messages</h2>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{getInitials(message.contact_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{message.contact_name}</span>
                              <span className="text-sm text-muted-foreground">{getTimeAgo(message.sent_at)}</span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {messages.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                        <p className="text-muted-foreground">
                          Your message history with trusted contacts will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
