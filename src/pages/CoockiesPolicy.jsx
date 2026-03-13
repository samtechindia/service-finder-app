import React from "react";

const sections = [
  { id: "what", title: "1. What Are Cookies" },
  { id: "how", title: "2. How We Use Cookies" },
  { id: "types", title: "3. Types of Cookies We Use" },
  { id: "thirdparty", title: "4. Third-Party Cookies" },
  { id: "manage", title: "5. Managing Cookies" },
  { id: "changes", title: "6. Changes to This Cookie Policy" },
  { id: "contact", title: "7. Contact Us" },
];

export default function CookiePolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 text-left">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 bg-white shadow-md rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Contents</h3>

            <ul className="space-y-2 text-sm">
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
        <main className="lg:col-span-3 bg-white shadow-md rounded-xl p-8 md:p-12">

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              Cookie Policy
            </h1>

            <p className="text-gray-500">
              Last Updated: 12 March 2026
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              This Cookie Policy explains how <strong>[Your Company Name]</strong>
              ("Company", "we", "our", or "us") uses cookies and similar
              technologies when you visit our website and use our services
              (collectively, the “Platform”).
            </p>

            <p className="mt-4 text-gray-700">
              By continuing to browse or use our Platform, you agree to
              the use of cookies as described in this policy.
            </p>
          </header>

          {/* Section 1 */}
          <section id="what" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              1. What Are Cookies
            </h2>

            <p className="text-gray-700">
              Cookies are small text files stored on your device when you
              visit a website. They help websites remember information
              about your visit, such as your preferences and login status,
              to improve your browsing experience.
            </p>
          </section>

          {/* Section 2 */}
          <section id="how" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Cookies
            </h2>

            <p className="text-gray-700 mb-4">
              We use cookies for various purposes, including:
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Maintaining user login sessions</li>
              <li>Improving platform functionality</li>
              <li>Understanding how users interact with our services</li>
              <li>Providing personalized content and recommendations</li>
              <li>Enhancing security and preventing fraud</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="types" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              3. Types of Cookies We Use
            </h2>

            <h3 className="font-medium mb-2">Essential Cookies</h3>

            <p className="text-gray-700">
              These cookies are necessary for the website to function
              properly and cannot be disabled.
            </p>

            <h3 className="font-medium mt-6 mb-2">Performance Cookies</h3>

            <p className="text-gray-700">
              These cookies help us understand how visitors interact
              with the Platform so we can improve performance.
            </p>

            <h3 className="font-medium mt-6 mb-2">Functional Cookies</h3>

            <p className="text-gray-700">
              These cookies remember user preferences and enhance
              personalized features.
            </p>

            <h3 className="font-medium mt-6 mb-2">Analytics Cookies</h3>

            <p className="text-gray-700">
              These cookies help track usage patterns to improve
              the quality of our services.
            </p>
          </section>

          {/* Section 4 */}
          <section id="thirdparty" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              4. Third-Party Cookies
            </h2>

            <p className="text-gray-700 mb-4">
              We may use trusted third-party services that place cookies
              on your device to help us analyze usage and improve our
              Platform.
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Customer support tools</li>
              <li>Cloud hosting services</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="manage" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              5. Managing Cookies
            </h2>

            <p className="text-gray-700 mb-4">
              Most web browsers allow you to control cookies through
              browser settings. You can choose to:
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Delete existing cookies</li>
              <li>Block cookies from certain websites</li>
              <li>Disable cookies entirely</li>
              <li>Receive notifications when cookies are being used</li>
            </ul>

            <p className="mt-4 text-gray-700">
              Please note that disabling cookies may affect the
              functionality of some parts of the Platform.
            </p>
          </section>

          {/* Section 6 */}
          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              6. Changes to This Cookie Policy
            </h2>

            <p className="text-gray-700">
              We may update this Cookie Policy from time to time.
              Any changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          {/* Section 7 */}
          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">
              7. Contact Us
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