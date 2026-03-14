import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Services API
export const servicesAPI = {
  getServices: (params = {}) => api.get('/services', { params }),
  getService: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories/list'),
  createService: (serviceData) => api.post('/services', serviceData),
};

// Providers API
export const providersAPI = {
  getProviders: (params = {}) => api.get('/providers', { params }),
  getProvider: (id) => api.get(`/providers/${id}`),
  getCurrentProvider: () => api.get('/providers/me'),
  updateProvider: (id, data) => api.put(`/providers/${id}`, data),
  addService: (id, serviceData) => api.post(`/providers/${id}/services`, serviceData),
  removeService: (id, serviceId) => api.delete(`/providers/${id}/services/${serviceId}`),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params = {}) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params = {}) => api.get('/reviews', { params }),
  getReview: (id) => api.get(`/reviews/${id}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Error handling helper
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  console.error('API Error:', error);
  return message;
};

export default api;
