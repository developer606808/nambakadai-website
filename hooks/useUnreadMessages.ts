import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useUnreadMessages() {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchUnreadCount = async () => {
    if (!session?.user?.id) {
      setUnreadCount(0)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/chat/unread')

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.totalUnreadCount || 0)
      } else {
        console.error('Failed to fetch unread count')
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session?.user?.id) {
      setUnreadCount(0)
      return
    }

    // Initial fetch
    fetchUnreadCount()

    // Set up polling every 60 seconds (reduced frequency) and only when user is active
    const interval = setInterval(fetchUnreadCount, 60000)

    // Clear interval on cleanup
    return () => clearInterval(interval)
  }, [session?.user?.id])

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount
  }
}