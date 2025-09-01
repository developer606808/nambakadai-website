'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Calendar, MapPin, Star, Share2, Heart, MessageCircle, Bookmark, MoreHorizontal, ImageIcon, Video, Type, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { MainLayout } from '@/components/main-layout'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: number
  publicKey: string
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

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (params?.publicKey) {
      fetchPost()
    }
  }, [params?.publicKey])

  const fetchPost = async () => {
    if (!params?.publicKey) {
      setError('Invalid post URL')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      // For now, we'll fetch all posts and find the one with matching publicKey
      // In a production app, you'd have a dedicated API endpoint for this
      const response = await fetch('/api/community/posts')
      const data = await response.json()

      if (response.ok) {
        const foundPost = data.posts.find((p: Post) => p.publicKey === params.publicKey)
        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('Post not found')
        }
      } else {
        setError(data.error || 'Failed to fetch post')
      }
    } catch (err) {
      setError('Failed to fetch post')
      console.error('Error fetching post:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikePost = async () => {
    if (!post) return

    try {
      const response = await fetch(`/api/community/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // In a real app, get from session
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPost(prev => prev ? {
          ...prev,
          isLiked: data.isLiked,
          likes: data.likeCount
        } : null)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleBookmarkPost = async () => {
    if (!post) return

    try {
      const response = await fetch(`/api/community/posts/${post.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // In a real app, get from session
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPost(prev => prev ? { ...prev, isBookmarked: data.isBookmarked } : null)
        toast({
          title: data.isBookmarked ? "Post Bookmarked" : "Bookmark Removed",
          description: data.isBookmarked ? "Post saved to your bookmarks" : "Post removed from bookmarks",
        })
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
    }
  }

  const handleSharePost = async () => {
    if (!post) return

    try {
      const shareUrl = `${window.location.origin}/community/post/${post.publicKey}`
      await navigator.clipboard.writeText(shareUrl)

      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard",
      })
    } catch (error) {
      console.error('Error sharing post:', error)
      toast({
        title: "Share Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive"
      })
    }
  }

  const handleSubmitComment = async () => {
    if (!post || !newComment.trim()) return

    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: 1, // In a real app, get from session
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPost(prev => prev ? { ...prev, comments: data.commentCount } : null)
        setNewComment('')
        toast({
          title: "Comment Added",
          description: "Your comment has been posted",
        })
      }
    } catch (error) {
      console.error('Error commenting on post:', error)
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingComment(false)
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

  if (error || !post) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error || 'Post not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/community">Back to Community</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <div>
              <h1 className="text-2xl font-bold">Post Details</h1>
              <p className="text-gray-600">Shared from {post.community.name}</p>
            </div>
          </motion.div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{post.author.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
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
                <div className="mb-6">
                  {post.content && <p className="text-gray-800 mb-4 text-lg">{post.content}</p>}
                  {post.media && (
                    <div className="rounded-lg overflow-hidden border max-w-2xl">
                      {post.type === 'image' && (
                        <Image
                          src={post.media}
                          alt="Post media"
                          width={800}
                          height={600}
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
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLikePost}
                      className={post.isLiked ? 'text-red-500' : 'text-gray-500'}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSharePost}
                      className="text-gray-500"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmarkPost}
                    className={post.isBookmarked ? 'text-yellow-500' : 'text-gray-500'}
                  >
                    <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Comment Section */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Add a Comment</h3>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 min-h-[80px]"
                      />
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="self-end"
                      >
                        {isSubmittingComment ? (
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}