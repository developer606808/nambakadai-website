'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, TrendingUp, Calendar, MapPin, Star, ArrowRight, Sprout, Tractor, Leaf, Sun, Home, User, MessageCircle, Bell, Settings, Heart, Share2, MessageSquare, ThumbsUp, MoreHorizontal, ImageIcon, Video, Type, Bookmark, X, Camera, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
<<<<<<< Updated upstream
import MainLayout from '@/components/main-layout'
=======
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { MainLayout } from '@/components/main-layout'
import { useSession } from 'next-auth/react'
>>>>>>> Stashed changes

interface Community {
  id: number
  uuid: string
  name: string
  description: string
  image: string
  banner?: string
  memberCount: number
  postCount: number
  category: string
  isJoined: boolean
  isVerified: boolean
  location: string
  createdAt: string
  trending: boolean
}

interface Post {
  id: number
  publicKey?: string
  content: string
  type: 'text' | 'image' | 'video'
  media?: string
  author: {
    name: string
    avatar: string
    role: string
  }
  community: {
    name: string
    uuid: string
  }
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
}

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  stats?: {
    communities: number
    posts: number
    likes: number
  }
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [communities, setCommunities] = useState<Community[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([])
  const [suggestedCommunities, setSuggestedCommunities] = useState<Community[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCreatedCommunity, setHasCreatedCommunity] = useState(false)
  const [userCommunity, setUserCommunity] = useState<any>(null)
  const [newPost, setNewPost] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({})
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({})
  const [postComments, setPostComments] = useState<{[key: number]: any[]}>({})
  const [loadingComments, setLoadingComments] = useState<{[key: number]: boolean}>({})
  const [submittingComment, setSubmittingComment] = useState<{[key: number]: boolean}>({})
  const [showFindCommunities, setShowFindCommunities] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Community[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Create currentUser from session
  const currentUser = session?.user ? {
    id: parseInt(session.user.id),
    name: session.user.name || 'User',
    email: session.user.email || '',
    avatar: session.user.image || '/diverse-user-avatars.png',
    role: (session.user as any).role || 'BUYER'
  } : null

  useEffect(() => {
    fetchCommunities()
    fetchUserCommunityStatus()
    fetchPosts()
  }, [])

  // Re-fetch posts when userCommunity changes
  useEffect(() => {
    if (userCommunity) {
      fetchPosts()
    }
  }, [userCommunity])

  const fetchCommunities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/community/search?q=${searchTerm}&category=${selectedCategory === 'All' ? '' : selectedCategory}`)
      const data = await response.json()

      if (response.ok) {
        setCommunities(data.communities.map((community: any) => ({
          ...community,
          isJoined: false, // In a real app, check if user is joined
          trending: false, // In a real app, determine based on activity
        })))
      } else {
        setError(data.error || 'Failed to fetch communities')
      }
    } catch (err) {
      setError('Failed to fetch communities')
      console.error('Error fetching communities:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserCommunityStatus = async () => {
    try {
      const response = await fetch('/api/community')
      const data = await response.json()

      if (response.ok) {
        setHasCreatedCommunity(data.hasCreatedCommunity)
        setUserCommunity(data.community)
      }
    } catch (err) {
      console.error('Error fetching user community status:', err)
      // Don't set error state for this, as it's not critical for the main functionality
    }
  }


  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true)
      const userId = session?.user?.id

      // If user has their own community, fetch posts from their community only
      // Otherwise, fetch all posts (for users without communities or not logged in)
      let apiUrl = '/api/community/posts'
      if (userCommunity && userCommunity.id) {
        apiUrl = `/api/community/${userCommunity.uuid}/posts`
      }

      const response = await fetch(`${apiUrl}${userId ? `?userId=${userId}` : ''}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      // For non-logged-in users, show empty posts
      setPosts([])
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoinCommunity = (communityId: number) => {
    setCommunities(prev => prev.map(community =>
      community.id === communityId
        ? {
            ...community,
            isJoined: !community.isJoined,
            memberCount: community.isJoined ? community.memberCount - 1 : community.memberCount + 1
          }
        : community
    ))
  }

  const handleFindCommunities = () => {
    setShowFindCommunities(true)
    // Load initial search results
    searchCommunities('')
  }

  const searchCommunities = async (query: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/community/search?q=${encodeURIComponent(query)}&limit=20`)
      const data = await response.json()

      if (response.ok) {
        setSearchResults(data.communities.map((community: any) => ({
          ...community,
          isJoined: false, // In a real app, check if user is joined
          trending: false, // In a real app, determine based on activity
        })))
      } else {
        console.error('Search failed:', data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // Debounce search - search immediately for empty query, debounce for others
    if (query === '') {
      searchCommunities('')
    } else {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        searchCommunities(query)
      }, 300)
    }
  }

  const closeFindCommunities = () => {
    setShowFindCommunities(false)
    setSearchQuery('')
    setSearchResults([])
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleLikePost = async (postId: number) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to like posts.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: data.isLiked,
                likes: data.likeCount
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleBookmarkPost = async (postId: number) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to bookmark posts.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, isBookmarked: data.isBookmarked }
            : post
        ))
        toast({
          title: data.isBookmarked ? "Post Bookmarked" : "Bookmark Removed",
          description: data.isBookmarked ? "Post saved to your bookmarks" : "Post removed from bookmarks",
        })
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
    }
  }

  const handleCommentPost = async (postId: number) => {
    const comment = commentInputs[postId]?.trim()
    if (!comment) return

    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to comment on posts.",
        variant: "destructive"
      })
      return
    }

    // Set loading state
    setSubmittingComment(prev => ({ ...prev, [postId]: true }))

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          userId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Add the new comment to the local state
        const newComment = {
          id: Date.now(),
          content: comment,
          author: {
            name: session.user.name || 'You',
            avatar: session.user.image || '/diverse-user-avatars.png',
            role: (session.user as any).role || 'Member'
          },
          timestamp: 'Just now',
          likes: 0,
          isLiked: false
        }

        setPostComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment]
        }))

        setPosts(prev => prev.map(post =>
          post.id === postId
            ? { ...post, comments: data.commentCount }
            : post
        ))
        setCommentInputs(prev => ({ ...prev, [postId]: '' }))
        toast({
          title: "Comment Added",
          description: "Your comment has been posted",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to post comment",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error commenting on post:', error)
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      })
    } finally {
      // Clear loading state
      setSubmittingComment(prev => ({ ...prev, [postId]: false }))
    }
  }

  const toggleComments = async (postId: number) => {
    const isCurrentlyOpen = showComments[postId]

    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }))

    // If opening comments and we haven't fetched them yet, fetch them
    if (!isCurrentlyOpen && !postComments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }))

      try {
        const response = await fetch(`/api/community/posts/${postId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setPostComments(prev => ({ ...prev, [postId]: data.comments }))
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }))
      }
    }
  }


  const handleSharePost = async (post: Post) => {
     try {
       // Create a shareable URL using the post's public key (UUID)
       // This creates a more specific URL that could be used for post detail pages
       const shareUrl = post.publicKey
         ? `${window.location.origin}/community/post/${post.publicKey}`
         : `${window.location.origin}/community/${post.community.uuid}`

       await navigator.clipboard.writeText(shareUrl)

       toast({
         title: "Link Copied",
         description: post.publicKey ? "Post link copied to clipboard" : "Community link copied to clipboard",
       })

       // Here you could also implement sharing to social media platforms
       // or increment a share count in the database
     } catch (error) {
       console.error('Error sharing post:', error)
       toast({
         title: "Share Failed",
         description: "Unable to copy link to clipboard",
         variant: "destructive"
       })
     }
   }

  // Watermark utility function
  const addWatermarkToImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw the original image
        ctx?.drawImage(img, 0, 0)

        // Add watermark
        if (ctx) {
          // Watermark styling
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)' // Semi-transparent black background
          ctx.fillRect(canvas.width - 80, canvas.height - 40, 70, 30) // Rounded background

          // White text
          ctx.fillStyle = 'white'
          ctx.font = 'bold 16px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('NK', canvas.width - 45, canvas.height - 20)
        }

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(watermarkedFile)
          } else {
            reject(new Error('Failed to create watermarked image'))
          }
        }, file.type)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image or video file.",
        variant: "destructive"
      })
      return
    }

    try {
      let processedFile = file

      // Add watermark to images only
      if (file.type.startsWith('image/')) {
        processedFile = await addWatermarkToImage(file)
      }

      setSelectedFile(processedFile)

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string)
        }
        reader.readAsDataURL(processedFile)
      } else {
        // For videos, just show file name
        setFilePreview(file.name)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      toast({
        title: "Processing Error",
        description: "Failed to process the selected file.",
        variant: "destructive"
      })
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() && !selectedFile) return
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to create posts.",
        variant: "destructive"
      })
      return
    }
    if (!userCommunity) {
      toast({
        title: "No Community",
        description: "You need to create or join a community first.",
        variant: "destructive"
      })
      return
    }

    setIsCreatingPost(true)
    try {
      const formData = new FormData()
      formData.append('content', newPost)
      formData.append('communityId', userCommunity.id.toString())
      formData.append('userId', session.user.id)

      if (selectedFile) {
        formData.append('media', selectedFile)
        formData.append('type', selectedFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO')
      } else {
        formData.append('type', 'TEXT')
      }

      const response = await fetch(`/api/community/${userCommunity.uuid}/posts`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newPostData: Post = {
          id: Date.now(),
          content: newPost,
          type: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'video') : 'text',
          media: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
          author: {
            name: session.user.name || 'You',
            avatar: session.user.image || '/diverse-user-avatars.png',
            role: (session.user as any).role === 'ADMIN' ? 'Administrator' :
                  (session.user as any).role === 'SELLER' ? 'Seller' : 'Community Member'
          },
          community: {
            name: userCommunity.name,
            uuid: userCommunity.uuid
          },
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false,
          isBookmarked: false
        }

        setPosts(prev => [newPostData, ...prev])
        setNewPost('')
        setSelectedFile(null)
        setFilePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

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
      setIsCreatingPost(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const floatingIcons = [
    { icon: Sprout, delay: 0, x: 100, y: 50 },
    { icon: Tractor, delay: 2, x: 200, y: 100 },
    { icon: Leaf, delay: 4, x: 150, y: 150 },
    { icon: Sun, delay: 6, x: 50, y: 120 }
  ]

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
            <Button onClick={fetchCommunities}>Retry</Button>
          </div>
        </div>
  
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/community" className="text-2xl font-bold text-green-600">
                  🌱 FarmConnect
                </Link>
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/community">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  {session?.user && (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/community">
                          <Users className="h-4 w-4 mr-2" />
                          Community
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Messages
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Button>
                    </>
                  )}
                </div>
                {session?.user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || "/diverse-user-avatars.png"} />
                    <AvatarFallback>{session.user.name?.[0] || 'Y'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* Community Profile Card */}
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userCommunity?.image || "/placeholder.svg"} />
                      <AvatarFallback>{userCommunity?.name?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{userCommunity?.name || 'No Community'}</h3>
                      <p className="text-sm text-gray-500">
                        {userCommunity ? `${userCommunity.category} • ${userCommunity.memberCount} members` : 'Create your community'}
                      </p>
                    </div>
                  </div>
                  {userCommunity ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Members</span>
                        <span className="font-semibold">
                          {userCommunity.memberCount?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Posts</span>
                        <span className="font-semibold">
                          {userCommunity.postCount?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Category</span>
                        <span className="font-semibold">
                          {userCommunity.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">You haven't created a community yet</p>
                      <Button size="sm" asChild>
                        <Link href="/community/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Community
                        </Link>
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Navigation */}
                <Card className="p-4">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/community">
                        <Home className="h-4 w-4 mr-3" />
                        Home
                      </Link>
                    </Button>
                    {userCommunity && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href={`/community/${userCommunity.uuid}`}>
                          <Users className="h-4 w-4 mr-3" />
                          My Community
                        </Link>
                      </Button>
                    )}
                    {userCommunity && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href={`/community/${userCommunity.uuid}/settings`}>
                          <Settings className="h-4 w-4 mr-3" />
                          Community Settings
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-3" />
                      Messages
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </nav>
                </Card>
              </div>
            </div>

            {/* Center Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post - Only show if user has a community */}
              {userCommunity ? (
                <Card className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || "/diverse-user-avatars.png"} />
                      <AvatarFallback>{session?.user?.name?.[0] || 'Y'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder={`What's on your farming mind${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}?`}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[80px] border-0 bg-gray-50 focus:bg-white resize-none"
                      />

                      {/* File Preview */}
                      {filePreview && (
                        <div className="relative mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {selectedFile?.type.startsWith('image/') ? (
                                <Image
                                  src={filePreview}
                                  alt="Preview"
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Video className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium">{selectedFile?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile?.size! / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="media-upload"
                          />
                          <label htmlFor="media-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              asChild
                            >
                              <span>
                                <Camera className="h-4 w-4 mr-1" />
                                Photo/Video
                              </span>
                            </Button>
                          </label>
                        </div>
                        <Button
                          onClick={handleCreatePost}
                          disabled={(!newPost.trim() && !selectedFile) || isCreatingPost}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isCreatingPost ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          {isCreatingPost ? 'Posting...' : 'Post'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Show message when user doesn't have a community */
                <Card className="p-8 text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
                  <p className="text-gray-500 mb-4">
                    Create your own community or join an existing one to start sharing and connecting with fellow farmers.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/community/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleFindCommunities}>
                      <Search className="h-4 w-4 mr-2" />
                      Find Communities
                    </Button>
                  </div>
                </Card>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {isLoadingPosts ? (
                  <Card className="p-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading posts...</p>
                  </Card>
                ) : posts.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold mb-2">
                      {userCommunity ? 'No posts yet' : 'Welcome to FarmConnect Community'}
                    </h3>
                    <p className="text-gray-500">
                      {userCommunity
                        ? 'Be the first to share something with your community!'
                        : 'Create your community or join an existing one to start sharing and connecting with fellow farmers.'
                      }
                    </p>
                    {!userCommunity && (
                      <div className="flex gap-3 justify-center mt-4">
                        <Button asChild>
                          <Link href="/community/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Community
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={handleFindCommunities}>
                          <Search className="h-4 w-4 mr-2" />
                          Find Communities
                        </Button>
                      </div>
                    )}
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="p-4">
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-sm">{post.author.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{post.author.role}</span>
                              <span>•</span>
                              <span>{post.timestamp}</span>
                              <span>•</span>
                              <span>in {post.community.name}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        {post.content && <p className="text-gray-800 mb-3">{post.content}</p>}
                        {post.media && (
                          <div className="rounded-lg overflow-hidden border">
                            {post.type === 'image' && (
                              <Image
                                src={post.media}
                                alt="Post media"
                                width={500}
                                height={300}
                                className="w-full h-auto object-cover"
                              />
                            )}
                            {post.type === 'video' && (
                              <video
                                src={post.media}
                                controls
                                className="w-full h-auto max-h-96 object-cover"
                              >
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={post.isLiked ? 'text-red-500' : 'text-gray-500'}
                          >
                            <ThumbsUp className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(post.id)}
                            className="text-gray-500"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSharePost(post)}
                            className="text-gray-500"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmarkPost(post.id)}
                          className={post.isBookmarked ? 'text-yellow-500' : 'text-gray-500'}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <div className="mt-4 pt-4 border-t">
                          {/* Existing Comments */}
                          {loadingComments[post.id] ? (
                            <div className="text-center py-4">
                              <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                              <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
                            </div>
                          ) : (
                            postComments[post.id] && postComments[post.id].length > 0 && (
                              <div className="space-y-3 mb-4">
                                {postComments[post.id].map((comment: any) => (
                                  <div key={comment.id} className="flex gap-3">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <AvatarImage src={comment.author.avatar} />
                                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-sm">{comment.author.name}</span>
                                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 ml-3">
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                          Like ({comment.likes})
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          )}

                          {/* Comment Input */}
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={session?.user?.image || "/diverse-user-avatars.png"} />
                              <AvatarFallback>{session?.user?.name?.[0] || 'Y'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Write a comment..."
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleCommentPost(post.id)
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleCommentPost(post.id)}
                                disabled={!commentInputs[post.id]?.trim() || submittingComment[post.id]}
                              >
                                {submittingComment[post.id] ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                  />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Suggested Communities */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Suggested Communities</h3>
                  <div className="space-y-3">
                    {suggestedCommunities.slice(0, 5).map((community) => (
                      <div key={community.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={community.image || "/placeholder.svg"}
                            alt={community.name}
                            width={32}
                            height={32}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{community.name}</h4>
                          <p className="text-xs text-gray-500">{community.memberCount} members</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Trending Topics */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Trending Topics</h3>
                  <div className="space-y-2">
                    {[
                      '#OrganicFarming',
                      '#RiceCultivation',
                      '#SustainableAgri',
                      '#FarmTech',
                      '#CropRotation'
                    ].map((topic) => (
                      <div key={topic} className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {topic}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {!userCommunity && (
                      <Button className="w-full" size="sm" asChild>
                        <Link href="/community/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Community
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={handleFindCommunities}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Communities
                    </Button>
                    {userCommunity && (
                      <Button variant="outline" className="w-full" size="sm" asChild>
                        <Link href={`/community/${userCommunity.uuid}/settings`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Community
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Find Communities Modal */}
        {showFindCommunities && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Find Communities</h2>
                <Button variant="ghost" size="sm" onClick={closeFindCommunities}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="p-6 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-6">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching communities...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? 'No communities found' : 'Start searching for communities'}
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? `No communities match "${searchQuery}". Try a different search term.`
                        : 'Enter a search term to find communities that interest you.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((community) => (
                      <Card key={community.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={community.image || "/placeholder.svg"} />
                            <AvatarFallback>{community.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{community.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{community.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{community.category}</span>
                              <span>•</span>
                              <span>{community.memberCount} members</span>
                              <span>•</span>
                              <span>{community.postCount} posts</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={community.isJoined ? "secondary" : "default"}
                              onClick={() => handleJoinCommunity(community.id)}
                            >
                              {community.isJoined ? 'Joined' : 'Join'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link href={`/community/${community.uuid}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
