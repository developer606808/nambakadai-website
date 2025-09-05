"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainLayout } from "@/components/main-layout"
import MetaTags from "@/components/seo/meta-tags"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <MetaTags
        title="Contact Us"
        description="Get in touch with Nanbakadai support team. We're here to help with any questions about our classified ads marketplace for farm products."
        keywords="contact, support, help, Nanbakadai, customer service, farm marketplace"
      />
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl max-w-2xl mx-auto">
                We're here to help! Reach out to us with any questions or concerns.
              </p>
            </div>
          </section>

          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <HeadphonesIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Get in Touch</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
                          <p className="text-gray-700 font-medium">support@nanbakadai.com</p>
                          <p className="text-sm text-green-600 font-medium">⚡ Responds within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Phone Support</h3>
                          <p className="text-gray-700 font-medium">+1 (555) 123-4567</p>
                          <p className="text-sm text-blue-600 font-medium">🕒 Mon-Fri, 9 AM - 6 PM EST</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-6 w-6 text-green-600 mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Address</h3>
                          <p className="text-gray-600">
                            123 Farm Street
                            <br />
                            Agriculture City, AC 12345
                            <br />
                            United States
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-6 w-6 text-green-600 mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Business Hours</h3>
                          <div className="text-gray-600 text-sm">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Help */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <HeadphonesIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Quick Help</h3>
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl" asChild>
                        <a href="/faq" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-3" />
                          <span className="font-medium">View FAQ</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl" asChild>
                        <a href="/terms" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-3" />
                          <span className="font-medium">Terms & Conditions</span>
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <Send className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Send us a Message</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing Question</option>
                          <option value="report">Report an Issue</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="mt-1"
                          placeholder="Brief description of your inquiry"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="mt-1"
                          placeholder="Please provide details about your inquiry..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            <span className="font-medium">Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="h-5 w-5 mr-3" />
                            <span className="font-medium">Send Message</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Map Section */}
          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                  <MapPin className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
                  Visit Our Office
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Located in the heart of Agriculture City, we're always happy to meet in person and discuss your farming needs.
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-80 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 to-emerald-100/20"></div>
                    <div className="absolute top-4 right-4 text-green-300/30 text-4xl">🌱</div>
                    <div className="absolute bottom-4 left-4 text-emerald-300/30 text-3xl">🌾</div>

                    <div className="text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <MapPin className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Our Location</h3>
                      <p className="text-gray-600 mb-4">Interactive map integration coming soon</p>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        <p className="text-gray-800 font-medium">123 Farm Street</p>
                        <p className="text-gray-800 font-medium">Agriculture City, AC 12345</p>
                        <p className="text-gray-600 text-sm mt-1">United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  )
}
