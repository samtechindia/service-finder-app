import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        {
          id: 1,
          service: 'Plumbing',
          customer: 'Alice Johnson',
          customerEmail: 'alice@email.com',
          customerPhone: '+1 (555) 123-4567',
          date: '2024-03-16',
          time: '10:00 AM',
          price: 150,
          urgency: 'medium',
          status: 'pending',
          description: 'Fix leaking kitchen faucet and check water pressure',
          address: '123 Main St, New York, NY 10001',
          createdAt: '2024-03-15T14:30:00Z',
          customerRating: 4.5,
          customerBookings: 3
        },
        {
          id: 2,
          service: 'Plumbing',
          customer: 'Bob Williams',
          customerEmail: 'bob@email.com',
          customerPhone: '+1 (555) 987-6543',
          date: '2024-03-16',
          time: '2:00 PM',
          price: 200,
          urgency: 'high',
          status: 'pending',
          description: 'Emergency pipe repair - burst pipe in bathroom',
          address: '456 Oak Ave, Brooklyn, NY 11201',
          createdAt: '2024-03-15T16:45:00Z',
          customerRating: 4.8,
          customerBookings: 7
        },
        {
          id: 3,
          service: 'Plumbing',
          customer: 'Carol Davis',
          customerEmail: 'carol@email.com',
          customerPhone: '+1 (555) 456-7890',
          date: '2024-03-17',
          time: '11:00 AM',
          price: 120,
          urgency: 'low',
          status: 'confirmed',
          description: 'Install new bathroom fixtures and update plumbing',
          address: '789 Pine St, Queens, NY 11101',
          createdAt: '2024-03-14T10:20:00Z',
          customerRating: 4.2,
          customerBookings: 2
        },
        {
          id: 4,
          service: 'Plumbing',
          customer: 'David Brown',
          customerEmail: 'david@email.com',
          customerPhone: '+1 (555) 234-5678',
          date: '2024-03-15',
          time: '9:00 AM',
          price: 180,
          urgency: 'medium',
          status: 'in-progress',
          description: 'Water heater installation and maintenance',
          address: '321 Elm St, Manhattan, NY 10002',
          createdAt: '2024-03-13T09:15:00Z',
          customerRating: 4.9,
          customerBookings: 5
        },
        {
          id: 5,
          service: 'Plumbing',
          customer: 'Emma Wilson',
          customerEmail: 'emma@email.com',
          customerPhone: '+1 (555) 345-6789',
          date: '2024-03-14',
          time: '3:00 PM',
          price: 160,
          urgency: 'low',
          status: 'completed',
          description: 'Drain cleaning service for kitchen and bathroom',
          address: '654 Maple Dr, Bronx, NY 10451',
          createdAt: '2024-03-12T13:30:00Z',
          customerRating: 4.7,
          customerBookings: 4,
          providerRating: 5,
          providerReview: 'Excellent service, very professional and thorough!'
        },
        {
          id: 6,
          service: 'Plumbing',
          customer: 'Frank Miller',
          customerEmail: 'frank@email.com',
          customerPhone: '+1 (555) 567-8901',
          date: '2024-03-13',
          time: '1:00 PM',
          price: 140,
          urgency: 'medium',
          status: 'cancelled',
          description: 'Fix toilet running issue',
          address: '987 Cedar Ln, Staten Island, NY 10301',
          createdAt: '2024-03-11T11:45:00Z',
          customerRating: 4.0,
          customerBookings: 1,
          cancellationReason: 'Customer cancelled - no longer needed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'primary';
      case 'in-progress':
        return 'accent';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAcceptRequest = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'confirmed' }
          : req
      ));
      setIsSubmitting(false);
      setShowAcceptModal(false);
      setSelectedRequest(null);
    }, 1500);
  };

  const handleDeclineRequest = async () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'cancelled', cancellationReason: declineReason }
          : req
      ));
      setIsSubmitting(false);
      setShowDeclineModal(false);
      setSelectedRequest(null);
      setDeclineReason('');
    }, 1500);
  };

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    confirmed: requests.filter(r => r.status === 'confirmed').length,
    'in-progress': requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length
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
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
        <p className="text-gray-600 mt-2">Manage incoming service requests from customers</p>
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

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="No requests found"
          description={
            filter === 'all' 
              ? "You don't have any service requests yet" 
              : `No ${filter} requests found`
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar size="lg" className="bg-primary-100 text-primary-600">
                          {request.customer.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.service}</h3>
                            <Badge variant={getStatusColor(request.status)}>
                              {request.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{request.customer}</p>
                          <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-2 font-medium">{request.date}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <span className="ml-2 font-medium">{request.time}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <span className="ml-2 font-medium">${request.price}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Address:</span>
                              <span className="ml-2 font-medium">{request.address}</span>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>⭐ {request.customerRating} rating</span>
                            <span>•</span>
                            <span>{request.customerBookings} previous bookings</span>
                          </div>

                          {/* Contact Info */}
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>📧 {request.customerEmail}</span>
                            <span>📞 {request.customerPhone}</span>
                          </div>

                          {request.cancellationReason && (
                            <Alert variant="error" className="mt-3">
                              {request.cancellationReason}
                            </Alert>
                          )}

                          {request.providerRating && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-green-800">Your Rating</span>
                                <span className="text-green-600">⭐ {request.providerRating}</span>
                              </div>
                              <p className="text-sm text-green-700">{request.providerReview}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-4">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAcceptModal(true);
                            }}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDeclineModal(true);
                            }}
                          >
                            Decline
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Profile
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'confirmed' && (
                        <>
                          <Button size="sm">
                            Start Job
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Customer
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'in-progress' && (
                        <>
                          <Button size="sm">
                            Complete Job
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Customer
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'completed' && (
                        <>
                          <Button size="sm" variant="outline">
                            Send Invoice
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'cancelled' && (
                        <Button size="sm" variant="ghost">
                          View Details
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

      {/* Accept Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accept Service Request"
      >
        <div className="p-6">
          {selectedRequest && (
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar size="md" className="bg-primary-100 text-primary-600">
                  {selectedRequest.customer.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedRequest.customer}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.service}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Date:</strong> {selectedRequest.date} at {selectedRequest.time}</div>
                <div><strong>Price:</strong> ${selectedRequest.price}</div>
                <div><strong>Address:</strong> {selectedRequest.address}</div>
                <div><strong>Description:</strong> {selectedRequest.description}</div>
              </div>
            </div>
          )}
          
          <Alert variant="info" className="mb-6">
            By accepting this request, you commit to providing the service at the specified time and location.
          </Alert>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAcceptModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptRequest}
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Accepting...' : 'Accept Request'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decline Modal */}
      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Decline Service Request"
      >
        <div className="p-6">
          {selectedRequest && (
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar size="md" className="bg-primary-100 text-primary-600">
                  {selectedRequest.customer.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedRequest.customer}</h3>
                  <p className="text-sm text-gray-600">{selectedRequest.service}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for declining (required)
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
              className="input-field"
              placeholder="Please provide a reason for declining this request..."
            />
          </div>
          
          <Alert variant="warning" className="mb-6">
            This action cannot be undone. The customer will be notified of your decision.
          </Alert>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeclineModal(false);
                setDeclineReason('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={handleDeclineRequest}
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Declining...' : 'Decline Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProviderRequests;
