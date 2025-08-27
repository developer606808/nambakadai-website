'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, TrendingUp, Calendar, MapPin, Star, ArrowRight, Sprout, Tractor, Leaf, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import MainLayout from '@/components/main-layout'

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
  trending: boolean
}

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCommunities()
  }, [])

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 relative overflow-hidden">
        {/* Floating Background Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-green-200 opacity-20"
            style={{ left: `${item.x}px`, top: `${item.y}px` }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <item.icon size={40} />
          </motion.div>
        ))}

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent mb-4"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Farming Communities
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Connect with fellow farmers, share knowledge, and grow together in our vibrant agricultural communities
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/community/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Community
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search communities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-0 bg-white/50 focus:bg-white transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Organic', 'Rice', 'Vegetables', 'Technology', 'Fruits', 'Sustainability'].map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white/50 text-gray-600 hover:bg-white/80'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: 'Total Communities', value: '150+', icon: Users, color: 'from-blue-500 to-purple-500' },
              { label: 'Active Members', value: '25K+', icon: TrendingUp, color: 'from-green-500 to-blue-500' },
              { label: 'Posts Shared', value: '50K+', icon: Calendar, color: 'from-yellow-500 to-orange-500' },
              { label: 'Countries', value: '30+', icon: MapPin, color: 'from-pink-500 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Communities Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredCommunities.map((community) => (
                <motion.div
                  key={community.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="relative">
                      <div className="h-48 overflow-hidden">
                        <Image
                          src={community.image || "/placeholder.svg"}
                          alt={community.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        {community.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {community.isVerified && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {community.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                          {community.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {community.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {community.memberCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {community.postCount.toLocaleString()} posts
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {community.location}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={() => handleJoinCommunity(community.id)}
                            variant={community.isJoined ? "outline" : "default"}
                            className={`w-full transition-all duration-300 ${
                              community.isJoined 
                                ? 'border-green-500 text-green-600 hover:bg-green-50' 
                                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                            }`}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {community.isJoined ? 'Joined' : 'Join'}
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/community/${community.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCommunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No communities found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or create a new community</p>
              <Button asChild>
                <Link href="/community/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Community
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
