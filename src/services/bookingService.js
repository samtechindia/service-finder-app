import api from './api';

class BookingService {
  // Create new booking
  async createBooking(bookingData) {
    try {
      // In a real app, this would be: api.post('/bookings', bookingData);
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBooking = {
            id: Date.now(),
            ...bookingData,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          resolve(newBooking);
        }, 500);
      });
    } catch (error) {
      throw new Error('Failed to create booking');
    }
  }

  // Get user's bookings
  async getUserBookings(userId) {
    try {
      // In a real app, this would be: api.get(`/bookings?userId=${userId}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock bookings data
          const mockBookings = [
            {
              id: 1,
              userId: userId,
              providerId: 1,
              providerName: 'Ramesh Sharma',
              serviceType: 'Electrician',
              date: '2024-02-15',
              time: '10:00 AM',
              status: 'confirmed',
              address: '123 Main Street, City',
              description: 'Need to fix electrical wiring in living room',
              createdAt: '2024-02-10T10:30:00Z'
            },
            {
              id: 2,
              userId: userId,
              providerId: 2,
              providerName: 'Amit Patel',
              serviceType: 'Plumber',
              date: '2024-02-20',
              time: '2:00 PM',
              status: 'pending',
              address: '456 Oak Avenue, City',
              description: 'Kitchen sink repair needed',
              createdAt: '2024-02-08T14:15:00Z'
            }
          ];
          resolve(mockBookings);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      // In a real app, this would be: api.get(`/bookings/${bookingId}`);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock booking data
          const mockBooking = {
            id: bookingId,
            providerId: 1,
            providerName: 'Ramesh Sharma',
            serviceType: 'Electrician',
            date: '2024-02-15',
            time: '10:00 AM',
            status: 'confirmed',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '+91 98765 43210',
            address: '123 Main Street, City',
            description: 'Need to fix electrical wiring in living room',
            createdAt: '2024-02-10T10:30:00Z',
            updatedAt: '2024-02-10T11:00:00Z'
          };
          
          if (bookingId === 1 || bookingId === 2) {
            resolve(mockBooking);
          } else {
            reject(new Error('Booking not found'));
          }
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch booking details');
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      // In a real app, this would be: api.patch(`/bookings/${bookingId}/status`, { status });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: `Booking status updated to ${status}` });
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to update booking status');
    }
  }

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    try {
      // In a real app, this would be: api.post(`/bookings/${bookingId}/cancel`, { reason });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Booking cancelled successfully' });
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to cancel booking');
    }
  }

  // Reschedule booking
  async rescheduleBooking(bookingId, newDate, newTime) {
    try {
      // In a real app, this would be: api.patch(`/bookings/${bookingId}/reschedule`, { date: newDate, time: newTime });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Booking rescheduled successfully' });
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to reschedule booking');
    }
  }

  // Get available time slots for a provider on a specific date
  async getAvailableTimeSlots(providerId, date) {
    try {
      // In a real app, this would be: api.get(`/providers/${providerId}/availability?date=${date}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock available time slots
          const allTimeSlots = [
            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
          ];
          
          // Mock some time slots as unavailable
          const unavailableSlots = ['12:00 PM', '3:00 PM'];
          const availableSlots = allTimeSlots.filter(slot => !unavailableSlots.includes(slot));
          
          resolve(availableSlots);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch available time slots');
    }
  }

  // Add booking review (after service completion)
  async addBookingReview(bookingId, reviewData) {
    try {
      // In a real app, this would be: api.post(`/bookings/${bookingId}/review`, reviewData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Review added successfully' });
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to add booking review');
    }
  }

  // Get provider's bookings (for provider dashboard)
  async getProviderBookings(providerId) {
    try {
      // In a real app, this would be: api.get(`/bookings?providerId=${providerId}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock provider bookings
          const mockBookings = [
            {
              id: 1,
              providerId: providerId,
              customerName: 'John Doe',
              serviceType: 'Electrician',
              date: '2024-02-15',
              time: '10:00 AM',
              status: 'confirmed',
              address: '123 Main Street, City',
              description: 'Need to fix electrical wiring in living room'
            },
            {
              id: 3,
              providerId: providerId,
              customerName: 'Mike Johnson',
              serviceType: 'Electrician',
              date: '2024-02-16',
              time: '2:00 PM',
              status: 'pending',
              address: '789 Pine Road, City',
              description: 'Install ceiling fan in bedroom'
            }
          ];
          resolve(mockBookings);
        }, 300);
      });
    } catch (error) {
      throw new Error('Failed to fetch provider bookings');
    }
  }
}

export default new BookingService();
