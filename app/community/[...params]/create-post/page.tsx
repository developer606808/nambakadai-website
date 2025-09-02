'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ImageIcon,
  Type,
  Send,
  X,
  Loader2,
  Camera,
  FileText,
  Hash,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { MainLayout } from '@/components/main-layout'
import { useSession } from 'next-auth/react'

interface Community {
  id: number
  uuid: string
  name: string
  description: string
  image: string
  category: string
}

export default function CreatePostPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [slug, publicKey] = (params?.params as string[]) || []

  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  // Post form state
  const [postContent, setPostContent] = useState('')
  const [postType, setPostType] = useState<'text' | 'image'>('text')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [isPreview, setIsPreview] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxLength = 1000

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (slug && publicKey) {
      fetchCommunity()
    }
  }, [slug, publicKey, status, router])

  useEffect(() => {
    setCharCount(postContent.length)
  }, [postContent])

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/community/${publicKey}`)
      if (response.ok) {
        const data = await response.json()
        setCommunity(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load community information.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching community:', error)
      toast({
        title: "Error",
        description: "Failed to load community information.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setFilePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!postContent.trim() && !selectedFile) {
      toast({
        title: "Content Required",
        description: "Please add some text or select an image for your post.",
        variant: "destructive"
      })
      return
    }

    if (postContent.length > maxLength) {
      toast({
        title: "Content Too Long",
        description: `Please keep your post under ${maxLength} characters.`,
        variant: "destructive"
      })
      return
    }

    setPosting(true)
    try {
      const formData = new FormData()
      formData.append('content', postContent.trim())
      formData.append('type', selectedFile ? 'image' : 'text')
      formData.append('communityId', community!.id.toString())

      if (selectedFile) {
        formData.append('media', selectedFile)
      }

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Post Created",
          description: "Your post has been published successfully!",
        })
        router.push(`/community/${slug}/${publicKey}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create post.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      })
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
          />
        </div>
      </MainLayout>
    )
  }

  if (!community) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Not Found</h2>
            <p className="text-gray-600 mb-6">The community you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/community')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Communities
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/community/${slug}/${publicKey}`)}
                className="hover:bg-white/70"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                {community.image && community.image.startsWith('http') ? (
                  <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {community.name?.[0]?.toUpperCase() || 'C'}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Post</h1>
                <p className="text-gray-600">Share something with the {community.name} community</p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Post Type Selection */}
            <Card className="bg-white border-2 border-green-200 shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Button
                    variant={postType === 'text' ? 'default' : 'outline'}
                    onClick={() => setPostType('text')}
                    className={`flex-1 ${postType === 'text' ? 'bg-green-500 hover:bg-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Text Post
                  </Button>
                  <Button
                    variant={postType === 'image' ? 'default' : 'outline'}
                    onClick={() => setPostType('image')}
                    className={`flex-1 ${postType === 'image' ? 'bg-green-500 hover:bg-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Post Content */}
            <Card className="bg-white border-2 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Post Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">What's on your mind?</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, experiences, or ask questions..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                    maxLength={maxLength}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${charCount > maxLength * 0.9 ? 'text-red-600' : 'text-gray-600'}`}>
                      {charCount}/{maxLength}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {isPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {isPreview ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </div>

                {/* Image Upload */}
                {postType === 'image' && (
                  <div className="space-y-4">
                    <Label>Image</Label>
                    {!selectedFile ? (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload an image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, WebP, GIF up to 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={filePreview!}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeFile}
                          className="absolute top-2 right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Preview */}
                {isPreview && postContent && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{postContent}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/community/${slug}/${publicKey}`)}
                    disabled={posting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={posting || (!postContent.trim() && !selectedFile)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {posting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Info */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    {community.image && community.image.startsWith('http') ? (
                      <Image
                        src={community.image}
                        alt={community.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {community.name?.[0]?.toUpperCase() || 'C'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{community.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {community.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{community.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}