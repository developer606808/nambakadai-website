import { Shield, Lock, Eye, FileText } from "lucide-react"
import { MainLayout } from "@/components/main-layout"
import MetaTags from "@/components/seo/meta-tags"

export const metadata = {
  title: "Privacy Policy | Nanbakadai Farm Marketplace",
  description:
    "Learn how Nanbakadai protects your privacy and handles your personal information. Read our comprehensive privacy policy.",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="Learn how Nanbakadai protects your privacy and handles your personal information. Read our comprehensive privacy policy."
        keywords="privacy, policy, data protection, personal information, Nanbakadai"
      />
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Shield className="h-16 w-16 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-xl mb-4">Last updated: May 15, 2024</p>
                <p className="text-lg opacity-90">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your data.
                </p>
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
                    <Lock className="h-6 w-6 mr-2 text-green-600" />
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At Nanbakadai ("we," "our," or "us"), we respect your privacy and are committed to protecting your
                    personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                    information when you visit our website or use our services.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy
                    Policy, please do not access the site or use our services.
                  </p>
                </div>

                {/* Information We Collect */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                      <p className="text-gray-700 mb-2">
                        We may collect personal information that you voluntarily provide to us when you:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Register for an account</li>
                        <li>Post listings or make purchases</li>
                        <li>Contact our customer support</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Participate in surveys or promotions</li>
                      </ul>
                      <p className="text-gray-700 mt-2">This information may include:</p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Name, email address, and phone number</li>
                        <li>Billing and shipping address</li>
                        <li>Payment information</li>
                        <li>Profile information and preferences</li>
                        <li>Communication history with us</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        2.2 Automatically Collected Information
                      </h3>
                      <p className="text-gray-700 mb-2">
                        When you visit our website, we may automatically collect certain information about your device
                        and usage, including:
                      </p>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>IP address and device identifiers</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring website or source</li>
                        <li>Location information</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Cookies and Similar Technologies</h3>
                      <p className="text-gray-700">
                        We use cookies, web beacons, and similar tracking technologies to collect information about your
                        browsing activities. These technologies help us analyze website traffic, customize content, and
                        improve your experience. You can control cookies through your browser settings, but disabling
                        them may limit some features of our website.
                      </p>
                    </div>
                  </div>
                </div>

                {/* How We Use Your Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Eye className="h-6 w-6 mr-2 text-green-600" />
                    3. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may use the information we collect for various purposes, including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Providing Services</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Creating and managing your account</li>
                        <li>Processing transactions</li>
                        <li>Facilitating communication between buyers and sellers</li>
                        <li>Delivering products or services</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Improving Our Services</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Analyzing usage patterns</li>
                        <li>Developing new features</li>
                        <li>Troubleshooting issues</li>
                        <li>Conducting research and analysis</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Sending transactional emails</li>
                        <li>Providing customer support</li>
                        <li>Sending marketing communications (with consent)</li>
                        <li>Responding to inquiries</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Security and Compliance</h3>
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Protecting against fraud and unauthorized access</li>
                        <li>Enforcing our terms and policies</li>
                        <li>Complying with legal obligations</li>
                        <li>Resolving disputes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Information Sharing */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>
                      <strong>With Other Users:</strong> When you post listings or interact with other users, certain
                      information may be visible to them, such as your username, profile picture, and communication
                      history.
                    </li>
                    <li>
                      <strong>Service Providers:</strong> We may share information with third-party vendors,
                      consultants, and other service providers who perform services on our behalf, such as payment
                      processing, data analysis, email delivery, hosting, and customer service.
                    </li>
                    <li>
                      <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all
                      or a portion of our assets, your information may be transferred as part of that transaction.
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law
                      or in response to valid requests by public authorities (e.g., a court or government agency).
                    </li>
                    <li>
                      <strong>Protection of Rights:</strong> We may disclose information to protect the safety, rights,
                      or property of Nanbakadai, our users, or others, and to investigate fraud or respond to a
                      government request.
                    </li>
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <p className="text-yellow-800">
                      <strong>Note:</strong> We do not sell your personal information to third parties for their
                      marketing purposes without your explicit consent.
                    </p>
                  </div>
                </div>

                {/* Data Security */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                  <p className="text-gray-700 mb-4">
                    We implement appropriate technical and organizational measures to protect the security of your
                    personal information. However, please be aware that no method of transmission over the Internet or
                    electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                  <p className="text-gray-700">
                    We take steps to ensure that your information is treated securely and in accordance with this
                    Privacy Policy. These measures include:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                    <li>Encrypting sensitive information using SSL technology</li>
                    <li>Regularly reviewing our information collection, storage, and processing practices</li>
                    <li>Restricting access to personal information to authorized personnel</li>
                    <li>Maintaining physical, electronic, and procedural safeguards</li>
                  </ul>
                </div>

                {/* Your Rights */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                  <p className="text-gray-700 mb-4">
                    Depending on your location, you may have certain rights regarding your personal information. These
                    may include:
                  </p>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Access and Portability</h3>
                        <p className="text-gray-700">
                          You can request a copy of your personal information that we hold.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Correction</h3>
                        <p className="text-gray-700">
                          You can request that we correct inaccurate or incomplete information.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Deletion</h3>
                        <p className="text-gray-700">
                          You can request that we delete your personal information in certain circumstances.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Restriction and Objection</h3>
                        <p className="text-gray-700">
                          You can request that we restrict processing of your data or object to processing.
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">5</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Consent Withdrawal</h3>
                        <p className="text-gray-700">
                          You can withdraw consent for data processing where consent is the basis for processing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">
                    To exercise these rights, please contact us using the information provided in the "Contact Us"
                    section below. We will respond to your request within a reasonable timeframe.
                  </p>
                </div>

                {/* Children's Privacy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
                  <p className="text-gray-700">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect
                    personal information from children. If you are a parent or guardian and believe that your child has
                    provided us with personal information, please contact us, and we will take steps to delete such
                    information.
                  </p>
                </div>

                {/* Changes to Privacy Policy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                    operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                    new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this
                    Privacy Policy periodically for any changes.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
                    please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong> privacy@nanbakadai.com
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
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Last updated: May 15, 2024</span>
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
