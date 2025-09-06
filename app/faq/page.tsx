"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/main-layout"
import MetaTags from "@/components/seo/meta-tags"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account on Nanbakadai?",
        answer:
          'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Fill in your details including name, email, password, and select whether you want to buy or sell products. Verify your email address to complete the registration process.',
      },
      {
        question: "Is Nanbakadai free to use?",
        answer:
          "Yes, creating an account and browsing ads on Nanbakadai is completely free. We may charge a small fee for premium features like featured listings or promotional boosts for your ads.",
      },
      {
        question: "What types of products can I find on Nanbakadai?",
        answer:
          "Nanbakadai specializes in farm-to-table products including fresh fruits, vegetables, organic produce, dairy products, grains, seeds, farming equipment, and handmade items from local farmers and artisans.",
      },
    ],
  },
  {
    category: "Posting Ads",
    questions: [
      {
        question: "How do I post an ad?",
        answer:
          'After creating a seller account, go to your dashboard and click "Post New Ad". Fill in the product details, upload high-quality photos, set your price, and publish your listing. Your ad will be reviewed and go live within 24 hours.',
      },
      {
        question: "How many photos can I upload for my ad?",
        answer:
          "You can upload up to 10 high-quality photos for each ad. We recommend using clear, well-lit images that showcase your product from different angles to attract more buyers.",
      },
      {
        question: "Can I edit my ad after posting?",
        answer:
          "Yes, you can edit your ads anytime from your seller dashboard. You can update the description, price, photos, and availability status. Changes will be reflected immediately on the platform.",
      },
      {
        question: "How long do ads stay active?",
        answer:
          "Regular ads stay active for 30 days. You can renew your ads for free before they expire. Featured ads have different durations based on the package you choose.",
      },
    ],
  },
  {
    category: "Buying & Communication",
    questions: [
      {
        question: "How do I contact a seller?",
        answer:
          'Click on any product listing and use the "Contact Seller" button to send a direct message. You can also call them if they have provided a phone number in their listing.',
      },
      {
        question: "Is there a rating system for sellers?",
        answer:
          "Yes, buyers can rate and review sellers after completing a transaction. This helps build trust in our community and helps other buyers make informed decisions.",
      },
      {
        question: "How do I report a suspicious ad or seller?",
        answer:
          'If you encounter any suspicious activity, click the "Report" button on the listing or contact our support team immediately. We take safety seriously and investigate all reports promptly.',
      },
    ],
  },
  {
    category: "Safety & Security",
    questions: [
      {
        question: "How do I stay safe when meeting sellers?",
        answer:
          "Always meet in public places during daylight hours. Bring a friend if possible. Inspect products thoroughly before making payment. Never share personal financial information online.",
      },
      {
        question: "What payment methods are recommended?",
        answer:
          "We recommend cash payments for local transactions. For online payments, use secure methods and never transfer money before seeing the product. Avoid wire transfers or cryptocurrency payments.",
      },
      {
        question: "How does Nanbakadai verify sellers?",
        answer:
          "We verify sellers through email confirmation, phone verification, and document verification for business accounts. Verified sellers get a special badge on their profiles.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I forgot my password. How can I reset it?",
        answer:
          'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
      },
      {
        question: "Why can't I upload photos to my ad?",
        answer:
          "Make sure your photos are in JPG, PNG, or WebP format and under 5MB each. Clear your browser cache and try again. If the problem persists, contact our technical support team.",
      },
      {
        question: "The website is loading slowly. What should I do?",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. Check your internet connection. If the issue continues, it might be temporary server maintenance.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <>
      <MetaTags
        title="Frequently Asked Questions"
        description="Find answers to common questions about Nanbakadai - the farm-to-table classified ads marketplace. Get help with posting ads, buying products, and using our platform."
        keywords="FAQ, help, support, Nanbakadai, classified ads, farm products, questions, answers"
      />
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Nature-inspired floating elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full animate-float-slow"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300/15 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/10 rounded-full animate-float-fast"></div>
            <div className="absolute top-1/3 right-10 w-28 h-28 bg-green-300/20 rounded-full animate-float-slow"></div>
            <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-emerald-200/15 rounded-full animate-float-medium"></div>

            {/* Leaf patterns */}
            <div className="absolute top-16 left-1/3 text-green-300/30 text-6xl animate-sway">🌿</div>
            <div className="absolute top-32 right-1/4 text-emerald-400/25 text-5xl animate-sway-delayed">🍃</div>
            <div className="absolute bottom-40 left-16 text-teal-300/20 text-7xl animate-sway">🌱</div>
            <div className="absolute bottom-16 right-16 text-green-400/30 text-4xl animate-sway-delayed">🌾</div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-100/5 to-emerald-100/10"></div>
          </div>

          {/* Hero Section */}
          <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-8 shadow-lg">
                <MessageCircle className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Find answers to common questions about using Nanbakadai
              </p>

              {/* Enhanced Search Bar */}
              <div className="max-w-lg mx-auto relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 text-gray-900 text-lg border-2 border-white/50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg focus:border-green-400 focus:ring-4 focus:ring-green-100"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" />
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced FAQ Content */}
          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">No results found</h3>
                  <p className="text-gray-500 text-lg">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredFAQ.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-white/20 text-3xl">❓</div>
                        <h2 className="text-2xl sm:text-3xl font-bold relative z-10">{category.category}</h2>
                        <p className="text-white/80 mt-2 text-sm sm:text-base">Find answers to common questions</p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {category.questions.map((faq, questionIndex) => {
                          const itemId = `${categoryIndex}-${questionIndex}`
                          const isOpen = openItems.includes(itemId)

                          return (
                            <div key={questionIndex} className="transition-all duration-300">
                              <button
                                onClick={() => toggleItem(itemId)}
                                className="w-full text-left p-6 sm:p-8 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 focus:outline-none focus:bg-gradient-to-r focus:from-green-50/50 focus:to-emerald-50/50 transition-all duration-300 group"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pr-4 group-hover:text-green-700 transition-colors leading-tight">
                                    {faq.question}
                                  </h3>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isOpen
                                      ? 'bg-green-100 text-green-600 rotate-180'
                                      : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'
                                  }`}>
                                    {isOpen ? (
                                      <ChevronUp className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                  </div>
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-fadeIn">
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Enhanced Contact Support Section */}
          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <MessageCircle className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Still have questions?</h2>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Can&apos;t find the answer you&apos;re looking for? Our support team is here to help you with any questions about Nanbakadai.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
                    <a href="/contact" className="flex items-center">
                      <Mail className="h-5 w-5 mr-3" />
                      <span className="font-medium">Contact Support</span>
                    </a>
                  </Button>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold backdrop-blur-sm">
                    <Phone className="h-5 w-5 mr-3" />
                    <span className="font-medium">Call Us: +1 (555) 123-4567</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}
