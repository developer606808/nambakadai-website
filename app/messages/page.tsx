"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/main-layout"
import {
  Search,
  Send,
  MessageSquare,
  Clock,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Chat {
  id: string
  storeId: string
  customerId: string
  storeOwnerId: string
  participants: string[]
  lastMessage: {
    content: string
    senderId: string
    timestamp: string
    messageType: string
  } | null
  unreadCount: number
  updatedAt: string
  storeName?: string
  storeLogo?: string
  storeSlug?: string
  storePublicKey?: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  messageType: string
  isRead: boolean
  readAt?: string
  attachments?: string[]
  metadata?: any
  createdAt: string
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user) {
      fetchChats()
    }
  }, [session])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchStoreData = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}`)
      if (response.ok) {
        const storeData = await response.json()
        return {
          name: storeData.name,
          logo: storeData.logo,
          slug: storeData.slug,
          publicKey: storeData.publicKey
        }
      }
    } catch (error) {
      console.error('Error fetching store data:', error)
    }
    return null
  }

  const fetchChats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat')

      if (!response.ok) {
        throw new Error('Failed to fetch chats')
      }

      const data = await response.json()
      const chatsData = data.chats || []

      // Fetch store data for each chat
      const chatsWithStoreData = await Promise.all(
        chatsData.map(async (chat: Chat) => {
          const storeData = await fetchStoreData(chat.storeId)
          return {
            ...chat,
            storeName: storeData?.name || 'Unknown Store',
            storeLogo: storeData?.logo || '',
            storeSlug: storeData?.slug || '',
            storePublicKey: storeData?.publicKey || ''
          }
        })
      )

      setChats(chatsWithStoreData)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch messages (${response.status})`)
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      // You could show a toast notification here instead of just logging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Error loading messages: ${errorMessage}`)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return

    try {
      setSendingMessage(true)
      const response = await fetch(`/api/chat/${selectedChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add the new message to the list
      setMessages(prev => [...prev, data.message])
      setNewMessage("")

      // Update chats list
      fetchChats()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredChats = chats.filter(chat => {
    // For now, just return all chats - you can add search functionality later
    return true
  })

  const selectedChatData = chats.find(c => c.id === selectedChat)

  if (!session?.user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
            <p className="text-gray-600 mb-6">Please log in to view your messages</p>
            <Link href="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chats List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Badge variant="secondary">
                  {chats.reduce((count, c) => count + c.unreadCount, 0)} unread
                </Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading conversations...</p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No conversations yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start chatting with stores to see your conversations here</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                        selectedChat === chat.id
                          ? 'border-l-blue-500 bg-blue-50'
                          : 'border-l-transparent'
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={chat.storeLogo} />
                          <AvatarFallback>
                            {chat.storeName?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">
                              {chat.storeName || 'Store Chat'}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {chat.unreadCount > 0 && (
                                <Badge variant="default">{chat.unreadCount}</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage?.content || "No messages yet"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChatData?.storeLogo} />
                        <AvatarFallback>
                          {selectedChatData?.storeName?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {selectedChatData?.storeName || 'Store Chat'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {selectedChatData?.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            if (selectedChatData?.storeSlug && selectedChatData?.storePublicKey) {
                              window.open(`/stores/${selectedChatData.storeSlug}/${selectedChatData.storePublicKey}`, '_blank')
                            } else {
                              // Fallback to search if we don't have the proper URL
                              window.open(`/stores?search=${selectedChatData?.storeName}`, '_blank')
                            }
                          }}
                        >
                          View Store
                        </DropdownMenuItem>
                        <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === session.user.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === session.user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={sendingMessage}
                      />
                      <Button
                        onClick={sendMessage}
                        size="sm"
                        disabled={!newMessage.trim() || sendingMessage}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}