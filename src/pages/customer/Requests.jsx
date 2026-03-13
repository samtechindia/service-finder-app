import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

const CustomerRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings([
        {
          id: 1,
          service: 'Plumbing',
          provider: 'John Smith',
          providerId: 1,
          date: '2024-03-20',
          time: '10:00 AM',
          status: 'confirmed',
          price: 150,
          address: '123 Main St, New York, NY',
          description: 'Fix leaking kitchen faucet',
          urgency: 'medium',
          createdAt: '2024-03-15',
          paymentStatus: 'pending'
        },
        {
          id: 2,
          service: 'Electrical',
          provider: 'Sarah Johnson',
          providerId: 2,
          date: '2024-03-22',
          time: '2:00 PM',
          status: 'pending',
          price: 200,
          address: '456 Oak Ave, Brooklyn, NY',
          description: 'Install new ceiling fan',
          urgency: 'low',
          createdAt: '2024-03-14',
          paymentStatus: 'pending'
        },
        {
          id: 3,
          service: 'Cleaning',
          provider: 'Mike Wilson',
          providerId: 3,
          date: '2024-03-10',
          time: '9:00 AM',
          status: 'completed',
          price: 80,
          address: '789 Pine St, Queens, NY',
          description: 'Deep clean apartment',
          urgency: 'low',
          createdAt: '2024-03-08',
          paymentStatus: 'paid',
          rating: 5,
          review: 'Excellent service, very thorough!'
        },
        {
          id: 4,
          service: 'Gardening',
          provider: 'Emma Davis',
          providerId: 4,
          date: '2024-03-05',
          time: '11:00 AM',
          status: 'cancelled',
          price: 120,
          address: '321 Elm St, Manhattan, NY',
          description: 'Lawn maintenance and tree trimming',
          urgency: 'medium',
          createdAt: '2024-03-01',
          paymentStatus: 'refunded',
          cancellationReason: 'Provider unavailable'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'in-progress':
        return 'accent';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'refunded':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCancelBooking = () => {
    // Simulate API call
    setBookings(prev => prev.map(b => 
      b.id === selectedBooking.id 
        ? { ...b, status: 'cancelled', paymentStatus: 'refunded', cancellationReason: 'Cancelled by customer' }
        : b
    ));
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const handleSubmitReview = () => {
    // Simulate API call
    setBookings(prev => prev.map(b => 
      b.id === selectedBooking.id 
        ? { ...b, rating: reviewData.rating, review: reviewData.comment }
        : b
    ));
    setShowReviewModal(false);
    setSelectedBooking(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    'in-progress': bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <SkeletonLoader className="h-8 w-48 mb-2" />
          <SkeletonLoader className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
        <SkeletonLoader className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Service Requests</h1>
        <p className="text-gray-600 mt-2">Manage and track all your service bookings</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  filter === status
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Service
        </Button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={
            filter === 'all' 
              ? "You haven't made any service requests yet" 
              : `No ${filter} bookings found`
          }
          action={
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book Your First Service
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar size="lg" className="bg-primary-100 text-primary-600">
                          {booking.provider.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant={getPaymentStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus.replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{booking.provider}</p>
                          <p className="text-sm text-gray-600 mb-3">{booking.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2 font-medium">{booking.date}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <span className="ml-2 font-medium">{booking.time}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <span className="ml-2 font-medium">${booking.price}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Address:</span>
                              <span className="ml-2 font-medium">{booking.address}</span>
                            </div>
                          </div>

                          {booking.cancellationReason && (
                            <Alert variant="error" className="mt-3">
                              {booking.cancellationReason}
                            </Alert>
                          )}

                          {booking.rating && (
                            <div className="mt-3 flex items-center gap-2">
                              <RatingStars rating={booking.rating} size="sm" />
                              <span className="text-sm text-gray-600">Your review</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-4">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <>
                          <Button size="sm">
                            Contact Provider
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'in-progress' && (
                        <>
                          <Button size="sm">
                            Track Progress
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowReviewModal(true);
                            }}
                          >
                            Leave Review
                          </Button>
                          <Button size="sm" variant="outline">
                            Book Again
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && booking.rating && (
                        <>
                          <Button size="sm" variant="outline">
                            Book Again
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <Button size="sm" variant="outline">
                          Book New Service
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          
          {selectedBooking?.paymentStatus === 'paid' && (
            <Alert variant="warning" className="mb-6">
              You will receive a full refund to your original payment method.
            </Alert>
          )}
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
            >
              Keep Booking
            </Button>
            <Button
              variant="error"
              onClick={handleCancelBooking}
              className="flex-1"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Leave a Review"
      >
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              How was your experience with {selectedBooking?.provider}?
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                    className="text-3xl transition-colors duration-200"
                  >
                    <span className={star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience (optional)"
              className="input-field"
              rows={4}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowReviewModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerRequests;
