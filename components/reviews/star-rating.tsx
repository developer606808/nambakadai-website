"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  editable?: boolean
}

export default function StarRating({ rating, onRatingChange, size = "md", editable = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const handleClick = (index: number) => {
    if (editable && onRatingChange) {
      onRatingChange(index)
    }
  }

  const handleMouseEnter = (index: number) => {
    if (editable) {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = hoverRating ? index <= hoverRating : index <= rating

        return (
          <span
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`${editable ? "cursor-pointer" : ""} mr-0.5`}
          >
            <Star className={`${starSizes[size]} ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          </span>
        )
      })}
    </div>
  )
}
