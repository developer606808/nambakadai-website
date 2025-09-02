'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, MessageCircle, MapPin, Calendar, Star, User, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/main-layout';
import { useSession } from 'next-auth/react';

interface Post {
  id: number
  content: string
  createdAt: string
  user: {
    name: string
    avatar?: string
  }
  commentCount: number
  likeCount: number
}

interface Member {
  id: number
  user: {
    name: string
    avatar?: string
  }
  role: string
  joinedAt: string
}

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
  location: string
  isVerified: boolean
  createdAt: string
  rules?: string
  posts: Post[]
  members: Member[]
}

export default function CommunityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [slug, publicKey, action] = (params?.params as string[]) || []
  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Handle redirects for sub-pages
    if (action) {
      setRedirecting(true)
      const redirectUrl = action === 'settings'
        ? `/community/${slug}/${publicKey}/settings`
        : action === 'invite'
        ? `/community/${slug}/${publicKey}/invite`
        : action === 'create-post'
        ? `/community/${slug}/${publicKey}/create-post`
        : `/community/${slug}/${publicKey}`

      // Use replace instead of push to avoid back button issues
      setTimeout(() => {
        console.log('Redirecting to:', redirectUrl)
        router.replace(redirectUrl)
      }, 800) // Increased delay to ensure loading is visible
      return
    }

    if (!slug || !publicKey) {
      router.push('/community')
      return
    }

    fetchCommunity()
  }, [slug, publicKey, action, router])

  const fetchCommunity = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/community/${publicKey}`)
      if (response.ok) {
        const data = await response.json()
        setCommunity(data)
      } else {
        console.error('Failed to fetch community')
        router.push('/community')
      }
    } catch (error) {
      console.error('Error fetching community:', error)
      router.push('/community')
    } finally {
      setLoading(false)
    }
  }

  if (redirecting) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6 max-w-md mx-auto p-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mx-auto"
            />
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Redirecting...</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Taking you to the <span className="font-semibold text-green-600 capitalize">{action?.replace('-', ' ')}</span> page
              </p>
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                <p>Community: {slug}</p>
                <p>Action: {action}</p>
              </div>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>

            {/* Fallback button in case redirect doesn't work */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">If redirect doesn't work:</p>
              <Button
                onClick={() => {
                  const url = action === 'settings'
                    ? `/community/${slug}/${publicKey}/settings`
                    : action === 'invite'
                    ? `/community/${slug}/${publicKey}/invite`
                    : action === 'create-post'
                    ? `/community/${slug}/${publicKey}/create-post`
                    : `/community/${slug}/${publicKey}`
                  window.location.href = url
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Go to {action?.replace('-', ' ')} page manually
              </Button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto"
            />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Loading Community...</h3>
              <p className="text-sm text-gray-600">Please wait while we fetch the details</p>
            </div>
          </motion.div>
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
              <ChevronRight className="h-4 w-4 mr-2" />
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
        {/* Community Header */}
        <div className="bg-white border-b border-green-200 shadow-sm">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Community Image and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  {community?.image && community.image.startsWith('http') ? (
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // Hide the image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {/* Always show fallback */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {community?.name?.[0]?.toUpperCase() || 'C'}
                    </span>
                  </div>
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{community?.name}</h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700 text-sm">{community?.memberCount} members</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700 text-sm">{community?.postCount} posts</span>
                    </div>
                    {community?.isVerified && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{community?.location || 'Global'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{community?.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Stats and Actions */}
              <div className="lg:ml-auto w-full lg:w-auto">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 hover:bg-white transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Members</span>
                        <span className="font-bold text-green-700 text-lg">{community?.memberCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 hover:bg-white transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Total Posts</span>
                        <span className="font-bold text-green-700 text-lg">{community?.postCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-green-100 hover:bg-white transition-colors duration-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Category</span>
                        <span className="font-bold text-green-700">{community?.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <Users className="h-5 w-5 mr-2" />
                      Join Community
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Description */}
            {community?.description && (
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  About This Community
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-base">{community.description}</p>
                </div>
              </div>
            )}

            {/* Community Rules */}
            {community?.rules && (
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  Community Rules
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
                  <p className="text-amber-800 text-sm leading-relaxed">{community.rules}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Community Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Posts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  Recent Posts
                </h2>
                <Link href={`/community/${slug}/${publicKey}/posts`}>
                  <Button variant="outline" className="h-12 px-6 border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <span className="hidden sm:inline">View All Posts</span>
                    <span className="sm:hidden">All Posts</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {community?.posts && community.posts.length > 0 ? (
                <div className="space-y-6">
                  {community.posts.map((post: Post, index: number) => (
                    <div key={post.id} className="bg-white rounded-xl border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-200 shadow-md">
                            {post.user.avatar && post.user.avatar.startsWith('http') ? (
                              <Image
                                src={post.user.avatar}
                                alt={post.user.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Hide the image if it fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : null}
                            {/* Always show fallback */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {post.user.name?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-900 text-base">{post.user.name}</h4>
                              <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg border border-green-100 mb-4">
                              <p className="text-gray-800 leading-relaxed">{post.content}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer group">
                                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium text-sm">{post.commentCount} comments</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 cursor-pointer group">
                                <Star className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium text-sm">{post.likeCount} likes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">No posts yet</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Be the first to start a discussion in this community! Share your thoughts, experiences, and connect with fellow members.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <Link href={`/community/${slug}/${publicKey}/create-post`}>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Create First Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Members */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  Recent Members
                </h3>
                {community?.members && community.members.length > 0 ? (
                  <div className="space-y-4">
                    {community.members.map((member: Member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-green-100 hover:bg-white transition-all duration-200 hover:shadow-md cursor-pointer">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-200 shadow-sm">
                          {member.user.avatar && member.user.avatar.startsWith('http') ? (
                            <Image
                              src={member.user.avatar}
                              alt={member.user.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Hide the image if it fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          {/* Always show fallback */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {member.user.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{member.user.name}</p>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              member.role === 'ADMIN' ? 'bg-red-500' :
                              member.role === 'MODERATOR' ? 'bg-blue-500' : 'bg-green-500'
                            }`}></div>
                            <p className="text-xs text-gray-600 capitalize">{member.role.toLowerCase()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {community.memberCount > 6 && (
                      <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-700">
                          +{community.memberCount - 6} more members
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">No members yet</p>
                    <p className="text-gray-500 text-xs mt-1">Be the first to join!</p>
                  </div>
                )}
              </div>

              {/* Community Actions */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Settings className="h-3 w-3 text-white" />
                  </div>
                  Community Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
                    size="sm"
                    asChild
                  >
                    <Link href={`/community/${slug}/${publicKey}/create-post`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Create Post
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
                    size="sm"
                    asChild
                  >
                    <Link href={`/community/${slug}/${publicKey}/invite`}>
                      <User className="h-4 w-4 mr-2" />
                      Invite Members
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
                    size="sm"
                    onClick={() => {
                      console.log('Settings button clicked')
                      console.log('Navigating to:', `/community/${slug}/${publicKey}/settings`)
                      router.push(`/community/${slug}/${publicKey}/settings`)
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Community Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}