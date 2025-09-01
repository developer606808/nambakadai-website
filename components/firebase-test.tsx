'use client'

import { useState } from 'react'
import { useFirebase } from '@/hooks/useFirebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FirebaseTest() {
  const { fcmToken, notification, initializeFirebase } = useFirebase()
  const [testResult, setTestResult] = useState<string>('')

  const testNotification = async () => {
    try {
      setTestResult('Sending test notification...')

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '1', // Replace with actual user ID for testing
          title: 'Test Notification',
          body: 'This is a test push notification from Nambakadai',
          data: {
            type: 'test',
            url: '/messages'
          }
        }),
      })

      if (response.ok) {
        setTestResult('✅ Test notification sent successfully!')
      } else {
        const error = await response.json()
        setTestResult(`❌ Failed to send notification: ${error.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testTokenUpdate = async () => {
    try {
      setTestResult('Updating FCM token...')

      if (!fcmToken) {
        setTestResult('❌ No FCM token available')
        return
      }

      const response = await fetch('/api/auth/update-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken }),
      })

      if (response.ok) {
        setTestResult('✅ FCM token updated successfully!')
      } else {
        setTestResult('❌ Failed to update FCM token')
      }
    } catch (error) {
      setTestResult(`❌ Error updating token: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">FCM Token Status:</h3>
          <p className="text-sm text-gray-600 break-all">
            {fcmToken ? `✅ ${fcmToken.substring(0, 20)}...` : '❌ No token available'}
          </p>
        </div>

        {notification && (
          <div>
            <h3 className="font-semibold mb-2">Latest Notification:</h3>
            <p className="text-sm text-gray-600">
              {notification.notification?.title}: {notification.notification?.body}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button onClick={initializeFirebase} className="w-full">
            Initialize Firebase
          </Button>

          <Button onClick={testTokenUpdate} className="w-full" disabled={!fcmToken}>
            Test Token Update
          </Button>

          <Button onClick={testNotification} className="w-full">
            Send Test Notification
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p>🔧 Firebase Debug Info:</p>
          <p>• Service Worker: {typeof window !== 'undefined' && 'serviceWorker' in navigator ? '✅ Supported' : '❌ Not supported'}</p>
          <p>• Notifications: {typeof window !== 'undefined' && 'Notification' in window ? '✅ Supported' : '❌ Not supported'}</p>
          <p>• Permission: {typeof window !== 'undefined' ? Notification.permission : 'N/A'}</p>
          <p>• HTTPS: {typeof window !== 'undefined' && window.location.protocol === 'https:' ? '✅ Yes' : '⚠️ No (HTTP - FCM may not work in production)'}</p>
          <p>• Environment: {process.env.NODE_ENV === 'development' ? '🧪 Development' : '🏭 Production'}</p>
          <p>• Firebase Config: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing'}</p>
          <p>• VAPID Key: {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </CardContent>
    </Card>
  )
}