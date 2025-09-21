"use client"

import { useState } from "react"
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
import { Users, Plus, Heart, MessageCircle, Shield, Flag } from "lucide-react"

interface CommunityPost {
  id: string
  title: string
  content: string
  category: string
  anonymous_name: string
  created_at: string
  likes_count: number
  comments_count: number
  user_has_liked: boolean
}

interface Comment {
  id: string
  content: string
  anonymous_name: string
  created_at: string
  likes_count: number
  user_has_liked: boolean
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      title: "Finding hope in small moments",
      content:
        "Today I realized that healing isn't always about big breakthroughs. Sometimes it's about noticing the way sunlight filters through my window, or how my morning coffee tastes a little better when I'm mindful. These small moments are adding up to something bigger.",
      category: "general",
      anonymous_name: "HopefulSoul42",
      created_at: new Date().toISOString(),
      likes_count: 12,
      comments_count: 5,
      user_has_liked: false,
    },
    {
      id: "2",
      title: "Anxiety wins and losses",
      content:
        "Had a panic attack yesterday but managed to use the breathing techniques I learned here. It didn't stop it completely, but I felt more in control. Small victories count too, right?",
      category: "anxiety",
      anonymous_name: "BraveWarrior88",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      likes_count: 18,
      comments_count: 8,
      user_has_liked: true,
    },
  ])
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isNewPostOpen, setIsNewPostOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // Form state
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postCategory, setPostCategory] = useState("general")
  const [newComment, setNewComment] = useState("")

  const categories = [
    { value: "general", label: "General Support", color: "bg-blue-500" },
    { value: "anxiety", label: "Anxiety", color: "bg-purple-500" },
    { value: "depression", label: "Depression", color: "bg-green-500" },
    { value: "stress", label: "Stress Management", color: "bg-orange-500" },
    { value: "relationships", label: "Relationships", color: "bg-pink-500" },
    { value: "self-care", label: "Self-Care", color: "bg-teal-500" },
    { value: "recovery", label: "Recovery", color: "bg-indigo-500" },
    { value: "celebration", label: "Celebrations", color: "bg-yellow-500" },
  ]

  const generateAnonymousName = () => {
    const adjectives = ["Kind", "Brave", "Gentle", "Strong", "Wise", "Caring", "Hopeful", "Peaceful"]
    const nouns = ["Soul", "Heart", "Spirit", "Friend", "Warrior", "Helper", "Listener", "Supporter"]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adjective}${noun}${Math.floor(Math.random() * 100)}`
  }

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postContent.trim()) return

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      title: postTitle.trim(),
      content: postContent.trim(),
      category: postCategory,
      anonymous_name: generateAnonymousName(),
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      user_has_liked: false,
    }

    setPosts([newPost, ...posts])
    setIsNewPostOpen(false)
    resetPostForm()
  }

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes_count: post.user_has_liked ? post.likes_count - 1 : post.likes_count + 1,
              user_has_liked: !post.user_has_liked,
            }
          : post,
      ),
    )
  }

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      anonymous_name: generateAnonymousName(),
      created_at: new Date().toISOString(),
      likes_count: 0,
      user_has_liked: false,
    }

    setComments([...comments, comment])
    setNewComment("")
    // Update post comment count
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, comments_count: post.comments_count + 1 } : post)),
    )
  }

  const loadComments = (postId: string) => {
    // Mock comments for the selected post
    const mockComments: Comment[] = [
      {
        id: "1",
        content: "Thank you for sharing this. Your courage inspires me to keep going too.",
        anonymous_name: "KindListener23",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        likes_count: 3,
        user_has_liked: false,
      },
      {
        id: "2",
        content: "Small victories absolutely count! Every step forward matters, no matter how small.",
        anonymous_name: "WiseSupporter67",
        created_at: new Date(Date.now() - 7200000).toISOString(),
        likes_count: 5,
        user_has_liked: true,
      },
    ]
    setComments(mockComments)
  }

  const resetPostForm = () => {
    setPostTitle("")
    setPostContent("")
    setPostCategory("general")
  }

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.value === category) || categories[0]
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
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Community</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Connect with others on similar wellness journeys. Share experiences, offer support, and find
                encouragement in our safe, anonymous community.
              </p>
            </div>

            {/* Community Guidelines */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-800">Community Guidelines</h3>
                    <p className="text-sm text-blue-700">
                      This is a safe space for support and encouragement. Please be kind, respectful, and supportive.
                      All interactions are anonymous to protect privacy. Report any inappropriate content using the flag
                      button.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Community Posts</TabsTrigger>
                <TabsTrigger value="groups">Support Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                {/* Create Post */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Posts</h2>
                  <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="h-4 w-4 mr-2" />
                        Share Your Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Share with the Community</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="post-title">Title</Label>
                          <Input
                            id="post-title"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="What would you like to share?"
                          />
                        </div>
                        <div>
                          <Label htmlFor="post-category">Category</Label>
                          <select
                            id="post-category"
                            value={postCategory}
                            onChange={(e) => setPostCategory(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="post-content">Your message</Label>
                          <Textarea
                            id="post-content"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Share your experience, ask for support, or offer encouragement..."
                            className="min-h-[150px]"
                          />
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <Shield className="h-4 w-4 inline mr-1" />
                            Your post will be shared anonymously. A random supportive name will be assigned to protect
                            your privacy.
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreatePost}
                            disabled={!postTitle.trim() || !postContent.trim()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Share Anonymously
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                        <p className="text-muted-foreground mb-4">Be the first to share and start the conversation!</p>
                        <Button onClick={() => setIsNewPostOpen(true)}>Share Your Story</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.map((post) => {
                      const categoryInfo = getCategoryInfo(post.category)
                      return (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={`${categoryInfo.color} text-white`}>{categoryInfo.label}</Badge>
                                    <span className="text-sm text-muted-foreground">{getTimeAgo(post.created_at)}</span>
                                  </div>
                                  <h3 className="text-lg font-semibold">{post.title}</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                  <Flag className="h-4 w-4" />
                                </Button>
                              </div>

                              <p className="text-sm leading-relaxed">{post.content}</p>

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                      {post.anonymous_name.slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{post.anonymous_name}</span>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLikePost(post.id)}
                                    className={post.user_has_liked ? "text-red-500" : "text-muted-foreground"}
                                  >
                                    <Heart className={`h-4 w-4 mr-1 ${post.user_has_liked ? "fill-current" : ""}`} />
                                    {post.likes_count}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedPost(post)
                                      loadComments(post.id)
                                    }}
                                    className="text-muted-foreground"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {post.comments_count}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Anxiety Support Circle",
                      description: "A safe space to share experiences and coping strategies for anxiety",
                      member_count: 127,
                      category: "anxiety",
                    },
                    {
                      name: "Daily Gratitude Group",
                      description: "Share daily gratitudes and build positive thinking habits together",
                      member_count: 89,
                      category: "self-care",
                    },
                    {
                      name: "Mindfulness Practitioners",
                      description: "Discuss mindfulness techniques and meditation experiences",
                      member_count: 156,
                      category: "general",
                    },
                    {
                      name: "Recovery Warriors",
                      description: "Support for those on their recovery journey from various challenges",
                      member_count: 73,
                      category: "recovery",
                    },
                    {
                      name: "Student Mental Health",
                      description: "Peer support specifically for students dealing with academic stress",
                      member_count: 94,
                      category: "stress",
                    },
                    {
                      name: "Creative Expression",
                      description: "Share art, writing, and creative works as forms of healing",
                      member_count: 112,
                      category: "self-care",
                    },
                  ].map((group, index) => {
                    const categoryInfo = getCategoryInfo(group.category)
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`w-3 h-3 ${categoryInfo.color} rounded-full mt-1`}></div>
                            <Badge variant="secondary">{group.member_count} members</Badge>
                          </div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            Join Group
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            {/* Post Detail Modal */}
            {selectedPost && (
              <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedPost.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {selectedPost.anonymous_name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedPost.anonymous_name}</div>
                        <div className="text-sm text-muted-foreground">{getTimeAgo(selectedPost.created_at)}</div>
                      </div>
                    </div>

                    <p className="leading-relaxed">{selectedPost.content}</p>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-4">Comments ({comments.length})</h4>
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-secondary">
                                {comment.anonymous_name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{comment.anonymous_name}</span>
                                <span className="text-xs text-muted-foreground">{getTimeAgo(comment.created_at)}</span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your support or encouragement..."
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleAddComment(selectedPost.id)}
                            disabled={!newComment.trim()}
                            size="sm"
                          >
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
