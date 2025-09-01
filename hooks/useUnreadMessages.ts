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
    fetchUnreadCount()

    // Set up polling every 30 seconds to check for new messages
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [session?.user?.id])

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount
  }
}