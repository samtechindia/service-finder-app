import api from './api';
import providersData from '../mock/providers.json';

class ProviderService {
  // Get all providers (mock implementation for now)
  async getAllProviders() {
    try {
      // In a real app, this would be: api.get('/providers');
      return new Promise((resolve) => {
        setTimeout(() => resolve(providersData), 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch providers');
    }
  }

  // Get provider by ID
  async getProviderById(id) {
    try {
      // In a real app, this would be: api.get(`/providers/${id}`);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const provider = providersData.find(p => p.id === parseInt(id));
          if (provider) {
            resolve(provider);
          } else {
            reject(new Error('Provider not found'));
          }
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch provider details');
    }
  }

  // Get providers by service type
  async getProvidersByService(serviceType) {
    try {
      // In a real app, this would be: api.get(`/providers?service=${serviceType}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredProviders = providersData.filter(p => p.service === serviceType);
          resolve(filteredProviders);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch providers by service');
    }
  }

  // Search providers
  async searchProviders(query) {
    try {
      // In a real app, this would be: api.get(`/providers/search?q=${query}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const searchResults = providersData.filter(provider =>
            provider.name.toLowerCase().includes(query.toLowerCase()) ||
            provider.service.toLowerCase().includes(query.toLowerCase()) ||
            provider.location.toLowerCase().includes(query.toLowerCase())
          );
          resolve(searchResults);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to search providers');
    }
  }

  // Get top rated providers
  async getTopRatedProviders(limit = 5) {
    try {
      // In a real app, this would be: api.get(`/providers/top-rated?limit=${limit}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          const topProviders = [...providersData]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
          resolve(topProviders);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch top rated providers');
    }
  }

  // Add provider review (for future implementation)
  async addProviderReview(providerId, reviewData) {
    try {
      // In a real app, this would be: api.post(`/providers/${providerId}/reviews`, reviewData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Review added successfully' });
        }, 500);
      });
    } catch (error) {
      throw new Error('Failed to add review');
    }
  }

  // Get provider reviews (for future implementation)
  async getProviderReviews(providerId) {
    try {
      // In a real app, this would be: api.get(`/providers/${providerId}/reviews`);
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock reviews data
          const mockReviews = [
            {
              id: 1,
              customerName: 'John Doe',
              rating: 5,
              comment: 'Excellent service! Very professional and knowledgeable.',
              date: '2024-01-15'
            },
            {
              id: 2,
              customerName: 'Jane Smith',
              rating: 4,
              comment: 'Good work done on time. Would recommend.',
              date: '2024-01-10'
            }
          ];
          resolve(mockReviews);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch provider reviews');
    }
  }
}

export default new ProviderService();
