import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Post, Community } from '@/types/community'

export function useCommunity() {
  const params = useParams()
  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params?.id) {
      fetchCommunity()
      fetchPosts()
    }
  }, [params?.id])

  const fetchCommunity = async () => {
    if (!params) return
    try {
      const response = await fetch(`/api/community/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        console.log('Community data fetched:', { image: data.image, banner: data.banner });

        // Check if current user is the owner (has ADMIN role in this community)
        const ownerResponse = await fetch('/api/community')
        const ownerData = await ownerResponse.json()
        const isOwner = ownerData.hasCreatedCommunity &&
                       ownerData.community &&
                       (ownerData.community.id === data.id || ownerData.community.uuid === data.uuid)

        setCommunity({
          ...data,
          isJoined: false,
          isFollowing: false,
          isNotificationEnabled: false,
          isOwner: isOwner,
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
    if (!params) return
    try {
      const response = await fetch(`/api/community/${params.id}/posts`)
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.posts.map((post: any) => ({
          ...post,
          isLiked: false,
          isBookmarked: false,
        })))
      } else {
        setError(data.error || 'Failed to fetch posts')
      }
    } catch (err) {
      setError('Failed to fetch posts')
      console.error('Error fetching posts:', err)
    }
  }

  const refreshCommunity = async () => {
    if (!params?.id) return
    try {
      const response = await fetch(`/api/community/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        // Check if current user is the owner (has ADMIN role in this community)
        const ownerResponse = await fetch('/api/community')
        const ownerData = await ownerResponse.json()
        const isOwner = ownerData.hasCreatedCommunity &&
                       ownerData.community &&
                       (ownerData.community.id === data.id || ownerData.community.uuid === data.uuid)

        setCommunity({
          ...data,
          isJoined: community?.isJoined || false,
          isFollowing: community?.isFollowing || false,
          isNotificationEnabled: community?.isNotificationEnabled || false,
          isOwner: isOwner,
        })
      }
    } catch (err) {
      console.error('Error refreshing community:', err)
    }
  }

  return { community, posts, isLoading, error, setCommunity, setPosts, refreshCommunity }
}
