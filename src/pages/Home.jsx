import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Avatar, RatingStars, SkeletonLoader } from '../components/ui';
import HeroSlider from '../components/HeroSlider';
import AdvancedSearch from '../components/AdvancedSearch';
import ServiceCard from '../components/ServiceCard';
import ProviderCard from '../components/ProviderCard';
import { servicesAPI, providersAPI, handleApiError } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchResults, setSearchResults] = useState({ services: [], providers: [] });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, providersResponse] = await Promise.all([
          servicesAPI.getServices({ limit: 6 }),
          providersAPI.getProviders({ limit: 6 })
        ]);
        
        setServices(servicesResponse.services || []);
        setProviders(providersResponse.providers || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Show error message to user
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroSlides = [];

  const handleSearch = (query, filters) => {
    if (!query.trim()) {
      setSearchResults({ services: [], providers: [] });
      setSearchPerformed(false);
      return;
    }

    const filteredServices = services.filter(service => {
      const matchesQuery = service.name.toLowerCase().includes(query.toLowerCase()) ||
                          service.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !filters.category || service.category === filters.category;
      const matchesRating = !filters.rating || service.rating >= parseFloat(filters.rating);
      const matchesPrice = !filters.priceRange || checkPriceRange(service.price, filters.priceRange);
      const matchesAvailability = !filters.availability || service.availability === filters.availability;
      
      return matchesQuery && matchesCategory && matchesRating && matchesPrice && matchesAvailability;
    });

    const filteredProviders = providers.filter(provider => {
      const matchesQuery = provider.name.toLowerCase().includes(query.toLowerCase()) ||
                          provider.service.toLowerCase().includes(query.toLowerCase()) ||
                          provider.description.toLowerCase().includes(query.toLowerCase());
      const matchesLocation = !filters.location || provider.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesRating = !filters.rating || provider.rating >= parseFloat(filters.rating);
      const matchesAvailability = !filters.availability || provider.availability === filters.availability;
      
      return matchesQuery && matchesLocation && matchesRating && matchesAvailability;
    });

    setSearchResults({ services: filteredServices, providers: filteredProviders });
    setSearchPerformed(true);
    
    // Scroll to search results
    setTimeout(() => {
      searchResultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const checkPriceRange = (price, priceRange) => {
    switch (priceRange) {
      case '0-50': return price <= 50;
      case '50-100': return price > 50 && price <= 100;
      case '100-200': return price > 100 && price <= 200;
      case '200+': return price > 200;
      default: return true;
    }
  };
  const handleFilterChange = (filters) => {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SkeletonLoader variant="heading" className="h-16 w-64" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO */}
    <section className="relative h-[90vh] flex items-center">

      <HeroSlider slides={heroSlides} />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="grid lg:grid-cols-2 gap-12 items-center text-white">

          {/* LEFT SIDE */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <p>Find Trusted Local</p>
              <span className="text-primary-400 cursor-pointer hover:text-primary-300 transition-colors" onMouseEnter={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>Service</span>
              <span className="text-primary-400 cursor-pointer hover:text-primary-300 transition-colors" onMouseEnter={() => document.getElementById('providers-section')?.scrollIntoView({ behavior: 'smooth' })}> Providers</span>
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Book verified professionals for home services, repairs, and maintenance with confidence.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:ml-auto w-full max-w-xl">

            <div className="flex flex-wrap gap-4 mb-6">
              <Button size="lg" className="hover:scale-105 transition-all" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Find Services
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-all"
                onClick={() => navigate('/providers')}
              >
                Become Provider
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6">
              <AdvancedSearch
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
            </div>

          </div>

        </div>

      </div>

    </section>

      {/* SEARCH RESULTS */}
      {searchPerformed && (
        <section ref={searchResultsRef} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Search Results</h2>
              <p className="text-gray-600 mt-4">
                Found {searchResults.services.length + searchResults.providers.length} results
              </p>
            </div>

            {searchResults.services.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-8">Services ({searchResults.services.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {searchResults.services.map(service => (
                    <div key={service.id} className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.providers.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-semibold mb-8">Providers ({searchResults.providers.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {searchResults.providers.map(provider => (
                    <div key={provider.id} className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                      <ProviderCard provider={provider} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.services.length === 0 && searchResults.providers.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* POPULAR SERVICES */}
      <section id="services-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Popular Services</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover the most requested services from verified professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0,8).map(service => (
              <div key={service.id} className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">View All Services</Button>
            </Link>
          </div>

        </div>
      </section>

      {/* TOP PROVIDERS */}
      <section id="providers-section" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Top Rated Providers</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Skilled professionals trusted by thousands of customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {providers.slice(0,8).map(provider => (
              <div key={provider.id} className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/providers">
              <Button size="lg">Browse Providers</Button>
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-gray-600 mt-4">Book services in just a few simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-10">

            {[1,2,3,4].map(step => (
              <Card key={step} className="text-center p-8 rounded-2xl hover:shadow-xl transition-all">

                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step}
                </div>

                <h3 className="font-semibold text-lg">Step {step}</h3>

                <p className="text-gray-600 mt-2 text-sm">
                  Search providers, compare ratings, book instantly and get the job done.
                </p>

              </Card>
            ))}

          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[1,2,3].map(i => (

              <Card key={i} className="p-6 rounded-2xl hover:shadow-xl transition-all">

                <div className="flex items-center gap-3 mb-4">
                  <Avatar size="lg" />

                  <div>
                    <div className="font-semibold">Customer Name</div>
                    <RatingStars rating={5} size="sm" />
                  </div>
                </div>

                <p className="text-gray-600 text-sm">
                  "Amazing service experience. Highly professional and reliable."
                </p>

              </Card>

            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold">
            Ready to book your first service?
          </h2>

          <p className="mt-6 text-white/80">
            Join thousands of customers using our platform to find trusted professionals.
          </p>

          <div className="mt-10 flex justify-center gap-6">

            <Button size="lg" className="bg-white text-primary-600 hover:scale-105 transition-all" onClick={() => navigate('/providers')}>
              Find Providers
            </Button>

            <Button size="lg" variant="outline" className="border-white text-primary-600 hover:scale-105 transition-all" onClick={() => navigate('/providers')}>
              Become Provider
            </Button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
