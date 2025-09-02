'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  UserPlus,
  Search,
  Mail,
  Copy,
  Check,
  X,
  Loader2,
  Users,
  Send,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  memberCount: number
}

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: string
}

interface Invitation {
  id: number
  email: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
  invitedAt: string
  expiresAt: string
}

export default function CommunityInvitePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [slug, publicKey] = (params?.params as string[]) || []

  const [community, setCommunity] = useState<Community | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [emailInvites, setEmailInvites] = useState('')
  const [sendingInvites, setSendingInvites] = useState(false)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (slug && publicKey) {
      fetchCommunity()
      fetchInvitations()
    }
  }, [slug, publicKey, status, router])

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

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`/api/community/${publicKey}/invitations`)
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations || [])
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    }
  }

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      }
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => [...prev, user])
    }
    setSearchTerm('')
    setSearchResults([])
  }

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId))
  }

  const handleSendInvites = async () => {
    if (selectedUsers.length === 0 && !emailInvites.trim()) {
      toast({
        title: "No Recipients",
        description: "Please select users or enter email addresses to invite.",
        variant: "destructive"
      })
      return
    }

    setSendingInvites(true)
    try {
      const emails = emailInvites.split(',').map(email => email.trim()).filter(email => email)
      const userIds = selectedUsers.map(user => user.id)

      const response = await fetch(`/api/community/${publicKey}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          emails
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Invitations Sent",
          description: `Successfully sent ${data.invitationCount} invitations.`,
        })

        // Reset form
        setSelectedUsers([])
        setEmailInvites('')

        // Refresh invitations list
        fetchInvitations()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to send invitations.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error sending invites:', error)
      toast({
        title: "Error",
        description: "Failed to send invitations.",
        variant: "destructive"
      })
    } finally {
      setSendingInvites(false)
    }
  }

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/community/${slug}/${publicKey}/join`
    try {
      await navigator.clipboard.writeText(inviteLink)
      toast({
        title: "Link Copied",
        description: "Invite link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive"
      })
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invite Members</h1>
                <p className="text-gray-600">Invite new members to {community.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Invite Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Users */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                    Search Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        searchUsers(e.target.value)
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border rounded-lg">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              {user.avatar && user.avatar.startsWith('http') ? (
                                <Image
                                  src={user.avatar}
                                  alt={user.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {user.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <UserPlus className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      Selected Users ({selectedUsers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                          <span className="text-sm font-medium">{user.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserRemove(user.id)}
                            className="h-4 w-4 p-0 hover:bg-red-100"
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email Invites */}
              <Card className="bg-white border-2 border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    Invite by Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emails">Email Addresses</Label>
                    <Input
                      id="emails"
                      placeholder="Enter email addresses separated by commas..."
                      value={emailInvites}
                      onChange={(e) => setEmailInvites(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Separate multiple emails with commas (e.g., user1@example.com, user2@example.com)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Send Invites */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSendInvites}
                  disabled={sendingInvites || (selectedUsers.length === 0 && !emailInvites.trim())}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3"
                >
                  {sendingInvites ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending Invites...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Invitations
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Invite Link */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Copy className="h-4 w-4 text-white" />
                    </div>
                    Invite Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Share this link with people you want to invite to your community.
                  </p>
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Invite Link
                  </Button>
                </CardContent>
              </Card>

              {/* Pending Invitations */}
              {invitations.length > 0 && (
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      Pending Invites ({invitations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invitations.slice(0, 5).map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{invitation.email}</p>
                            <p className="text-xs text-gray-500">
                              Sent {new Date(invitation.invitedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={invitation.status === 'PENDING' ? 'secondary' : 'default'}
                            className={
                              invitation.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                              invitation.status === 'DECLINED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {invitation.status.toLowerCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}