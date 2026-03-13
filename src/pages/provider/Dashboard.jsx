import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import Alert from '../../components/ui/Alert';

const ProviderDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeJobs: 0,
    completedJobs: 0,
    averageRating: 0,
    totalClients: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalEarnings: 12450,
        activeJobs: 3,
        completedJobs: 47,
        averageRating: 4.8,
        totalClients: 32
      });
      
      setRecentRequests([
        {
          id: 1,
          service: 'Plumbing',
          customer: 'Alice Johnson',
          date: '2024-03-15',
          time: '2:00 PM',
          price: 150,
          urgency: 'medium',
          status: 'pending',
          description: 'Fix leaking kitchen faucet'
        },
        {
          id: 2,
          service: 'Plumbing',
          customer: 'Bob Williams',
          date: '2024-03-15',
          time: '4:00 PM',
          price: 200,
          urgency: 'high',
          status: 'pending',
          description: 'Emergency pipe repair'
        },
        {
          id: 3,
          service: 'Plumbing',
          customer: 'Carol Davis',
          date: '2024-03-14',
          time: '10:00 AM',
          price: 120,
          urgency: 'low',
          status: 'pending',
          description: 'Install new bathroom fixtures'
        }
      ]);
      
      setUpcomingJobs([
        {
          id: 4,
          service: 'Plumbing',
          customer: 'David Brown',
          date: '2024-03-16',
          time: '9:00 AM',
          price: 180,
          status: 'confirmed',
          address: '123 Main St, New York, NY',
          description: 'Water heater installation'
        },
        {
          id: 5,
          service: 'Plumbing',
          customer: 'Emma Wilson',
          date: '2024-03-17',
          time: '11:00 AM',
          price: 160,
          status: 'confirmed',
          address: '456 Oak Ave, Brooklyn, NY',
          description: 'Drain cleaning service'
        }
      ]);
      
      setWeeklyEarnings([
        { day: 'Mon', earnings: 320 },
        { day: 'Tue', earnings: 280 },
        { day: 'Wed', earnings: 450 },
        { day: 'Thu', earnings: 380 },
        { day: 'Fri', earnings: 520 },
        { day: 'Sat', earnings: 240 },
        { day: 'Sun', earnings: 180 }
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <SkeletonLoader className="h-8 w-64 mb-2" />
          <SkeletonLoader className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonLoader key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader className="h-96" />
          <SkeletonLoader className="h-96" />
          <SkeletonLoader className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-2">Here's your business overview and recent activity</p>
      </div>

      {/* Alert for pending requests */}
      {recentRequests.length > 0 && (
        <Alert variant="warning" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <strong>{recentRequests.length} new service requests</strong> waiting for your response
            </div>
            <Link to="/provider/requests">
              <Button size="sm">View Requests</Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Earnings</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.activeJobs}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Active Jobs</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.completedJobs}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Completed Jobs</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                  <RatingStars rating={stats.averageRating} size="sm" className="ml-2" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Average Rating</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.totalClients}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Clients</h3>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Service Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Service Requests</h2>
                <Link to="/provider/requests">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <Avatar size="md" className="bg-primary-100 text-primary-600">
                        {request.customer.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{request.service}</h3>
                          <Badge variant={getUrgencyColor(request.urgency)} size="sm">
                            {request.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{request.customer}</p>
                        <p className="text-xs text-gray-500">{request.date} at {request.time}</p>
                        <p className="text-xs text-gray-600 mt-1">{request.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(request.status)} size="sm">
                        {request.status}
                      </Badge>
                      <p className="text-sm font-medium text-gray-900 mt-1">${request.price}</p>
                      <div className="mt-2 space-x-2">
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="ghost">Decline</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Jobs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Jobs</h2>
                <Link to="/provider/requests">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{job.service}</h3>
                      <Badge variant="primary" size="sm">{job.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{job.customer}</p>
                    <p className="text-xs text-gray-500 mb-2">{job.date} at {job.time}</p>
                    <p className="text-xs text-gray-600 mb-2">{job.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600">${job.price}</span>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="mt-6"
      >
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Earnings</h2>
            
            <div className="flex items-end justify-between h-48">
              {weeklyEarnings.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-16 bg-gray-200 rounded-t-lg relative">
                    <div
                      className="absolute bottom-0 w-full bg-primary-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(day.earnings / 520) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                  <span className="text-xs font-medium text-gray-900">${day.earnings}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Total this week</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average per day</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${Math.round(weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0) / 7)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProviderDashboard;
