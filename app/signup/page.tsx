import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SignupForm from "@/components/auth/signup-form"
import { MainLayout } from "@/components/main-layout"

export default function SignupPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </div>
    </MainLayout>
  )
}
