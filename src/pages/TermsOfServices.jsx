import React from "react";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Description of Services" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "providers", title: "4. Service Providers" },
  { id: "payments", title: "5. Payments and Fees" },
  { id: "conduct", title: "6. User Conduct" },
  { id: "liability", title: "7. Limitation of Liability" },
  { id: "termination", title: "8. Account Termination" },
  { id: "intellectual", title: "9. Intellectual Property" },
  { id: "changes", title: "10. Changes to Terms" },
  { id: "contact", title: "11. Contact Information" },
];

export default function TermsOfService() {
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
              Terms of Service
            </h1>

            <p className="text-gray-500">
              Last Updated: 12 March 2026
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              Welcome to <strong>[Your Company Name]</strong>. These Terms of
              Service (“Terms”) govern your access to and use of our website,
              mobile applications, and services (collectively, the “Platform”).
            </p>

            <p className="mt-4 text-gray-700">
              By accessing or using the Platform, you agree to be bound by
              these Terms.
            </p>
          </header>

          {/* Section 1 */}
          <section id="acceptance" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>

            <p className="text-gray-700">
              By accessing or using our Platform, you confirm that you agree
              to comply with these Terms. If you do not agree with these
              Terms, you must not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section id="services" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              2. Description of Services
            </h2>

            <p className="text-gray-700 mb-4">
              Our Platform connects customers with local service providers
              such as electricians, plumbers, technicians, tutors, cleaners,
              and other professionals.
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Users can search for nearby service providers</li>
              <li>Users may book services through the Platform</li>
              <li>Service providers can create profiles and offer services</li>
              <li>The Platform acts as a marketplace connecting both parties</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="accounts" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              3. User Accounts
            </h2>

            <p className="text-gray-700 mb-4">
              To access certain features, users may be required to create an account.
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of login credentials</li>
              <li>Be responsible for activities under their account</li>
              <li>Notify us immediately of unauthorized access</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="providers" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              4. Service Providers
            </h2>

            <p className="text-gray-700 mb-4">
              Service providers using the Platform must ensure that all
              information provided is accurate and up to date.
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Provide truthful service descriptions</li>
              <li>Maintain required licenses and certifications</li>
              <li>Deliver services professionally</li>
              <li>Follow all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="payments" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              5. Payments and Fees
            </h2>

            <p className="text-gray-700">
              Some services may require payment. Payments may be processed
              through third-party payment processors integrated with the
              Platform.
            </p>
          </section>

          {/* Section 6 */}
          <section id="conduct" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              6. User Conduct
            </h2>

            <p className="text-gray-700 mb-4">
              Users agree not to engage in the following activities:
            </p>

            <ul className="list-disc list-outside pl-6 space-y-1 text-gray-700">
              <li>Violating any laws or regulations</li>
              <li>Providing false or misleading information</li>
              <li>Harassing or abusing other users</li>
              <li>Attempting to interfere with the Platform’s functionality</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="liability" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              7. Limitation of Liability
            </h2>

            <p className="text-gray-700">
              The Platform serves as a marketplace connecting users and
              service providers. We are not responsible for the quality,
              safety, or legality of services provided by third parties.
            </p>
          </section>

          {/* Section 8 */}
          <section id="termination" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              8. Account Termination
            </h2>

            <p className="text-gray-700">
              We reserve the right to suspend or terminate accounts that
              violate these Terms or engage in harmful activities.
            </p>
          </section>

          {/* Section 9 */}
          <section id="intellectual" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              9. Intellectual Property
            </h2>

            <p className="text-gray-700">
              All content on the Platform, including text, graphics, logos,
              and software, is the property of the Company and protected
              by intellectual property laws.
            </p>
          </section>

          {/* Section 10 */}
          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to Terms
            </h2>

            <p className="text-gray-700">
              We may update these Terms from time to time. Continued use
              of the Platform after changes indicates acceptance of the
              revised Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">
              11. Contact Information
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