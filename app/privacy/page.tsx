import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CollegeTracker</span>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: January 30, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Use our services to track your college application progress</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter or communications</li>
            </ul>

            <h3>Personal Information</h3>
            <p>This may include:</p>
            <ul>
              <li>Name and email address</li>
              <li>Academic information (GPA, test scores, courses)</li>
              <li>Extracurricular activities and achievements</li>
              <li>College application information</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We may automatically collect certain information about your device and usage, including:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties except as
              described in this policy:
            </p>

            <h3>Service Providers</h3>
            <p>
              We may share your information with third-party service providers who perform services on our behalf, such
              as hosting, data analysis, customer service, and email delivery.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests by public
              authorities.
            </p>

            <h3>Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the
              purposes outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2>6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your personal information</li>
            </ul>

            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and use personal information about you. You
              can control cookies through your browser settings, but disabling cookies may affect the functionality of
              our service.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal
              information from children under 13. If we become aware that we have collected personal information from a
              child under 13, we will take steps to delete such information.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We will take
              appropriate measures to ensure that your personal information receives an adequate level of protection.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>Email: privacy@collegetracker.com</li>
              <li>Address: CollegeTracker, 123 Education St, Learning City, LC 12345</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
