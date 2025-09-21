import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                At MindfulSpace, we understand that your mental health information is deeply personal. We are committed
                to protecting your privacy and ensuring your data is handled with the utmost care and security.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Personal Information</h4>
                <ul>
                  <li>Email address and name (for account creation)</li>
                  <li>Journal entries and mood tracking data</li>
                  <li>Chat conversations with our AI companion</li>
                  <li>Usage patterns and preferences</li>
                </ul>

                <h4>Technical Information</h4>
                <ul>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ul>
                  <li>Provide personalized mental health support</li>
                  <li>Improve our AI companion's responses</li>
                  <li>Track your progress and mood patterns</li>
                  <li>Send important updates about our service</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul>
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Secure cloud storage with regular backups</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data by authorized personnel only</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@mindfulspace.app" className="text-blue-600 hover:underline">
                    privacy@mindfulspace.app
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
