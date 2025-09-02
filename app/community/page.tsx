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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { MainLayout } from '@/components/main-layout'
import { useSession } from 'next-auth/react'

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
    image?: string
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

  // Character count states
  const [postCharCount, setPostCharCount] = useState(0)
  const [commentCharCounts, setCommentCharCounts] = useState<{[key: number]: number}>({})

  // Max lengths
  const maxLengths = {
    post: 1000,
    comment: 500
  }
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({})
  const [postComments, setPostComments] = useState<{[key: number]: any[]}>({})
  const [loadingComments, setLoadingComments] = useState<{[key: number]: boolean}>({})
  const [submittingComment, setSubmittingComment] = useState<{[key: number]: boolean}>({})
  const [showFindCommunities, setShowFindCommunities] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Community[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchCharCount, setSearchCharCount] = useState(0)
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
      const img = new window.Image()

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
        variant: "destructive" as const
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
            uuid: userCommunity.uuid,
            image: userCommunity.image
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
        setPostCharCount(0) // Reset character count
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="hidden xl:block xl:col-span-3">
              <div className="sticky top-20 space-y-4">
                {/* Community Profile Card */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-14 w-14 ring-4 ring-green-200">
                        <AvatarImage src={userCommunity?.image || "/placeholder.svg"} />
                        <AvatarFallback className="bg-green-100 text-green-700 text-lg font-bold">
                          {userCommunity?.name?.[0] || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{userCommunity?.name || 'No Community'}</h3>
                        <p className="text-sm text-gray-600">
                          {userCommunity ? `${userCommunity.category} • ${userCommunity.memberCount} members` : 'Create your community'}
                        </p>
                      </div>
                    </div>
                    {userCommunity ? (
                      <div className="space-y-4">
                        <div className="bg-white/70 rounded-lg p-3 border border-green-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Members</span>
                            <span className="font-bold text-green-700 text-lg">
                              {userCommunity.memberCount?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-green-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Posts</span>
                            <span className="font-bold text-green-700 text-lg">
                              {userCommunity.postCount?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 border border-green-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Category</span>
                            <span className="font-bold text-green-700">
                              {userCommunity.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">You haven't created a community yet</p>
                        <p className="text-xs text-gray-500">Use the main create community card above to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                  <CardContent className="p-6">
                    <nav className="space-y-3">
                      <Button
                        variant="ghost"
                        className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                        asChild
                      >
                        <Link href="/community">
                          <Home className="h-5 w-5 mr-3 text-green-600" />
                          Home
                        </Link>
                      </Button>
                      {userCommunity && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                          asChild
                        >
                          <Link href={`/community/${userCommunity.slug || userCommunity.name?.toLowerCase().replace(/\s+/g, '-')}/${userCommunity.publicKey || userCommunity.uuid}`}>
                            <Users className="h-5 w-5 mr-3 text-green-600" />
                            My Community
                          </Link>
                        </Button>
                      )}
                      {userCommunity && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                          asChild
                        >
                          <Link href={`/community/${userCommunity.slug || userCommunity.name?.toLowerCase().replace(/\s+/g, '-')}/${userCommunity.publicKey || userCommunity.uuid}/settings`}>
                            <Settings className="h-5 w-5 mr-3 text-green-600" />
                            Community Settings
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <User className="h-5 w-5 mr-3 text-green-600" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
                        Messages
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start bg-white/70 hover:bg-white border border-green-200 text-gray-700 hover:text-green-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <Settings className="h-5 w-5 mr-3 text-green-600" />
                        Settings
                      </Button>
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Center Feed */}
            <div className="xl:col-span-6 space-y-4 sm:space-y-6">
              {/* Create Post - Only show if user has a community */}
              {userCommunity ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex gap-3 sm:gap-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-green-200 flex-shrink-0">
                          <AvatarImage src={session?.user?.image || "/diverse-user-avatars.png"} />
                          <AvatarFallback className="bg-green-100 text-green-700">{session?.user?.name?.[0] || 'Y'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="relative">
                            <Textarea
                              placeholder={`What's on your farming mind${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}? 🌱`}
                              value={newPost}
                              onChange={(e) => {
                                setNewPost(e.target.value)
                                setPostCharCount(e.target.value.length)
                              }}
                              maxLength={maxLengths.post}
                              className="min-h-[80px] sm:min-h-[100px] border-2 border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-200 resize-none text-base rounded-lg transition-all duration-200 pr-20"
                            />
                            <div className="absolute right-3 bottom-3 text-xs font-medium">
                              <span className={`${postCharCount > maxLengths.post * 0.9 ? 'text-red-500' : postCharCount > maxLengths.post * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {postCharCount}/{maxLengths.post}
                              </span>
                            </div>
                          </div>

                          {/* File Preview */}
                          {filePreview && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {selectedFile?.type.startsWith('image/') ? (
                                    <Image
                                      src={filePreview}
                                      alt="Preview"
                                      width={60}
                                      height={60}
                                      className="rounded-lg object-cover ring-2 ring-green-200"
                                    />
                                  ) : (
                                    <div className="w-15 h-15 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center ring-2 ring-green-200">
                                      <Video className="h-6 w-6 text-green-600" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{selectedFile?.name}</p>
                                    <p className="text-xs text-gray-600">
                                      {(selectedFile?.size! / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeFile}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
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
                                  className="cursor-pointer border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
                                  asChild
                                >
                                  <span>
                                    <Camera className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">Photo/Video</span>
                                    <span className="sm:hidden">Media</span>
                                  </span>
                                </Button>
                              </label>
                            </div>
                            <Button
                              onClick={handleCreatePost}
                              disabled={(!newPost.trim() && !selectedFile) || isCreatingPost}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                            >
                              {isCreatingPost ? (
                                <div className="flex items-center space-x-2">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                  />
                                  <span>Posting...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Send className="h-5 w-5" />
                                  <span>Post</span>
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                /* Show centered create community card when user doesn't have a community */
                <div className="flex items-center justify-center min-h-[60vh] px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-md w-full"
                  >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-xl">
                      {/* Decorative background elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full -ml-12 -mb-12 opacity-20"></div>

                      <CardContent className="relative p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                          className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                          <Sprout className="w-10 h-10 text-white" />
                        </motion.div>

                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-2xl font-bold text-gray-800 mb-3"
                        >
                          Start Your Farming Journey
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="text-gray-600 mb-8 leading-relaxed"
                        >
                          Create your own community or join fellow farmers to share knowledge, experiences, and build connections in the agricultural world.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                          <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <Link href="/community/create">
                              <Plus className="h-5 w-5 mr-2" />
                              Create Community
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleFindCommunities}
                            className="border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold px-8 py-3 transition-all duration-300 hover:scale-105"
                          >
                            <Search className="h-5 w-5 mr-2" />
                            Find Communities
                          </Button>
                        </motion.div>

                        {/* Additional visual elements */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0, duration: 0.5 }}
                          className="mt-8 flex justify-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {isLoadingPosts ? (
                  <Card className="p-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading posts...</p>
                  </Card>
                ) : posts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center min-h-[50vh] px-4"
                  >
                    <Card className="max-w-lg w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                          className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                          <Type className="w-8 h-8 text-white" />
                        </motion.div>

                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-xl font-bold text-gray-800 mb-3"
                        >
                          {userCommunity ? 'No posts yet' : 'Welcome to FarmConnect Community'}
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="text-gray-600 mb-6 leading-relaxed"
                        >
                          {userCommunity
                            ? 'Be the first to share something with your community! Start the conversation and inspire fellow farmers.'
                            : 'Create your community or join an existing one to start sharing and connecting with fellow farmers.'
                          }
                        </motion.p>

                        {!userCommunity && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="text-center"
                          >
                            <p className="text-sm text-gray-600">Use the main create community card above to get started</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white border-2 border-green-100 hover:border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                        <CardContent className="p-4 sm:p-6">
                          {/* Enhanced Post Header with Community and User Info */}
                          <div className="mb-4 space-y-3">
                            {/* Community Header - Top */}
                            <div className="flex items-center justify-center">
                              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-4 py-2 rounded-full border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                                {/* Community Logo */}
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center ring-2 ring-green-300 shadow-sm flex-shrink-0">
                                  {post.community?.image ? (
                                    <Image
                                      src={post.community.image}
                                      alt={post.community.name}
                                      width={24}
                                      height={24}
                                      className="rounded-full object-cover w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-white font-bold text-sm">
                                      {(post.community?.name || 'C')[0].toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {/* Community Name and Timestamp */}
                                <div className="flex flex-col items-center min-w-0">
                                  <span className="text-green-800 font-bold text-sm text-center">
                                    {post.community?.name || 'Community'}
                                  </span>
                                  <span className="text-green-600 text-xs font-medium">
                                    {post.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* User Info and Options - Bottom */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* User Avatar */}
                                <div className="relative w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-gray-200 shadow-sm flex-shrink-0">
                                  {post.author?.avatar && post.author.avatar.startsWith('http') ? (
                                    <Image
                                      src={post.author.avatar}
                                      alt={post.author.name}
                                      width={24}
                                      height={24}
                                      className="rounded-full object-cover w-full h-full"
                                      onError={(e) => {
                                        // Hide the image if it fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : null}
                                  {/* Always show fallback initial */}
                                  <span className="text-white font-bold text-sm">
                                    {post.author?.name?.[0]?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                                {/* User Name and Role */}
                                <div className="flex flex-col min-w-0">
                                  <span className="text-gray-900 font-semibold text-sm truncate">
                                    {post.author?.name || 'Anonymous'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                      {post.author?.role || 'Member'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* More Options */}
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="mb-6">
                            {post.content && (
                              <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg border border-green-100 mb-4">
                                <p className="text-gray-800 text-base leading-relaxed font-medium">{post.content}</p>
                              </div>
                            )}
                            {post.media && (
                              <div className="rounded-xl overflow-hidden border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                {post.type === 'image' && (
                                  <div className="relative group">
                                    <Image
                                      src={post.media}
                                      alt="Post media"
                                      width={600}
                                      height={400}
                                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                )}
                                {post.type === 'video' && (
                                  <div className="relative">
                                    <video
                                      src={post.media}
                                      controls
                                      className="w-full h-auto max-h-96 object-cover rounded-xl"
                                      poster="/video-poster.jpg"
                                    >
                                      Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                                      Video
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Enhanced Post Actions */}
                          <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLikePost(post.id)}
                                  className={`h-10 px-3 rounded-full transition-all duration-300 hover:scale-110 shadow-sm ${
                                    post.isLiked
                                      ? 'text-red-600 bg-red-100 hover:bg-red-200 border border-red-200'
                                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200'
                                  }`}
                                >
                                  <ThumbsUp className={`h-5 w-5 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                                  <span className="font-semibold text-sm">{post.likes}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleComments(post.id)}
                                  className="h-10 px-3 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-300 hover:scale-110 shadow-sm"
                                >
                                  <MessageSquare className="h-5 w-5 mr-1" />
                                  <span className="font-semibold text-sm">{post.comments}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSharePost(post)}
                                  className="h-10 px-3 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all duration-300 hover:scale-110 shadow-sm"
                                >
                                  <Share2 className="h-5 w-5 mr-1" />
                                  <span className="font-semibold text-sm">Share</span>
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBookmarkPost(post.id)}
                                className={`h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 shadow-sm ${
                                  post.isBookmarked
                                    ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200'
                                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 border border-transparent hover:border-yellow-200'
                                }`}
                              >
                                <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                              </Button>
                            </div>
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
                              <div className="space-y-4 mb-6">
                                {postComments[post.id].map((comment: any) => (
                                  <div key={comment.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                                    <div className="flex gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-blue-200 shadow-sm flex-shrink-0">
                                        {comment.author?.avatar && comment.author.avatar.startsWith('http') ? (
                                          <Image
                                            src={comment.author.avatar}
                                            alt={comment.author.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full object-cover w-full h-full"
                                          />
                                        ) : null}
                                        <span className="text-white font-bold text-sm">
                                          {comment.author?.name?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-blue-100">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-sm text-gray-900">{comment.author.name}</span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                              {comment.author.role || 'Member'}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-auto">{comment.timestamp}</span>
                                          </div>
                                          <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 ml-4">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-3 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                                          >
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            Like ({comment.likes || 0})
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-3 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                                          >
                                            Reply
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          )}

                          {/* Enhanced Comment Input */}
                          <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-gray-200 shadow-sm flex-shrink-0">
                                {session?.user?.image && session.user.image.startsWith('http') ? (
                                  <Image
                                    src={session.user.image}
                                    alt={session.user.name || 'User'}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover w-full h-full"
                                  />
                                ) : null}
                                <span className="text-white font-bold text-sm">
                                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="flex-1 flex gap-2">
                                <div className="flex-1 relative">
                                  <Input
                                    placeholder="Write a thoughtful comment..."
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      setCommentInputs(prev => ({ ...prev, [post.id]: value }))
                                      setCommentCharCounts(prev => ({ ...prev, [post.id]: value.length }))
                                    }}
                                    maxLength={maxLengths.comment}
                                    className="h-10 pr-16 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleCommentPost(post.id)
                                      }
                                    }}
                                  />
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium">
                                    <span className={`${(commentCharCounts[post.id] || 0) > maxLengths.comment * 0.9 ? 'text-red-500' : (commentCharCounts[post.id] || 0) > maxLengths.comment * 0.8 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                      {(commentCharCounts[post.id] || 0)}/{maxLengths.comment}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleCommentPost(post.id)}
                                  disabled={!commentInputs[post.id]?.trim() || submittingComment[post.id]}
                                  className="h-10 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                                >
                                  {submittingComment[post.id] ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                  ) : (
                                    <Send className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-3">
              <div className="sticky top-20 space-y-6">
                {/* Suggested Communities */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">Suggested Communities</h3>
                    </div>
                    <div className="space-y-4">
                      {suggestedCommunities.slice(0, 5).map((community) => (
                        <div key={community.id} className="flex items-center gap-4 p-3 bg-white/70 hover:bg-white border border-green-200 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center ring-2 ring-green-200">
                            <Image
                              src={community.image || "/placeholder.svg"}
                              alt={community.name}
                              width={32}
                              height={32}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{community.name}</h4>
                            <p className="text-xs text-gray-600">{community.memberCount} members</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-4 py-1 text-xs shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            Join
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">Trending Topics</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        '#OrganicFarming',
                        '#RiceCultivation',
                        '#SustainableAgri',
                        '#FarmTech',
                        '#CropRotation'
                      ].map((topic, index) => (
                        <motion.div
                          key={topic}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="bg-white/70 hover:bg-white border border-green-200 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                          <div className="text-sm font-semibold text-green-700 hover:text-green-800">
                            {topic}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Sun className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold h-12 transition-all duration-300 hover:scale-105 hover:shadow-md"
                        size="sm"
                        onClick={handleFindCommunities}
                      >
                        <Search className="h-5 w-5 mr-2" />
                        Find Communities
                      </Button>
                      {userCommunity && (
                        <Button
                          variant="outline"
                          className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold h-12 transition-all duration-300 hover:scale-105 hover:shadow-md"
                          size="sm"
                          asChild
                        >
                          <Link href={`/community/${userCommunity.slug || userCommunity.name?.toLowerCase().replace(/\s+/g, '-')}/${userCommunity.publicKey || userCommunity.uuid}/settings`}>
                            <Settings className="h-5 w-5 mr-2" />
                            Manage Community
                          </Link>
                        </Button>
                      )}
                      {!userCommunity && (
                        <div className="text-center py-4">
                          <p className="text-xs text-gray-600">Use the main create community card to get started</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearchInput(e)
                        setSearchCharCount(e.target.value.length)
                      }}
                      maxLength={100}
                      className="pl-10 pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500">
                      {searchCharCount}/100
                    </div>
                  </div>
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
                              <Link href={`/community/${community.slug || community.name?.toLowerCase().replace(/\s+/g, '-')}/${community.publicKey || community.uuid}`}>
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
