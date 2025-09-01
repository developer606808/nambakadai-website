import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { requestPermissionAndGetToken, onMessageListener } from '@/lib/firebase'

export const useFirebase = () => {
  const { data: session } = useSession()
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [notification, setNotification] = useState<any>(null)

  // Request permission and get FCM token
  const initializeFirebase = async () => {
    try {
      console.log('🔥 Initializing Firebase...')
      const token = await requestPermissionAndGetToken()

      if (token) {
        console.log('✅ FCM token obtained successfully')
        setFcmToken(token)

        // Send token to server if user is logged in
        if (session?.user?.id) {
          console.log('📤 Sending FCM token to server...')
          await updateFcmToken(token)
        }
      } else {
        console.log('❌ Failed to obtain FCM token')
      }
    } catch (error) {
      console.error('❌ Error initializing Firebase:', error)

      // Try fallback initialization without service worker
      try {
        console.log('🔄 Attempting fallback Firebase initialization...')
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          // Import messaging dynamically to avoid issues
          const { getToken } = await import('firebase/messaging')
          const { messaging } = await import('@/lib/firebase')

          if (messaging) {
            const { getToken } = await import('firebase/messaging')
            const token = await getToken(messaging as any, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            })

            if (token) {
              console.log('✅ Fallback FCM token obtained')
              setFcmToken(token)

              if (session?.user?.id) {
                await updateFcmToken(token)
              }
            }
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback Firebase initialization also failed:', fallbackError)
      }
    }
  }

  // Update FCM token on server
  const updateFcmToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/update-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: token }),
      })

      if (response.ok) {
        console.log('FCM token updated successfully')
      } else {
        console.error('Failed to update FCM token')
      }
    } catch (error) {
      console.error('Error updating FCM token:', error)
    }
  }

  // Listen for messages
  const listenForMessages = () => {
    onMessageListener()
      .then((payload: any) => {
        setNotification(payload)
        console.log('Received foreground message:', payload)

        // You can show a toast notification here
        // For example: toast.show(payload.notification.title, payload.notification.body)
      })
      .catch((error) => {
        console.error('Error listening for messages:', error)
      })
  }

  // Initialize Firebase when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeFirebase()
      listenForMessages()
    }
  }, [])

  // Update token when user logs in
  useEffect(() => {
    if (session?.user?.id && fcmToken) {
      updateFcmToken(fcmToken)
    }
  }, [session?.user?.id, fcmToken])

  return {
    fcmToken,
    notification,
    initializeFirebase,
    updateFcmToken
  }
}