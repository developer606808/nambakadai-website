"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Store, ArrowRight, Sparkles } from "lucide-react"

export function CreateStoreBanner() {
  const { data: session } = useSession()

  // Only show if user is logged in and doesn't have a store
  if (!session?.user || session.user.hasStore) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Store className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Start Your Own Store
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </h3>
              <p className="text-gray-600 mt-1">
                Join thousands of sellers and start selling your products today. 
                Create your store in just a few minutes!
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href="/create-store">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Create Store
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Free to start
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Easy setup process
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Reach local customers
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
