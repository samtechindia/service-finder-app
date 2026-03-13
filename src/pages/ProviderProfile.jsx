import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import providersData from '../mock/providers.json';
import { RatingStars } from '../components/ui';

const ProviderProfile = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // Simulate API call
    const fetchProvider = () => {
      setTimeout(() => {
        const foundProvider = providersData.find(p => p.id === parseInt(id));
        setProvider(foundProvider);
        setLoading(false);
      }, 500);
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted">Loading provider profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          title="Provider Not Found"
          description="The provider you're looking for doesn't exist or has been removed."
          actionText="Browse All Providers"
          onAction={() => window.location.href = '/providers'}
          icon={
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    );
  }

  const tabs = [
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'availability', label: 'Availability', icon: '📅' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Provider Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link
              to="/providers"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Providers
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {/* Profile Avatar */}
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{provider.name}</h1>
                  <p className="text-xl text-white/90 mb-3">{provider.service}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <RatingStars rating={provider.rating} size="lg" />
                      <span className="ml-2 text-white/80">({provider.reviews || 45} reviews)</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {provider.experience}
                    </div>
                    <div className="flex items-center text-white/80">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {provider.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              <Link
                to={`/booking?provider=${provider.id}`}
                className="btn-accent text-lg px-8 py-4 shadow-xl"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-primary-900 mb-4">About {provider.name}</h2>
                    <p className="text-muted leading-relaxed mb-6">
                      {provider.description || `Professional ${provider.service.toLowerCase()} with over ${provider.experience.toLowerCase()} of experience. 
                      Committed to providing high-quality services with attention to detail and customer satisfaction. 
                      Specialized in residential and commercial projects, emergency services, and maintenance solutions.`}
                    </p>
                    
                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-primary-900 mb-3">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {(provider.skills || ['Professional Service', 'Emergency Support', 'Quality Workmanship', 'Customer Satisfaction']).map((skill, index) => (
                          <span key={index} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-900 mb-3">Certifications & Awards</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-primary-900">Licensed Professional</div>
                            <div className="text-sm text-muted">State Certified</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-primary-900">Top Rated 2023</div>
                            <div className="text-sm text-muted">Customer Choice Award</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-primary-900 mb-6">Services Offered</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: `Professional ${provider.service.toLowerCase()}`, price: 'Starting at $50/hr', description: 'Expert service with quality materials' },
                        { name: 'Emergency Services', price: '24/7 Available', description: 'Rapid response for urgent issues' },
                        { name: 'Free Consultation', price: 'No Charge', description: 'Initial assessment and quote' },
                        { name: 'Warranty Service', price: 'Included', description: '12-month warranty on all work' }
                      ].map((service, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-primary-900">{service.name}</h3>
                            <span className="text-accent-600 font-medium">{service.price}</span>
                          </div>
                          <p className="text-sm text-muted">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-primary-900">Customer Reviews</h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <RatingStars rating={provider.rating} size="lg" />
                        </div>
                        <span className="text-lg font-medium text-primary-900">{provider.rating}</span>
                        <span className="text-muted">({provider.reviews || 45} reviews)</span>
                      </div>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {[
                        { name: 'John D.', rating: 5, date: '2 weeks ago', comment: 'Excellent service! Very professional and knowledgeable. Fixed my issue quickly.' },
                        { name: 'Sarah M.', rating: 5, date: '1 month ago', comment: 'Great experience from start to finish. Fair pricing and quality workmanship.' },
                        { name: 'Mike R.', rating: 4, date: '2 months ago', comment: 'Good service, arrived on time and completed the work as promised.' }
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-primary-900">{review.name}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <RatingStars rating={review.rating} size="sm" />
                                <span className="text-sm text-muted">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-primary-900 mb-6">Working Hours</h2>
                    <div className="space-y-3">
                      {[
                        { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', status: 'available' },
                        { days: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'limited' },
                        { days: 'Sunday', hours: 'Emergency Only', status: 'emergency' }
                      ].map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-primary-900">{schedule.days}</div>
                            <div className="text-muted">{schedule.hours}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            schedule.status === 'available' ? 'bg-accent-100 text-accent-700' :
                            schedule.status === 'limited' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {schedule.status === 'available' ? 'Available' :
                             schedule.status === 'limited' ? 'Limited Hours' : 'Emergency Only'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-muted">
                    <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{provider.phone || '+1 (555) 123-4567'}</span>
                  </div>
                  <div className="flex items-center text-muted">
                    <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{provider.email || 'provider@example.com'}</span>
                  </div>
                  <div className="flex items-center text-muted">
                    <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{provider.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-primary-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to={`/booking?provider=${provider.id}`}
                    className="w-full btn-primary text-center"
                  >
                    Book Service
                  </Link>
                  <button className="w-full btn-outline text-center">
                    Send Message
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                    Save to Favorites
                  </button>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-900">Response Time</div>
                    <div className="text-sm text-muted">Usually responds within</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary-600">1-2 hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
