import { Calendar, Shield, Users, FileText } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import MetaTags from "@/components/seo/meta-tags"

export default function TermsPage() {
  return (
    <>
      <MetaTags
        title="Terms and Conditions"
        description="Read the terms and conditions for using Nanbakadai classified ads marketplace. Understand your rights and responsibilities when buying or selling farm products."
        keywords="terms, conditions, legal, policy, Nanbakadai, classified ads, marketplace"
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
                <FileText className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                Terms and Conditions
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-4">Last updated: January 15, 2024</p>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Please read these terms carefully before using Nanbakadai
              </p>
            </div>
          </section>

          {/* Enhanced Content */}
          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-12 space-y-8 hover:shadow-2xl transition-all duration-300">
                {/* Enhanced Introduction */}
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                  <div className="pl-6">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      1. Introduction
                    </h2>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 mb-6">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Welcome to Nanbakadai (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your use
                        of our classified ads marketplace platform and services. By accessing or using Nanbakadai, you agree
                        to be bound by these Terms.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Nanbakadai is a platform that connects buyers and sellers of farm products, organic produce, and
                        related items. We facilitate communication between users but are not directly involved in
                        transactions between buyers and sellers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acceptance of Terms */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By creating an account, posting ads, or using our services, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not
                    use our platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                    posting. Your continued use of the platform after changes constitutes acceptance of the new Terms.
                  </p>
                </div>

                {/* User Accounts */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-6 w-6 mr-2 text-green-600" />
                    3. User Accounts
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Account Creation</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>You must be at least 18 years old to create an account</li>
                        <li>You must provide accurate and complete information</li>
                        <li>You are responsible for maintaining the security of your account</li>
                        <li>One person may only maintain one account</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Account Responsibilities</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Keep your login credentials confidential</li>
                        <li>Notify us immediately of any unauthorized access</li>
                        <li>You are liable for all activities under your account</li>
                        <li>Update your information when it changes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Posting Ads */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Posting Ads and Content</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Content Guidelines</h3>
                      <p className="text-gray-700 mb-2">When posting ads, you agree to:</p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Provide accurate and truthful information</li>
                        <li>Use only your own photos or images you have rights to use</li>
                        <li>Post only items you actually have for sale</li>
                        <li>Set fair and reasonable prices</li>
                        <li>Respond promptly to buyer inquiries</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Prohibited Content</h3>
                      <p className="text-gray-700 mb-2">You may not post:</p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Illegal, harmful, or offensive content</li>
                        <li>Misleading or false information</li>
                        <li>Copyrighted material without permission</li>
                        <li>Spam or duplicate listings</li>
                        <li>Items that violate local laws or regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* User Conduct */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Users must conduct themselves professionally and respectfully. Harassment, fraud, or any illegal
                    activity is strictly prohibited. We reserve the right to suspend or terminate accounts that violate
                    our community standards.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-800">
                      <strong>Important:</strong> Nanbakadai is a platform for classified ads only. We do not process
                      payments, handle shipping, or guarantee transactions between users.
                    </p>
                  </div>
                </div>

                {/* Privacy and Data */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                    information. By using our platform, you consent to our data practices as described in our Privacy
                    Policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We may use your information to improve our services, send important updates, and facilitate
                    communication between buyers and sellers.
                  </p>
                </div>

                {/* Limitation of Liability */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nanbakadai acts as an intermediary platform only. We are not responsible for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                    <li>The quality, safety, or legality of items advertised</li>
                    <li>The accuracy of listings or user information</li>
                    <li>Disputes between buyers and sellers</li>
                    <li>Payment processing or financial transactions</li>
                    <li>Delivery or shipping of items</li>
                  </ul>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-800">
                      <strong>Disclaimer:</strong> Use our platform at your own risk. We recommend meeting in safe,
                      public places and inspecting items before purchase.
                    </p>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Nanbakadai platform, including its design, features, and content, is protected by intellectual
                    property laws. Users retain ownership of their posted content but grant us a license to display it
                    on our platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may not copy, modify, or distribute our platform or its content without written permission.
                  </p>
                </div>

                {/* Termination */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may suspend or terminate your account at any time for violations of these Terms or for any other
                    reason. You may also delete your account at any time through your account settings.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Upon termination, your access to the platform will cease, but these Terms will continue to apply to
                    your past use of the service.
                  </p>
                </div>

                {/* Governing Law */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the
                    courts of [Your Jurisdiction]. If any provision of these Terms is found to be unenforceable, the
                    remaining provisions will continue in effect.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong> legal@nanbakadai.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Farm Street, Agriculture City, AC 12345
                    </p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-center pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Last updated: January 15, 2024</span>
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
