'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Calendar, MapPin, Star, Settings, Share2, Heart, MessageCircle, Bookmark, MoreHorizontal, ImageIcon, Video, Type, Send, Smile, Camera, UserPlus, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import MainLayout from '@/components/main-layout'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: number
  author: {
    name: string
    avatar: string
    role: string
  }
  content: string
  type: 'text' | 'image' | 'video'
  media?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
}

interface Community {
  id: number
  name: string
  description: string
  image: string
  memberCount: number
  postCount: number
  category: string
  isJoined: boolean
  isVerified: boolean
  location: string
  createdAt: string
  isFollowing: boolean
  isNotificationEnabled: boolean
}

export default function CommunityDetailPage() {
  const params = useParams()
  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCommunity()
    fetchPosts()
  }, [params.id])

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/community/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setCommunity({
          ...data,
          isJoined: false, // In a real app, check if user is joined
          isFollowing: false, // In a real app, check if user is following
          isNotificationEnabled: false, // In a real app, check notification status
        })
      } else {
        setError(data.error || 'Failed to fetch community')
      }
    } catch (err) {
      setError('Failed to fetch community')
      console.error('Error fetching community:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/community/${params.id}/posts`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts.map((post: any) => ({
          ...post,
          isLiked: false, // In a real app, check if user liked
          isBookmarked: false, // In a real app, check if user bookmarked
        })))
      } else {
        setError(data.error || 'Failed to fetch posts')
      }
    } catch (err) {
      setError('Failed to fetch posts')
      console.error('Error fetching posts:', err)
    }
  }

  const handleJoinCommunity = () => {
    if (!community) return
    
    setCommunity(prev => ({
      ...prev!,
      isJoined: !prev!.isJoined,
      memberCount: prev!.isJoined ? prev!.memberCount - 1 : prev!.memberCount + 1
    }))
    toast({
      title: community.isJoined ? "Left Community" : "Joined Community",
      description: community.isJoined ? "You have left the community" : "Welcome to the community!",
    })
  }

  const handleFollowCommunity = () => {
    if (!community) return
    
    setCommunity(prev => ({ ...prev!, isFollowing: !prev!.isFollowing }))
    toast({
      title: community.isFollowing ? "Unfollowed" : "Following",
      description: community.isFollowing ? "You will no longer receive updates" : "You will receive updates from this community",
    })
  }

  const handleToggleNotifications = () => {
    if (!community) return
    
    setCommunity(prev => ({ ...prev!, isNotificationEnabled: !prev!.isNotificationEnabled }))
    toast({
      title: community.isNotificationEnabled ? "Notifications Disabled" : "Notifications Enabled",
      description: community.isNotificationEnabled ? "You won't receive notifications" : "You'll receive notifications for new posts",
    })
  }

  const handleLikePost = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleBookmarkPost = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
    toast({
      title: "Post Bookmarked",
      description: "Post saved to your bookmarks",
    })
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !community) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/community/${community.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPost,
          type: postType.toUpperCase(),
          userId: 'current-user-id', // In a real app, get from session
        }),
      })

      if (response.ok) {
        const post: Post = {
          id: Date.now(),
          author: {
            name: 'You',
            avatar: '/diverse-user-avatars.png',
            role: 'Community Member'
          },
          content: newPost,
          type: postType,
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          isLiked: false,
          isBookmarked: false
        }
        
        setPosts(prev => [post, ...prev])
        setNewPost('')
        toast({
          title: "Post Created",
          description: "Your post has been shared with the community",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to create post. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
          />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!community) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Not Found</h2>
            <p className="text-gray-600 mb-6">The community you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/community">Back to Communities</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="icon" asChild>
              <Link href="/community">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Community Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl overflow-hidden">
              <div className="relative h-64 md:h-80">
                <Image
                  src={community.image || "/placeholder.svg"}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div className="text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold">{community.name}</h1>
                        {community.isVerified && (
                          <Badge className="bg-blue-500 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg opacity-90 mb-4 max-w-2xl">{community.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {community.memberCount.toLocaleString()} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {community.postCount.toLocaleString()} posts
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {community.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleJoinCommunity}
                    className={`${
                      community.isJoined 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {community.isJoined ? 'Joined' : 'Join Community'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleFollowCommunity}
                    className={community.isFollowing ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {community.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleToggleNotifications}
                    className={community.isNotificationEnabled ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                  >
                    {community.isNotificationEnabled ? (
                      <Bell className="mr-2 h-4 w-4" />
                    ) : (
                      <BellOff className="mr-2 h-4 w-4" />
                    )}
                    Notifications
                  </Button>
                  
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Community Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Report Community
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post */}
              {community.isJoined && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src="/diverse-user-avatars.png" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          <Textarea
                            placeholder="Share your farming knowledge, ask questions, or start a discussion..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            rows={3}
                            className="border-0 bg-gray-50 focus:bg-white transition-colors"
                          />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant={postType === 'text' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPostType('text')}
                              >
                                <Type className="h-4 w-4 mr-1" />
                                Text
                              </Button>
                              <Button
                                variant={postType === 'image' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPostType('image')}
                              >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                Image
                              </Button>
                              <Button
                                variant={postType === 'video' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPostType('video')}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Video
                              </Button>
                            </div>
                            
                            <Button
                              onClick={handleCreatePost}
                              disabled={!newPost.trim() || isLoading}
                              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                            >
                              {isLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Posts */}
              <div className="space-y-6">
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      whileHover={{ y: -2 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{post.author.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>{post.author.role}</span>
                                  <span>•</span>
                                  <span>{post.timestamp}</span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Share Post</DropdownMenuItem>
                                <DropdownMenuItem>Report Post</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-700 mb-4">{post.content}</p>
                            {post.media && (
                              <div className="rounded-lg overflow-hidden">
                                {post.type === 'image' && (
                                  <Image
                                    src={post.media || "/placeholder.svg"}
                                    alt="Post image"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                  />
                                )}
                                {post.type === 'video' && (
                                  <div className="bg-gray-100 aspect-video flex items-center justify-center">
                                    <Video className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleLikePost(post.id)}
                                className={`flex items-center gap-2 transition-colors ${
                                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                }`}
                              >
                                <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                              </motion.button>
                              
                              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                                <MessageCircle className="h-5 w-5" />
                                <span>{post.comments}</span>
                              </button>
                              
                              <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                                <Share2 className="h-5 w-5" />
                                Share
                              </button>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleBookmarkPost(post.id)}
                              className={`transition-colors ${
                                post.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                              }`}
                            >
                              <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                            </motion.button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                  <CardHeader>
                    <h3 className="font-semibold">Community Stats</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold">{community.memberCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-semibold">{community.postCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <Badge variant="secondary">{community.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-semibold">{new Date(community.createdAt).getFullYear()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Related Communities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
                  <CardHeader>
                    <h3 className="font-semibold">Related Communities</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'Rice Cultivation Masters', members: '8.9K' },
                      { name: 'Vegetable Garden Community', members: '15.6K' },
                      { name: 'Smart Farming Tech', members: '6.7K' }
                    ].map((relatedCommunity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-medium text-sm">{relatedCommunity.name}</h4>
                          <p className="text-xs text-gray-500">{relatedCommunity.members} members</p>
                        </div>
                        <Button size="sm" variant="outline">Join</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
