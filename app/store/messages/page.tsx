"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import StoreLayout from "@/components/store/store-layout"
import { Search, Send, MoreHorizontal, Clock } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: 1,
    customer: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "sarah@example.com",
    },
    lastMessage: "Hi, do you have organic tomatoes available?",
    timestamp: "2 min ago",
    unread: 2,
    status: "online",
  },
  {
    id: 2,
    customer: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "mike@example.com",
    },
    lastMessage: "Thank you for the quick delivery!",
    timestamp: "1 hour ago",
    unread: 0,
    status: "offline",
  },
  {
    id: 3,
    customer: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "emma@example.com",
    },
    lastMessage: "When will the carrots be back in stock?",
    timestamp: "3 hours ago",
    unread: 1,
    status: "offline",
  },
  {
    id: 4,
    customer: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    lastMessage: "Can I schedule a pickup for tomorrow?",
    timestamp: "1 day ago",
    unread: 0,
    status: "offline",
  },
]

const messages = [
  {
    id: 1,
    sender: "customer",
    message: "Hi, do you have organic tomatoes available?",
    timestamp: "10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    sender: "store",
    message: "Hello! Yes, we have fresh organic tomatoes in stock. They're $4.99/kg.",
    timestamp: "10:32 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    sender: "customer",
    message: "Great! Can I order 2kg for pickup tomorrow?",
    timestamp: "10:35 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    sender: "store",
    message: "I'll prepare 2kg of our best organic tomatoes for you. What time works best for pickup?",
    timestamp: "10:36 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function StoreMessages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <StoreLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with your customers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Badge variant="secondary">{conversations.filter((c) => c.unread > 0).length} unread</Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedConversation.id === conversation.id
                          ? "border-green-500 bg-green-50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <LazyImage
                            src={conversation.customer.avatar}
                            alt={conversation.customer.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              conversation.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">{conversation.customer.name}</p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-green-500 text-white text-xs">{conversation.unread}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <LazyImage
                    src={selectedConversation.customer.avatar}
                    alt={selectedConversation.customer.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.customer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.customer.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Block Customer</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "store" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          message.sender === "store" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <LazyImage
                          src={message.avatar}
                          alt="Avatar"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "store" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "store" ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StoreLayout>
  )
}
