export interface Post {
  id: number
  author: {
    name: string
    avatar: string
    role: string
  }
  content: string
  type: 'text' | 'image' | 'video'
  media?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
}

export interface Community {
  id: number
  uuid: string
  name: string
  description: string
  image: string | null // Profile picture
  banner: string | null // Banner image
  memberCount: number
  postCount: number
  category: string
  isJoined: boolean
  isVerified: boolean
  location: string
  createdAt: string
  isFollowing: boolean
  isNotificationEnabled: boolean
  isOwner?: boolean
  privacy?: string
  rules?: string
}
