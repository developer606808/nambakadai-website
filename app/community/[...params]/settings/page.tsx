'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Settings,
  Users,
  Shield,
  Trash2,
  Save,
  X,
  Edit3,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Globe,
  Lock,
  Bell,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  category: string
  location: string
  isPrivate: boolean
  allowJoinRequests: boolean
  requireApproval: boolean
  rules?: string
  memberCount: number
  createdAt: string
  owner: {
    id: number
    name: string
    email: string
  }
}

interface Member {
  id: number
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
  joinedAt: string
}

export default function CommunitySettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [slug, publicKey] = (params?.params as string[]) || []

  const [community, setCommunity] = useState<Community | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    rules: ''
  })

  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: false,
    allowJoinRequests: true,
    requireApproval: false
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newMembers: true,
    newPosts: true,
    mentions: true,
    comments: true
  })

  useEffect(() => {
    console.log('Settings page - Status:', status)
    console.log('Settings page - Slug:', slug)
    console.log('Settings page - PublicKey:', publicKey)

    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    if (slug && publicKey) {
      console.log('Fetching community settings...')
      fetchCommunitySettings()
    } else {
      console.log('Missing slug or publicKey')
    }
  }, [slug, publicKey, status, router])

  const fetchCommunitySettings = async () => {
    try {
      console.log('Starting to fetch community settings...')
      setLoading(true)

      // Fetch community details
      console.log('Fetching community data from:', `/api/community/${publicKey}`)
      const communityResponse = await fetch(`/api/community/${publicKey}`)
      console.log('Community API response status:', communityResponse.status)

      if (!communityResponse.ok) {
        if (communityResponse.status === 404) {
          console.log('Community not found')
          toast({
            title: "Community Not Found",
            description: "The community you're looking for doesn't exist.",
            variant: "destructive"
          })
          router.push('/community')
          return
        }
        console.log('Failed to fetch community, status:', communityResponse.status)
        throw new Error('Failed to fetch community')
      }

      const communityData = await communityResponse.json()
      console.log('Community data received:', communityData)

      // Check if user is owner/admin
      console.log('Session user ID:', session?.user?.id)
      console.log('Community owner ID:', communityData.owner?.id)

      if (communityData.owner?.id !== session?.user?.id) {
        console.log('Access denied - user is not owner')
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        })
        router.push(`/community/${slug}/${publicKey}`)
        return
      }

      console.log('Setting community data...')
      setCommunity(communityData)
      setGeneralSettings({
        name: communityData.name,
        description: communityData.description || '',
        category: communityData.category,
        location: communityData.location || '',
        rules: communityData.rules || ''
      })
      setPrivacySettings({
        isPrivate: communityData.isPrivate || false,
        allowJoinRequests: communityData.allowJoinRequests !== false,
        requireApproval: communityData.requireApproval || false
      })

      // Fetch members
      console.log('Fetching members...')
      const membersResponse = await fetch(`/api/community/${publicKey}/members`)
      console.log('Members API response status:', membersResponse.status)

      if (membersResponse.ok) {
        const membersData = await membersResponse.json()
        console.log('Members data received:', membersData)
        setMembers(membersData.members || [])
      } else {
        console.warn('Failed to fetch members, but continuing with settings page')
      }

      console.log('Community settings loaded successfully!')

    } catch (error) {
      console.error('Error fetching community settings:', error)
      toast({
        title: "Error",
        description: "Failed to load community settings.",
        variant: "destructive"
      })
      router.push(`/community/${slug}/${publicKey}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGeneralSettings = async () => {
    if (!community) return

    try {
      setSaving(true)
      const response = await fetch(`/api/community/${community.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalSettings),
      })

      if (response.ok) {
        const updatedCommunity = await response.json()
        setCommunity(updatedCommunity)
        toast({
          title: "Success",
          description: "Community settings updated successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update settings.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacySettings = async () => {
    if (!community) return

    try {
      setSaving(true)
      const response = await fetch(`/api/community/${community.uuid}/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privacySettings),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Privacy settings updated successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update privacy settings.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCommunity = async () => {
    if (!community) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${community.name}"? This action cannot be undone and will permanently remove all posts, members, and data associated with this community.`
    )

    if (!confirmed) return

    try {
      setSaving(true)
      const response = await fetch(`/api/community/${community.uuid}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Community Deleted",
          description: "The community has been permanently deleted.",
        })
        router.push('/community')
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete community.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting community:', error)
      toast({
        title: "Error",
        description: "Failed to delete community.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
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
            <p className="text-gray-600 mb-6">The community you're looking for doesn't exist or you don't have permission to access it.</p>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{community.name}</h1>
                <p className="text-gray-600">Community Settings</p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Danger</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-2 border-green-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Community Name</Label>
                        <Input
                          id="name"
                          value={generalSettings.name}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter community name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={generalSettings.category}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Agriculture, Technology"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={generalSettings.description}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your community..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={generalSettings.location}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Global, India, USA"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rules">Community Rules</Label>
                      <Textarea
                        id="rules"
                        value={generalSettings.rules}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, rules: e.target.value }))}
                        placeholder="Set rules for your community members..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveGeneralSettings}
                        disabled={saving}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Private Community</span>
                          </div>
                          <p className="text-sm text-gray-600">Only approved members can view and join</p>
                        </div>
                        <Switch
                          checked={privacySettings.isPrivate}
                          onCheckedChange={(checked) =>
                            setPrivacySettings(prev => ({ ...prev, isPrivate: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Allow Join Requests</span>
                          </div>
                          <p className="text-sm text-gray-600">Users can request to join your community</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowJoinRequests}
                          onCheckedChange={(checked) =>
                            setPrivacySettings(prev => ({ ...prev, allowJoinRequests: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">Require Approval</span>
                          </div>
                          <p className="text-sm text-gray-600">All posts need moderator approval</p>
                        </div>
                        <Switch
                          checked={privacySettings.requireApproval}
                          onCheckedChange={(checked) =>
                            setPrivacySettings(prev => ({ ...prev, requireApproval: checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePrivacySettings}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Privacy Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Members Management */}
            <TabsContent value="members">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-2 border-purple-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      Member Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              {member.user.avatar && member.user.avatar.startsWith('http') ? (
                                <Image
                                  src={member.user.avatar}
                                  alt={member.user.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {member.user.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">{member.user.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                                  className={
                                    member.role === 'OWNER' ? 'bg-red-100 text-red-800' :
                                    member.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                    member.role === 'MODERATOR' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {member.role.toLowerCase()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {member.role !== 'OWNER' && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Danger Zone */}
            <TabsContent value="danger">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-2 border-red-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-red-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2">Delete Community</h3>
                      <p className="text-red-700 text-sm mb-4">
                        Once you delete this community, there is no going back. This will permanently delete the
                        community, all posts, comments, and remove all members.
                      </p>
                      <Button
                        onClick={handleDeleteCommunity}
                        disabled={saving}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Community
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}