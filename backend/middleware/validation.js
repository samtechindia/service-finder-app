import { z } from 'zod';

// Common validation schemas
export const idSchema = z.string().cuid('Invalid ID format');

export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('10'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minRating: z.string().transform(Number).pipe(z.number().min(0).max(5)).optional(),
  maxRating: z.string().transform(Number).pipe(z.number().min(0).max(5)).optional(),
});

// Auth validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']).default('CUSTOMER'),
  // Provider-specific fields (optional for customers, required for providers)
  service: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  availability: z.string().optional(),
}).refine(data => {
  if (data.role === 'PROVIDER') {
    return data.service && data.location && data.experience && data.description;
  }
  return true;
}, {
  message: "Service, location, experience, and description are required for providers",
  path: ["service"]
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Service validation schemas
export const serviceCreateSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  icon: z.string().optional(),
});

// Provider validation schemas
export const providerUpdateSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  experience: z.string().optional(),
  description: z.string().optional(),
  availability: z.string().optional(),
});

export const providerServiceSchema = z.object({
  serviceId: z.string().cuid('Invalid service ID'),
  price: z.number().min(0, 'Price must be non-negative'),
});

// Booking validation schemas
export const bookingCreateSchema = z.object({
  providerId: z.string().cuid('Invalid provider ID'),
  serviceId: z.string().cuid('Invalid service ID'),
  scheduledAt: z.string().datetime('Invalid date format'),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

// Review validation schemas
export const reviewCreateSchema = z.object({
  providerId: z.string().cuid('Invalid provider ID'),
  bookingId: z.string().cuid('Invalid booking ID').optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

// Validation middleware factory
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let data;
      
      switch (source) {
        case 'body':
          data = req.body;
          break;
        case 'query':
          data = req.query;
          break;
        case 'params':
          data = req.params;
          break;
        default:
          data = req.body;
      }

      const validatedData = schema.parse(data);
      
      // Replace the request data with validated data
      switch (source) {
        case 'body':
          req.body = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
      }
      
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation failed',
      });
    }
  };
};

// Error handling utility
export const handleValidationError = (error) => {
  if (error.name === 'ZodError') {
    return {
      status: 400,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }
  return {
    status: 500,
    error: 'Internal Server Error',
    message: 'Validation failed',
  };
};
