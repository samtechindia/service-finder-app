import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import RatingStars from '../components/ui/RatingStars';
import Alert from '../components/ui/Alert';
import SkeletonLoader from '../components/ui/SkeletonLoader';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  serviceQuality: z.number().min(1, 'Please rate service quality').max(5),
  professionalism: z.number().min(1, 'Please rate professionalism').max(5),
  communication: z.number().min(1, 'Please rate communication').max(5),
  value: z.number().min(1, 'Please rate value for money').max(5),
  punctuality: z.number().min(1, 'Please rate punctuality').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
  wouldRecommend: z.boolean(),
  hireAgain: z.boolean()
});

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      serviceQuality: 5,
      professionalism: 5,
      communication: 5,
      value: 5,
      punctuality: 5,
      comment: '',
      wouldRecommend: true,
      hireAgain: true
    }
  });

  const watchedRating = watch('rating');

  useEffect(() => {
    // Simulate API call to get booking details
    setTimeout(() => {
      setBooking({
        id: bookingId,
        service: 'Plumbing',
        provider: 'John Smith',
        providerId: 1,
        date: '2024-03-10',
        time: '10:00 AM',
        price: 150,
        status: 'completed',
        description: 'Fixed leaking kitchen faucet and checked water pressure',
        address: '123 Main St, New York, NY 10001',
        providerAvatar: '/api/placeholder/200/200',
        providerRating: 4.8,
        providerReviews: 124,
        providerExperience: '8 years',
        providerSpecialties: ['Pipe Repair', 'Installation', 'Emergency Services']
      });
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/customer/requests?review=submitted');
      }, 3000);
    }, 1500);
  };

  const ratingCategories = [
    { key: 'serviceQuality', label: 'Service Quality', description: 'Quality of work performed' },
    { key: 'professionalism', label: 'Professionalism', description: 'Behavior and attitude' },
    { key: 'communication', label: 'Communication', description: 'Clarity and responsiveness' },
    { key: 'value', label: 'Value for Money', description: 'Fairness of pricing' },
    { key: 'punctuality', label: 'Punctuality', description: 'On-time arrival and completion' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader className="h-96" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">
            Booking not found. Please check your booking details and try again.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="success">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong>Review submitted successfully!</strong>
                  <p className="text-sm mt-1">Thank you for your feedback. You will be redirected shortly.</p>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Service</h1>
          <p className="text-gray-600 mt-2">Share your experience to help others make informed decisions</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Info */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar size="lg" className="bg-primary-100 text-primary-600">
                      {booking.provider.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.provider}</h3>
                      <Badge variant="success" size="sm">Verified</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{booking.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{booking.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{booking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${booking.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="success" size="sm">{booking.status}</Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">{booking.description}</p>
                    <p className="text-xs text-gray-500">{booking.address}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Provider Rating</span>
                      <div className="flex items-center">
                        <RatingStars rating={booking.providerRating} size="sm" />
                        <span className="ml-1 text-sm font-medium">{booking.providerRating}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.providerReviews} reviews • {booking.providerExperience} experience
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Review Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Rating */}
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-primary-600 mb-2">
                      {watchedRating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setValue('rating', star)}
                          className="text-4xl transition-colors duration-200 mx-1"
                        >
                          <span className={star <= watchedRating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {watchedRating === 5 && 'Excellent!'}
                      {watchedRating === 4 && 'Very Good'}
                      {watchedRating === 3 && 'Good'}
                      {watchedRating === 2 && 'Fair'}
                      {watchedRating === 1 && 'Poor'}
                    </p>
                  </div>
                  
                  <input type="hidden" {...register('rating')} />
                  {errors.rating && (
                    <p className="text-red-500 text-sm text-center">{errors.rating.message}</p>
                  )}
                </div>
              </Card>

              {/* Detailed Ratings */}
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Ratings</h2>
                  
                  <div className="space-y-4">
                    {ratingCategories.map((category) => (
                      <div key={category.key}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="font-medium text-gray-900 text-left">{category.label}</label>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setValue(category.key, star)}
                                className="text-xl transition-colors duration-200 mx-0.5"
                              >
                                <span className={star <= getValues(category.key) ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <input type="hidden" {...register(category.key)} />
                        {errors[category.key] && (
                          <p className="text-red-500 text-sm">{errors[category.key].message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Written Review */}
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Written Review</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us about your experience
                    </label>
                    <textarea
                      {...register('comment')}
                      rows={6}
                      className="input-field"
                      placeholder="Share details about the service provided, what went well, and what could be improved..."
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                    )}
                  </div>

                  {/* Recommendation Questions */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('wouldRecommend')}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Would you recommend this provider?</div>
                        <div className="text-sm text-gray-600">To friends and family</div>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('hireAgain')}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Would you hire this provider again?</div>
                        <div className="text-sm text-gray-600">For future services</div>
                      </div>
                    </label>
                  </div>
                </div>
              </Card>

              {/* Submit */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/customer/requests')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
