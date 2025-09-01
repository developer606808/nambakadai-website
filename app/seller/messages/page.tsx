"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Reply, 
  Archive, 
  Star,
  MessageSquare,
  Clock,
  User,
  Send,
  Paperclip,
  Phone,
  Video
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
  }
  lastMessage: {
    content: string
    createdAt: string
    senderName: string
    isFromMe: boolean
  } | null
  unreadCount: number
  updatedAt: string
}

interface Message {
  id: number
  content: string
  createdAt: string
  sender: {
    id: number
    name: string
    avatar?: string
  }
  receiver: {
    id: number
    name: string
    avatar?: string
  }
  isRead: boolean
}

export default function SellerMessages() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user) {
      fetchConversations()

      // Set up polling for real-time updates
      const conversationsInterval = setInterval(fetchConversations, 10000) // Poll every 10 seconds

      return () => clearInterval(conversationsInterval)
    }
  }, [session])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)

      // Set up polling for messages when conversation is selected
      const messagesInterval = setInterval(() => {
        fetchMessages(selectedConversation)
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(messagesInterval)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat')

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()

      // Transform MongoDB chat data to match the existing interface
      const transformedConversations = await Promise.all(
        data.chats.map(async (chat: any) => {
          // Fetch customer data from PostgreSQL
          let customerName = "Customer"
          let customerAvatar = ""

          try {
            const userResponse = await fetch(`/api/users/${chat.customerId}`)
            if (userResponse.ok) {
              const userData = await userResponse.json()
              customerName = userData.name || "Customer"
              customerAvatar = userData.avatar || ""
            }
          } catch (error) {
            console.error('Error fetching customer data:', error)
          }

          return {
            id: chat.id,
            participant: {
              id: chat.customerId,
              name: customerName,
              avatar: customerAvatar
            },
            lastMessage: chat.lastMessage ? {
              content: chat.lastMessage.content,
              createdAt: chat.lastMessage.timestamp,
              senderName: chat.lastMessage.senderId === session?.user?.id ? "You" : customerName,
              isFromMe: chat.lastMessage.senderId === session?.user?.id
            } : null,
            unreadCount: (chat.unreadCount && session?.user?.id) ? (chat.unreadCount[session.user.id] || 0) : 0,
            updatedAt: chat.updatedAt
          }
        })
      )

      setConversations(transformedConversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/${conversationId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()

      // Transform MongoDB message data to match existing interface
      const transformedMessages = await Promise.all(
        data.messages.map(async (msg: any) => {
          // Fetch sender and receiver names
          let senderName = msg.senderId === session?.user?.id ? "You" : "Customer"
          let receiverName = msg.receiverId === session?.user?.id ? "You" : "Customer"
          let senderAvatar = ""
          let receiverAvatar = ""

          // Fetch sender data if not current user
          if (msg.senderId !== session?.user?.id) {
            try {
              const senderResponse = await fetch(`/api/users/${msg.senderId}`)
              if (senderResponse.ok) {
                const senderData = await senderResponse.json()
                senderName = senderData.name || "Customer"
                senderAvatar = senderData.avatar || ""
              }
            } catch (error) {
              console.error('Error fetching sender data:', error)
            }
          }

          // Fetch receiver data if not current user
          if (msg.receiverId !== session?.user?.id) {
            try {
              const receiverResponse = await fetch(`/api/users/${msg.receiverId}`)
              if (receiverResponse.ok) {
                const receiverData = await receiverResponse.json()
                receiverName = receiverData.name || "Customer"
                receiverAvatar = receiverData.avatar || ""
              }
            } catch (error) {
              console.error('Error fetching receiver data:', error)
            }
          }

          return {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            sender: {
              id: msg.senderId,
              name: senderName,
              avatar: senderAvatar
            },
            receiver: {
              id: msg.receiverId,
              name: receiverName,
              avatar: receiverAvatar
            },
            isRead: msg.isRead
          }
        })
      )

      setMessages(transformedMessages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return

    try {
      setSendingMessage(true)

      const response = await fetch(`/api/chat/${selectedConversation}`, {
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

      // Transform the response message to match existing interface
      const transformedMessage = {
        id: data.message.id,
        content: data.message.content,
        createdAt: data.message.createdAt,
        sender: {
          id: data.message.senderId,
          name: data.message.senderId === session?.user?.id ? "You" : "Customer",
          avatar: ""
        },
        receiver: {
          id: data.message.receiverId,
          name: data.message.receiverId === session?.user?.id ? "You" : "Customer",
          avatar: ""
        },
        isRead: data.message.isRead
      }

      // Add the new message to the list
      setMessages(prev => [...prev, transformedMessage])
      setNewMessage("")

      // Update conversations list
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (newMessage.trim()) {
        sendMessage()
      }
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const participantName = conv.participant?.name?.toLowerCase() || ''
    const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || ''
    const searchTermLower = searchTerm.toLowerCase()

    const matchesSearch = participantName.includes(searchTermLower) || lastMessageContent.includes(searchTermLower)
    
    // The 'status' property does not exist on the Conversation type, so filtering by it has been removed.
    // If you wish to re-add this, you'll need to update the Conversation interface and ensure the API provides this data.
    // const matchesFilter = filterStatus === "all" || conv.status === filterStatus;
    
    return matchesSearch;
  });

  const handleSendMessage = () => {
    sendMessage()
  }

  // Keep userId as string to match API response format
  const userId = session?.user?.id || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communicate with your customers and manage inquiries
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="outline" className="text-blue-700 border-blue-200">
            {conversations.reduce((count, c) => count + (c.unreadCount > 0 ? 1 : 0), 0)} Unread
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold">{conversations.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-red-600">
                  {conversations.reduce((count, c) => count + c.unreadCount, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>
                    Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-l-4 ${
                    selectedConversation === conversation.id
                      ? 'border-l-blue-500 bg-blue-50 shadow-sm'
                      : 'border-l-transparent hover:border-l-gray-300'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {conversation.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm truncate ${
                          selectedConversation === conversation.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {conversation.participant.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage?.isFromMe ? 'You: ' : ''}
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.participant.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {conversations.find(c => c.id === selectedConversation)?.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.participant.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">Active now</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-gray-700">
                          <Archive className="w-4 h-4 mr-2" />
                          Archive Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700">
                          <Star className="w-4 h-4 mr-2" />
                          Mark as Important
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <User className="w-4 h-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div
                  ref={messagesContainerRef}
                  className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-500 mb-2">
                          No messages yet
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Start the conversation by sending a message
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isFromMe = message.sender.id.toString() === userId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isFromMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                isFromMe
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 text-gray-700'
                              }`}>
                                {isFromMe ? 'You' : message.sender.name.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Message Bubble */}
                            <div
                              className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md shadow-sm ${
                                isFromMe
                                  ? 'bg-blue-500 text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm break-words">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isFromMe ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="border-t bg-gray-50 p-4">
                  <div className="flex items-end space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 min-h-[44px]"
                        rows={1}
                        style={{ height: 'auto', minHeight: '44px' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                        }}
                      />
                      {newMessage.trim() && (
                        <Button
                          onClick={handleSendMessage}
                          size="sm"
                          disabled={sendingMessage}
                          className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
                        >
                          {sendingMessage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    {sendingMessage && <span className="text-blue-500">Sending...</span>}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a conversation from the list on the left to start messaging with your customers
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time messaging</span>
                  </div>
                  <span>•</span>
                  <span>Push notifications</span>
                  <span>•</span>
                  <span>Instant responses</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
