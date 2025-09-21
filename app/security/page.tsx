import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from "lucide-react"

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All your personal data is encrypted both in transit and at rest",
      status: "Active",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Multi-factor authentication and secure session management",
      status: "Active",
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime",
      status: "Active",
    },
    {
      icon: Eye,
      title: "Privacy by Design",
      description: "We collect only what's necessary and never sell your data",
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Security & Trust</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your mental health data deserves the highest level of protection
            </p>
          </div>

          <Card className="mb-8 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-800 dark:text-green-400">Your Data is Safe</CardTitle>
              </div>
              <CardDescription>
                We use industry-leading security practices to protect your personal information
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Protection Standards</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ul>
                  <li>
                    <strong>HIPAA Compliance:</strong> We follow healthcare data protection standards
                  </li>
                  <li>
                    <strong>GDPR Compliant:</strong> Full compliance with European privacy regulations
                  </li>
                  <li>
                    <strong>SOC 2 Type II:</strong> Independently audited security controls
                  </li>
                  <li>
                    <strong>Regular Penetration Testing:</strong> Quarterly security assessments
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Protect Your Data</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h4>Technical Safeguards</h4>
                <ul>
                  <li>AES-256 encryption for data at rest</li>
                  <li>TLS 1.3 encryption for data in transit</li>
                  <li>Zero-knowledge architecture where possible</li>
                  <li>Regular automated backups with encryption</li>
                </ul>

                <h4>Access Controls</h4>
                <ul>
                  <li>Role-based access control (RBAC)</li>
                  <li>Multi-factor authentication for all staff</li>
                  <li>Principle of least privilege</li>
                  <li>Regular access reviews and audits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <CardTitle className="text-orange-800 dark:text-orange-400">Report Security Issues</CardTitle>
                </div>
                <CardDescription>
                  If you discover a security vulnerability, please report it responsibly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send security reports to:{" "}
                  <a href="mailto:security@mindfulspace.app" className="text-blue-600 hover:underline">
                    security@mindfulspace.app
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  We take all security reports seriously and will respond within 24 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Response</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  In the unlikely event of a security incident, we have a comprehensive response plan that includes:
                </p>
                <ul>
                  <li>Immediate containment and assessment</li>
                  <li>Notification of affected users within 72 hours</li>
                  <li>Coordination with relevant authorities</li>
                  <li>Post-incident analysis and improvements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
