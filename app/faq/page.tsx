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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">Find answers to common questions about using Nanbakadai</p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-gray-900"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </section>

          {/* FAQ Content */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredFAQ.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                        <h2 className="text-2xl font-bold">{category.category}</h2>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {category.questions.map((faq, questionIndex) => {
                          const itemId = `${categoryIndex}-${questionIndex}`
                          const isOpen = openItems.includes(itemId)

                          return (
                            <div key={questionIndex} className="transition-all duration-200">
                              <button
                                onClick={() => toggleItem(itemId)}
                                className="w-full text-left p-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                                  {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                  )}
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-6 animate-fadeIn">
                                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
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

          {/* Contact Support Section */}
          <section className="bg-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-500 hover:bg-green-600" asChild>
                  <a href="/contact" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us: +1 (555) 123-4567
                </Button>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}
