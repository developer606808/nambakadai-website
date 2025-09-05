import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Heart,
  Users,
  Award,
  Leaf,
  Shield,
  Star,
  ArrowRight,
  Globe,
  TrendingUp
} from "lucide-react"

export default function AboutPage() {
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "500+", label: "Local Farmers", icon: Heart },
    { number: "50K+", label: "Products Listed", icon: Leaf },
    { number: "98%", label: "Satisfaction Rate", icon: Star },
  ]

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We ensure every transaction is secure and transparent, building lasting relationships between farmers and customers."
    },
    {
      icon: Leaf,
      title: "Sustainable Farming",
      description: "We promote sustainable agricultural practices and support eco-friendly farming methods across our platform."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Our platform is built for the farming community, supporting local economies and traditional farming practices."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We maintain high standards for all products listed on our platform, ensuring quality and authenticity."
    }
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/placeholder.svg",
      bio: "Former agricultural officer with 15+ years of experience in sustainable farming."
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/placeholder.svg",
      bio: "Expert in supply chain management and farmer empowerment programs."
    },
    {
      name: "Arun Patel",
      role: "Technology Lead",
      image: "/placeholder.svg",
      bio: "Tech innovator focused on bridging traditional farming with modern technology."
    }
  ]

  return (
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
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-8 shadow-lg">
              <Heart className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              About Nanbakadai
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Connecting farmers, sellers, and customers through a trusted marketplace that celebrates
              sustainable agriculture and supports local communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Nanbakadai was born from a simple vision: to create a platform that bridges the gap between
                    traditional farmers and modern consumers, ensuring fair prices and direct connections.
                  </p>
                  <p>
                    Founded in 2023, we've grown from a small local marketplace to a comprehensive platform
                    serving thousands of farmers and customers across the region. Our commitment to sustainable
                    agriculture and community support drives everything we do.
                  </p>
                  <p>
                    We believe in the power of direct farmer-to-consumer relationships, which is why we've built
                    a platform that prioritizes transparency, quality, and fair trade practices.
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Learn More About Us
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Local Focus</h3>
                      <p className="text-sm text-gray-600">Supporting regional farmers and communities</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Growing Together</h3>
                      <p className="text-sm text-gray-600">Building sustainable agricultural ecosystems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide our mission and shape our platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Passionate individuals dedicated to revolutionizing agricultural commerce
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Be part of the agricultural revolution. Connect with farmers, discover fresh products, and support sustainable farming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
