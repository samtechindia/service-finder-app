import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {

    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validateEmail()) return;

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {

      setIsSubmitting(false);
      setIsSubmitted(true);

    }, 1500);
  };

  const handleEmailChange = (e) => {

    setEmail(e.target.value);

    if (error) setError("");

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">

      <div className="max-w-md w-full space-y-8">

        {/* Header */}

        <div className="text-center">

          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">

            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>

          </div>

          <h1 className="text-3xl font-bold text-primary-900">
            Forgot Password
          </h1>

          <p className="text-gray-600 mt-2">
            Enter your email and we'll send you a reset link.
          </p>

        </div>

        {/* Card */}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {isSubmitted ? (

            /* SUCCESS STATE */

            <div className="text-center py-6">

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">

                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />

                </svg>

              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Check Your Email
              </h2>

              <p className="text-gray-600 mb-6">

                We've sent a password reset link to

                <br />

                <span className="font-semibold">{email}</span>

              </p>

              <div className="space-y-3">

                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  Back to Login
                </Link>

                <Link
                  to="/"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </Link>

              </div>

            </div>

          ) : (

            /* FORM */

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 text-left"
                >
                  Email Address
                </label>

                <div className="relative">

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    aria-invalid={!!error}
                    aria-describedby="email-error"
                    className={`input-field ${error ? "input-field-error" : ""}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                </div>

                {error && (

                  <p
                    id="email-error"
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </p>

                )}

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">

                <Link
                  to="/login"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Back to Sign in
                </Link>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>

  );

};

export default ForgotPassword;