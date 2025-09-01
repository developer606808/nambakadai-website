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
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <FileText className="h-16 w-16 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
                <p className="text-xl mb-4">Last updated: January 15, 2024</p>
                <p className="text-lg opacity-90">Please read these terms carefully before using Nanbakadai</p>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                {/* Introduction */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-green-600" />
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to Nanbakadai ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use
                    of our classified ads marketplace platform and services. By accessing or using Nanbakadai, you agree
                    to be bound by these Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nanbakadai is a platform that connects buyers and sellers of farm products, organic produce, and
                    related items. We facilitate communication between users but are not directly involved in
                    transactions between buyers and sellers.
                  </p>
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
