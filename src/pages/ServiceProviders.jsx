import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import RatingStars from '../components/ui/RatingStars';
import Input from '../components/ui/Input';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const ServiceProviders = () => {
  const { service } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rating: 0,
    priceRange: 'all',
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState('rating');

  // Mock data - in real app, this would come from API
  const mockProviders = [
    {
      id: 1,
      name: 'John Smith',
      service: 'plumbing',
      category: 'Plumbing',
      rating: 4.8,
      reviews: 124,
      price: '$45-65/hr',
      image: '/api/placeholder/200/200',
      location: 'New York, NY',
      experience: '8 years',
      verified: true,
      available: true,
      description: 'Professional plumbing services with 8+ years of experience.',
      specialties: ['Pipe Repair', 'Installation', 'Emergency Services']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      service: 'plumbing',
      category: 'Plumbing',
      rating: 4.9,
      reviews: 89,
      price: '$50-70/hr',
      image: '/api/placeholder/200/200',
      location: 'Brooklyn, NY',
      experience: '6 years',
      verified: true,
      available: false,
      description: 'Specialized in residential plumbing solutions.',
      specialties: ['Bathroom Fixtures', 'Water Heaters', 'Drain Cleaning']
    },
    {
      id: 3,
      name: 'Mike Wilson',
      service: 'plumbing',
      category: 'Plumbing',
      rating: 4.6,
      reviews: 67,
      price: '$40-55/hr',
      image: '/api/placeholder/200/200',
      location: 'Queens, NY',
      experience: '5 years',
      verified: false,
      available: true,
      description: 'Affordable and reliable plumbing services.',
      specialties: ['General Plumbing', 'Leak Detection', 'Maintenance']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProviders(mockProviders);
      setLoading(false);
    }, 1000);
  }, [service]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProviders = providers
    .filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           provider.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRating = provider.rating >= filters.rating;
      const matchesAvailability = filters.availability === 'all' || 
                                  (filters.availability === 'available' && provider.available);
      
      return matchesSearch && matchesRating && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return parseInt(a.price.match(/\d+/)[0]) - parseInt(b.price.match(/\d+/)[0]);
        case 'price-high':
          return parseInt(b.price.match(/\d+/)[0]) - parseInt(a.price.match(/\d+/)[0]);
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SkeletonLoader className="h-64" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <SkeletonLoader key={i} className="h-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {service} Services
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredProviders.length} professional {service} providers available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <Input
                  placeholder="Search providers..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                        className="mr-2"
                      />
                      <RatingStars rating={rating} size="sm" />
                      <span className="ml-2 text-sm text-gray-600">& up</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={filters.rating === 0}
                      onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">All ratings</span>
                  </label>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={filters.availability === 'all'}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">All providers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={filters.availability === 'available'}
                      onChange={(e) => handleFilterChange('availability', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Available now</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ search: '', rating: 0, priceRange: 'all', availability: 'all' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Provider Listings */}
          <div className="lg:col-span-3">
            {filteredProviders.length === 0 ? (
              <EmptyState
                title="No providers found"
                description="Try adjusting your filters or search terms"
                action={
                  <Button
                    onClick={() => setFilters({ search: '', rating: 0, priceRange: 'all', availability: 'all' })}
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card hover interactive className="h-full">
                      <div className="p-6">
                        {/* Provider Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                              <p className="text-sm text-gray-600">{provider.location}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {provider.verified && (
                              <Badge variant="success" size="sm">Verified</Badge>
                            )}
                            {provider.available ? (
                              <Badge variant="success" size="sm">Available</Badge>
                            ) : (
                              <Badge variant="secondary" size="sm">Busy</Badge>
                            )}
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            <RatingStars rating={provider.rating} size="sm" />
                            <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            ({provider.reviewCount || 0} reviews)
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {provider.description}
                        </p>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {provider.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" size="sm">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Experience and Price */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{provider.experience}</span> experience
                          </div>
                          <div className="text-sm font-semibold text-primary-600">
                            {provider.price}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Link to={`/provider/${provider.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              View Profile
                            </Button>
                          </Link>
                          <Link to={`/book-service?provider=${provider.id}`} className="flex-1">
                            <Button size="sm" className="w-full">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;
