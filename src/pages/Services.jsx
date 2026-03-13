import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import SearchBar from '../components/SearchBar';
import servicesData from '../mock/services.json';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    setServices(servicesData);
    setFilteredServices(servicesData);
  }, []);

  const handleSearch = (searchData) => {
    const { term, category } = searchData;
    let filtered = services;
    
    // Filter by category if not 'all'
    if (category && category !== 'all') {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(category.toLowerCase()) ||
        service.description.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Filter by search term
    if (term) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(term.toLowerCase()) ||
        service.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Choose from our comprehensive range of professional services. Each service is delivered by verified and experienced professionals.
          </p>
          
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} placeholder="Search services..." />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your search.</p>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Service</h3>
              <p className="text-gray-600 text-sm">Select the service you need from our categories</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Find Providers</h3>
              <p className="text-gray-600 text-sm">Browse verified providers in your area</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Book Service</h3>
              <p className="text-gray-600 text-sm">Schedule an appointment at your convenience</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Service</h3>
              <p className="text-gray-600 text-sm">Enjoy professional service at your doorstep</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
