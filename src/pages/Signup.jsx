import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['customer', 'provider']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  // Provider-specific fields
  service: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  availability: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine(data => {
  if (data.userType === 'provider') {
    return data.service && data.location && data.experience && data.description;
  }
  return true;
}, {
  message: "All provider fields are required",
  path: ["service"]
});

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState('customer');
  
  // Separate local states for each user type
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [providerFormData, setProviderFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    service: '',
    location: '',
    experience: '',
    description: '',
    availability: 'today'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: 'customer'
    }
  });

  const userType = watch('userType');
  
  // Sync form data when switching between user types
  useEffect(() => {
    const currentData = getValues();
    
    if (userType === 'customer') {
      setCustomerFormData(prev => ({
        ...prev,
        name: currentData.name || '',
        email: currentData.email || '',
        phone: currentData.phone || '',
        password: currentData.password || '',
        confirmPassword: currentData.confirmPassword || '',
        agreeToTerms: currentData.agreeToTerms || false
      }));
    } else {
      setProviderFormData(prev => ({
        ...prev,
        name: currentData.name || '',
        email: currentData.email || '',
        phone: currentData.phone || '',
        password: currentData.password || '',
        confirmPassword: currentData.confirmPassword || '',
        agreeToTerms: currentData.agreeToTerms || false,
        service: currentData.service || '',
        location: currentData.location || '',
        experience: currentData.experience || '',
        description: currentData.description || '',
        availability: currentData.availability || 'today'
      }));
    }
  }, [userType, getValues]);
  
  // Restore form data when switching sections
  const handleSectionSwitch = (section) => {
    const currentData = getValues();
    
    // Save current data
    if (userType === 'customer') {
      setCustomerFormData(prev => ({
        ...prev,
        name: currentData.name || '',
        email: currentData.email || '',
        phone: currentData.phone || '',
        password: currentData.password || '',
        confirmPassword: currentData.confirmPassword || '',
        agreeToTerms: currentData.agreeToTerms || false
      }));
    } else {
      setProviderFormData(prev => ({
        ...prev,
        name: currentData.name || '',
        email: currentData.email || '',
        phone: currentData.phone || '',
        password: currentData.password || '',
        confirmPassword: currentData.confirmPassword || '',
        agreeToTerms: currentData.agreeToTerms || false,
        service: currentData.service || '',
        location: currentData.location || '',
        experience: currentData.experience || '',
        description: currentData.description || '',
        availability: currentData.availability || 'today'
      }));
    }
    
    // Switch section and restore data
    setExpandedSection(section);
    setValue('userType', section);
    
    setTimeout(() => {
      const dataToRestore = section === 'customer' ? customerFormData : providerFormData;
      const resetData = {
        userType: section,
        name: dataToRestore.name,
        email: dataToRestore.email,
        phone: dataToRestore.phone,
        password: dataToRestore.password,
        confirmPassword: dataToRestore.confirmPassword,
        agreeToTerms: dataToRestore.agreeToTerms
      };
      
      // Add provider fields if switching to provider
      if (section === 'provider') {
        resetData.service = dataToRestore.service;
        resetData.location = dataToRestore.location;
        resetData.experience = dataToRestore.experience;
        resetData.description = dataToRestore.description;
        resetData.availability = dataToRestore.availability;
      }
      
      reset(resetData);
    }, 0);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.userType === 'customer' ? 'CUSTOMER' : 'PROVIDER'
      };

      // Add provider-specific fields if registering as provider
      if (data.userType === 'provider') {
        userData.service = data.service;
        userData.location = data.location;
        userData.experience = data.experience;
        userData.description = data.description;
        userData.availability = data.availability || 'flexible';
      }

      const result = await signup(userData);

      if (result.success) {
        toast.success('Account created successfully! Welcome to our platform.');
        
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-400 to-secondary-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-400 to-primary-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-xl w-full space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Create Account</h1>
          <p className="text-gray-600 text-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-all duration-200 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Card */}
            <div
              onClick={() => handleSectionSwitch('customer')}
              className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                expandedSection === 'customer'
                  ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-2xl ring-4 ring-primary-200'
                  : 'border-gray-200 bg-white/95 backdrop-blur-lg shadow-lg hover:border-primary-300 hover:shadow-xl'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  expandedSection === 'customer' ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg' : 'bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600'
                }`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Hire Services</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Find trusted professionals</p>
                </div>
                {expandedSection === 'customer' && (
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Card */}
            <div
              onClick={() => handleSectionSwitch('provider')}
              className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                expandedSection === 'provider'
                  ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-2xl ring-4 ring-primary-200'
                  : 'border-gray-200 bg-white/95 backdrop-blur-lg shadow-lg hover:border-primary-300 hover:shadow-xl'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  expandedSection === 'provider' ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-lg' : 'bg-gradient-to-br from-primary-100 to-secondary-100 text-primary-600'
                }`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Provide Services</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Offer your expertise</p>
                </div>
                {expandedSection === 'provider' && (
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800 text-left">
                Full Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800 text-left">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800 text-left">
              Phone Number*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800 text-left">
                Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`h-12 w-full pl-12 pr-14 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800 text-left">
                Confirm Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`h-12 w-full pl-12 pr-14 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Provider-specific fields */}
            {expandedSection === 'provider' && (
              <div className="space-y-6 border-t border-gray-200 pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Provider Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your services</p>
                </div>

                {/* Service Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 text-left">
                    Primary Service*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <select
                      {...register('service')}
                      className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.service ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                    >
                      <option value="">Select your primary service</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="AC Repair">AC Repair</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Painter">Painter</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Mechanic">Mechanic</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Pest Control">Pest Control</option>
                      <option value="Appliance Repair">Appliance Repair</option>
                    </select>
                  </div>
                  {errors.service && (
                    <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.service.message}
                    </p>
                  )}
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 text-left">
                    Service Location*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      {...register('location')}
                      className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                      placeholder="City or area where you provide services"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Experience Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 text-left">
                    Experience*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      {...register('experience')}
                      className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.experience ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                      placeholder="e.g., 5 years, 3+ years"
                    />
                  </div>
                  {errors.experience && (
                    <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 text-left">
                    Professional Description*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className={`w-full pl-12 pr-4 pt-3 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                      placeholder="Describe your services, expertise, and what makes you stand out..."
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Availability Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 text-left">
                    Availability
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <select
                      {...register('availability')}
                      className={`h-12 w-full pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-white/90 backdrop-blur placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm hover:shadow-md ${errors.availability ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
                    >
                      <option value="today">Available Today</option>
                      <option value="week">Available This Week</option>
                      <option value="weekend">Available on Weekends</option>
                      <option value="emergency">Emergency Services</option>
                      <option value="flexible">Flexible Schedule</option>
                    </select>
                  </div>
                  {errors.availability && (
                    <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.availability.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register('agreeToTerms')}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 focus:ring-2 border-gray-300 rounded mt-0.5 transition-colors duration-200"
                />
                <label className="text-sm text-gray-700 leading-relaxed text-left">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold text-base rounded-2xl hover:from-primary-700 hover:to-secondary-700 focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 backdrop-blur text-gray-500 font-medium">Or continue with</span>
            </div>
          </div> */}

          {/* Social Signup Buttons */}
          {/* <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="group relative w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-2xl bg-white/90 backdrop-blur text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              className="group relative w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-2xl bg-white/90 backdrop-blur text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
