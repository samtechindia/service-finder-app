import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { validate, signupSchema, loginSchema } from '../middleware/validation.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/signup - Register a new user
router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const { name, email, password, phone, role, service, location, experience, description, availability } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    // Create provider profile if role is PROVIDER
    if (role === 'PROVIDER') {
      // First find or create the service
      let serviceRecord = await prisma.service.findFirst({
        where: { name: service }
      });

      if (!serviceRecord) {
        // Create service if it doesn't exist
        serviceRecord = await prisma.service.create({
          data: {
            name: service,
            category: service.toLowerCase(),
            description: `${service} services`,
            price: 50, // Default price
          }
        });
      }

      // Create provider profile with all the required fields
      const provider = await prisma.provider.create({
        data: {
          userId: user.id,
          location: location || 'Not specified',
          experience: experience,
          description: description,
          availability: availability || 'flexible',
          rating: 0,
        },
      });

      // Add the service to the provider's services
      await prisma.providerService.create({
        data: {
          providerId: provider.id,
          serviceId: serviceRecord.id,
          price: 50, // Default price, can be updated later
        }
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user',
    });
  }
});

// POST /api/auth/login - Authenticate user
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate user',
    });
  }
});

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    // Verify token and get user
    const { verifyToken } = await import('../middleware/auth.js');
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        providerProfile: {
          select: {
            id: true,
            rating: true,
            location: true,
            experience: true,
            description: true,
            availability: true,
            createdAt: true,
            services: {
              select: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    price: true,
                  },
                },
                price: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user profile',
    });
  }
});

export default router;
