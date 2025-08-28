import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Store, Shield, DollarSign, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function SellerAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/create-store" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store Creation
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Store className="w-8 h-8 text-green-600" />
              Seller Agreement
            </CardTitle>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Agreement Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Seller Agreement ("Agreement") governs your use of the Nambakadai marketplace platform 
                as a seller. By creating a store and listing products, you agree to be bound by these terms.
              </p>
            </section>

            {/* Seller Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Seller Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Product Quality & Safety</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Ensure all products meet local food safety standards</li>
                    <li>Provide accurate product descriptions and images</li>
                    <li>Maintain proper storage and handling of perishable items</li>
                    <li>Include accurate expiration dates and nutritional information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Customer Service</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Respond to customer inquiries within 24 hours</li>
                    <li>Process orders promptly and accurately</li>
                    <li>Handle returns and refunds according to platform policies</li>
                    <li>Maintain professional communication at all times</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Legal Compliance</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Obtain all necessary licenses and permits</li>
                    <li>Comply with local, state, and federal regulations</li>
                    <li>Pay all applicable taxes and fees</li>
                    <li>Maintain proper business insurance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Fees and Payments */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Fees and Payments
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Commission Structure</h3>
                  <ul className="space-y-1 text-green-800">
                    <li>• Platform commission: 5% of gross sales</li>
                    <li>• Payment processing fee: 2.9% + ₹2 per transaction</li>
                    <li>• No monthly subscription fees</li>
                    <li>• No listing fees for the first 100 products</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Payments are processed weekly on Fridays</li>
                    <li>Minimum payout threshold: ₹500</li>
                    <li>Funds are transferred to your registered bank account</li>
                    <li>Detailed sales reports provided monthly</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Prohibited Activities
              </h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <ul className="space-y-2 text-red-800">
                  <li>• Selling expired or contaminated products</li>
                  <li>• Misrepresenting product origins or quality</li>
                  <li>• Manipulating reviews or ratings</li>
                  <li>• Selling products outside your approved categories</li>
                  <li>• Engaging in price manipulation or unfair practices</li>
                  <li>• Violating intellectual property rights</li>
                </ul>
              </div>
            </section>

            {/* Store Approval Process */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Store Approval Process</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  All new stores undergo a review process before being approved for public listing:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Submit store application with required documentation</li>
                  <li>Verification of business licenses and permits</li>
                  <li>Quality assessment of initial product listings</li>
                  <li>Background check and reference verification</li>
                  <li>Final approval and store activation (typically 3-5 business days)</li>
                </ol>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate this agreement with 30 days written notice. Nambakadai reserves 
                the right to immediately suspend or terminate seller accounts for violations of this agreement, 
                fraudulent activity, or failure to meet quality standards.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Questions?</h2>
              <p className="text-gray-700">
                If you have questions about this Seller Agreement, please contact us at{" "}
                <a href="mailto:sellers@nambakadai.com" className="text-green-600 hover:underline">
                  sellers@nambakadai.com
                </a>{" "}
                or call our seller support line at{" "}
                <a href="tel:+911234567890" className="text-green-600 hover:underline">
                  +91 123 456 7890
                </a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
