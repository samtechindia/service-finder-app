import React from "react";

const sections = [
  { id: "info", title: "1. Information We Collect" },
  { id: "usage", title: "2. How We Use Your Information" },
  { id: "sharing", title: "3. Sharing of Information" },
  { id: "security", title: "4. Data Security" },
  { id: "retention", title: "5. Data Retention" },
  { id: "rights", title: "6. User Rights" },
  { id: "cookies", title: "7. Cookies and Tracking Technologies" },
  { id: "thirdparty", title: "8. Third-Party Links" },
  { id: "children", title: "9. Children's Privacy" },
  { id: "changes", title: "10. Changes to This Privacy Policy" },
  { id: "contact", title: "11. Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 text-left">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white shadow-md rounded-xl p-6 text-left">
            <h3 className="font-semibold text-lg mb-4">Contents</h3>

            <ul className="space-y-2 text-sm text-left">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 bg-white shadow-md rounded-xl p-8 md:p-12 text-left">

          {/* Header */}
          <header className="mb-12 text-left">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              Privacy Policy
            </h1>

            <p className="text-gray-500">
              Last Updated: 12 March 2026
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              Welcome to <strong>[Your Company Name]</strong> (“Company”, “we”, “our”, or “us”).
              This Privacy Policy explains how we collect, use, disclose,
              and protect your information when you use our website,
              mobile applications, and services (collectively, the “Platform”).
            </p>

            <p className="mt-4 text-gray-700">
              By accessing or using our Platform, you agree to the practices
              described in this Privacy Policy.
            </p>
          </header>

          {/* Section 1 */}
          <section id="info" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>

            <h3 className="font-medium mb-2">Personal Information</h3>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Address or location information</li>
              <li>Profile photo (optional)</li>
              <li>Payment details (if applicable)</li>
            </ul>

            <h3 className="font-medium mt-6 mb-2">Service Provider Information</h3>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Business name</li>
              <li>Service category</li>
              <li>Government ID or verification documents</li>
              <li>Work location and service areas</li>
              <li>Bank or payout information</li>
              <li>Portfolio, certifications, or experience details</li>
            </ul>

            <h3 className="font-medium mt-6 mb-2">Usage Information</h3>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Pages visited on the Platform</li>
              <li>Date and time of access</li>
              <li>Interaction data (clicks, searches, bookings)</li>
            </ul>

            <h3 className="font-medium mt-6 mb-2">Location Information</h3>

            <p className="text-gray-700">
              We may collect approximate or precise location data to show nearby service providers.
            </p>
          </section>

          {/* Section 2 */}
          <section id="usage" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Creating and managing user accounts</li>
              <li>Connecting customers with local service providers</li>
              <li>Processing bookings and service requests</li>
              <li>Communicating updates, notifications, and support responses</li>
              <li>Improving platform functionality and user experience</li>
              <li>Preventing fraud, abuse, or illegal activities</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sharing" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              3. Sharing of Information
            </h2>

            <h3 className="font-medium mb-2">With Service Providers</h3>

            <p className="text-gray-700">
              Customer information may be shared with service providers
              when a booking or service request is made.
            </p>

            <h3 className="font-medium mt-6 mb-2">With Third-Party Services</h3>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Payment processing</li>
              <li>Analytics services</li>
              <li>Cloud hosting</li>
              <li>Customer support tools</li>
            </ul>

            <p className="mt-4 text-gray-700">
              These third parties only receive the information necessary
              to perform their services.
            </p>

            <h3 className="font-medium mt-6 mb-2">Legal Compliance</h3>

            <p className="text-gray-700">
              We may disclose information if required by law or government request.
            </p>
          </section>

          {/* Section 4 */}
          <section id="security" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              4. Data Security
            </h2>

            <p className="text-gray-700">
              We implement administrative, technical, and physical safeguards
              to protect your personal information from unauthorized access,
              loss, misuse, or disclosure.
            </p>
          </section>

          {/* Section 5 */}
          <section id="retention" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              5. Data Retention
            </h2>

            <p className="text-gray-700">
              We retain personal information only for as long as necessary
              to provide services, fulfill legal obligations, resolve disputes,
              and enforce agreements.
            </p>
          </section>

          {/* Section 6 */}
          <section id="rights" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              6. User Rights
            </h2>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Access their personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of personal data</li>
              <li>Withdraw consent for certain processing activities</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="cookies" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              7. Cookies and Tracking Technologies
            </h2>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Improve user experience</li>
              <li>Remember login sessions</li>
              <li>Analyze platform usage</li>
              <li>Deliver personalized content</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="thirdparty" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              8. Third-Party Links
            </h2>

            <p className="text-gray-700">
              Our platform may contain links to third-party websites.
              We are not responsible for their privacy practices.
            </p>
          </section>

          {/* Section 9 */}
          <section id="children" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              9. Children's Privacy
            </h2>

            <p className="text-gray-700">
              Our services are not intended for individuals under the age of 18.
            </p>
          </section>

          {/* Section 10 */}
          <section id="changes" className="mb-10 text-left">
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to This Privacy Policy
            </h2>

            <p className="text-gray-700">
              We may update this Privacy Policy from time to time.
              Changes will be posted on this page.
            </p>
          </section>

          {/* Section 11 */}
          <section id="contact" className="text-left">
            <h2 className="text-2xl font-semibold mb-4">
              11. Contact Us
            </h2>

            <div className="bg-gray-100 rounded-lg p-6 text-gray-700">
              <p><strong>Company Name:</strong> [Your Company Name]</p>
              <p><strong>Email:</strong> support@yourdomain.com</p>
              <p><strong>Address:</strong> [Company Address]</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}