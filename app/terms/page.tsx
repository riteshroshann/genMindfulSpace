import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  By accessing and using MindfulSpace, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>MindfulSpace is a mental wellness platform that provides:</p>
                <ul>
                  <li>AI-powered emotional support and guidance</li>
                  <li>Digital journaling and mood tracking tools</li>
                  <li>Community features for peer support</li>
                  <li>Art therapy and mindfulness exercises</li>
                  <li>Crisis support resources</li>
                </ul>
                <p>
                  <strong>Important:</strong> MindfulSpace is not a substitute for professional mental health care,
                  therapy, or medical treatment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>As a user of MindfulSpace, you agree to:</p>
                <ul>
                  <li>Provide accurate and truthful information</li>
                  <li>Use the service for personal, non-commercial purposes</li>
                  <li>Respect other users and maintain a supportive environment</li>
                  <li>Not share harmful, abusive, or inappropriate content</li>
                  <li>Seek professional help for serious mental health concerns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  <strong>MindfulSpace is not a medical service.</strong> Our AI companion and tools are designed for
                  emotional support and wellness, not medical diagnosis or treatment. Always consult with qualified
                  healthcare professionals for medical advice.
                </p>
                <p>
                  If you are experiencing a mental health emergency, please contact emergency services immediately or
                  visit our Crisis Support page for immediate resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy and Data</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
                  and protect your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  MindfulSpace and its creators shall not be liable for any direct, indirect, incidental, special, or
                  consequential damages resulting from the use or inability to use our service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  For questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@mindfulspace.app" className="text-blue-600 hover:underline">
                    legal@mindfulspace.app
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
