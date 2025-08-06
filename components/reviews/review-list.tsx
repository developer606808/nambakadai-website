import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import StarRating from "@/components/reviews/star-rating"

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
}

interface ReviewListProps {
  reviews: Review[]
  isLoading?: boolean
}

export default function ReviewList({ reviews, isLoading = false }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border text-center">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center mb-3">
            <div className="relative w-10 h-10 mr-3">
              <Image
                src={review.userAvatar || "/placeholder.svg?height=40&width=40"}
                alt={review.userName}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{review.userName}</h4>
              <div className="flex items-center mt-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="ml-2 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
