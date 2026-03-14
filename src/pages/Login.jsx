import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (formData.password.length > 50) {
      newErrors.password = "Password must be less than 50 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        toast.success('Login successful! Welcome back.');
        
        // Redirect based on user role
        const userRole = result.user?.role;
        if (userRole === 'CUSTOMER') {
          navigate('/customer/dashboard');
        } else if (userRole === 'PROVIDER') {
          navigate('/provider/dashboard');
        } else {
          // Fallback to home if role is not recognized
          navigate('/');
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">

      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary-900">
            Welcome back
          </h1>

          <p className="text-muted mt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign up for free
            </Link>
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 text-left"
              >
                Email Address*
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${errors.email ? "input-field-error" : ""}`}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {errors.email && (
                <p className="text-red-500 text-sm text-left">
                  {errors.email}
                </p>
              )}

            </div>

            {/* Password */}
            <div className="space-y-2">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 text-left"
              >
                Password*
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-10 ${errors.password ? "input-field-error" : ""}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}

            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">

              <div className="flex items-center">

                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />

                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>

              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Divider */}
          {/* <div className="mt-8">

            <div className="flex items-center">
              <div className="flex-grow border-t"></div>
              <span className="px-4 text-sm text-gray-500">
                Or continue with
              </span>
              <div className="flex-grow border-t"></div>
            </div>

            {/* Social Login */}
            {/* <div className="mt-6 grid grid-cols-2 gap-3">

              <button className="border rounded-xl py-3 hover:bg-gray-50">
                Google
              </button>

              <button className="border rounded-xl py-3 hover:bg-gray-50">
                GitHub
              </button>

            </div>

          </div>  */}

        </div>

        {/* Provider Login */}
        <div className="text-center">

          <p className="text-sm text-muted">

            Are you a service provider?{" "}

            <Link
              to="/provider/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in here
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;