import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Badge, Input, SkeletonLoader } from '../components/ui';
import ProviderCard from '../components/ProviderCard';
import providersData from '../mock/providers.json';

const Providers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    rating: searchParams.get('rating') || '',
    priceRange: searchParams.get('priceRange') || '',
    location: searchParams.get('location') || ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProviders(providersData);
      setFilteredProviders(providersData);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = providers;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter(provider =>
        provider.category === filters.category
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(provider =>
        provider.rating >= parseFloat(filters.rating)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(provider => {
        const rate = provider.hourlyRate || 0;
        return rate >= min && rate <= max;
      });
    }

    if (filters.location) {
      filtered = filtered.filter(provider =>
        provider.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience.localeCompare(a.experience);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        default:
          return 0;
      }
    });

    setFilteredProviders(filtered);
  }, [providers, searchTerm, filters, sortBy]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.rating) params.set('rating', newFilters.rating);
    if (newFilters.priceRange) params.set('priceRange', newFilters.priceRange);
    if (newFilters.location) params.set('location', newFilters.location);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      rating: '',
      priceRange: '',
      location: ''
    });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Find Service Providers</h1>
            <p className="text-muted">Browse our network of verified professionals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <SkeletonLoader variant="card" height="280px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Find Service Providers</h1>
          <p className="text-muted">Browse our network of {providers.length} verified professionals</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <Input
                placeholder="Search by name, service, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Service Category"
                value={filters.category}
                onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
              />
              <select
                value={filters.rating}
                onChange={(e) => updateFilters({ ...filters, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Minimum Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
              <select
                value={filters.priceRange}
                onChange={(e) => updateFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Price Range</option>
                <option value="0-50">$0 - $50/hr</option>
                <option value="50-100">$50 - $100/hr</option>
                <option value="100-200">$100 - $200/hr</option>
                <option value="200-999">$200+/hr</option>
              </select>
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => updateFilters({ ...filters, location: e.target.value })}
              />
            </div>

            {/* Active Filters and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" size="sm">
                    Search: {searchTerm}
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" size="sm">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.rating && (
                  <Badge variant="secondary" size="sm">
                    Rating: {filters.rating}+
                  </Badge>
                )}
                {filters.priceRange && (
                  <Badge variant="secondary" size="sm">
                    Price: ${filters.priceRange}/hr
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" size="sm">
                    Location: {filters.location}
                  </Badge>
                )}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="experience">Sort by Experience</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted">
            Showing {filteredProviders.length} of {providers.length} providers
            {activeFiltersCount > 0 && ` (filtered)`}
          </p>
        </div>

        {filteredProviders.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-900 mb-2">No providers found</h3>
              <p className="text-muted mb-4">
                Try adjusting your search criteria or filters to find more providers.
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;