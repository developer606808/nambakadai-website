"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth/auth-context"
import StarRating from "@/components/reviews/star-rating"

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewSubmitted?: (review: any) => void
}

export default function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { user, isAuthenticated } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError("Please log in to submit a review")
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to submit the review
      // Mock submission for demo purposes
      const newReview = {
        id: `review-${Math.random().toString(36).substr(2, 9)}`,
        productId,
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.avatar,
        rating,
        comment,
        date: new Date().toISOString(),
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Review submitted successfully!")
      setRating(0)
      setComment("")

      if (onReviewSubmitted) {
        onReviewSubmitted(newReview)
      }
    } catch (err) {
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border text-center">
        <p className="text-gray-600 mb-2">Please log in to leave a review</p>
        <Button className="bg-green-500 hover:bg-green-600" asChild>
          <a href="/login">Log In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Write a Review for {productName}</h3>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} editable />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  )
}
