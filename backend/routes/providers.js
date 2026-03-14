import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, idSchema, paginationSchema, searchSchema, providerUpdateSchema, providerServiceSchema } from '../middleware/validation.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/providers - Get all providers with filtering, pagination, and search
router.get('/', validate(paginationSchema.merge(searchSchema), 'query'), optionalAuth, async (req, res) => {
  try {
    const { page, limit, search, category, location, minRating, maxRating } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { experience: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) where.rating.gte = parseFloat(minRating);
      if (maxRating) where.rating.lte = parseFloat(maxRating);
    }

    // Get providers with their services and reviews
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true,
            },
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  icon: true,
                },
              },
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              customer: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 5, // Latest 5 reviews
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
      }),
      prisma.provider.count({ where }),
    ]);

    // Filter by category if specified
    let processedProviders = providers;
    if (category) {
      processedProviders = providers.filter(provider =>
        provider.services.some(ps => ps.service.category.toLowerCase().includes(category.toLowerCase()))
      );
    }

    // Process providers data
    const responseProviders = processedProviders.map(provider => {
      const services = provider.services.map(ps => ({
        ...ps.service,
        providerPrice: ps.price,
      }));

      return {
        id: provider.id,
        userId: provider.userId,
        rating: provider.rating || 0,
        location: provider.location,
        experience: provider.experience,
        description: provider.description,
        availability: provider.availability,
        user: provider.user,
        services,
        reviews: provider.reviews,
        bookingCount: provider._count.bookings,
        reviewCount: provider._count.reviews,
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      };
    });

    res.json({
      providers: responseProviders,
      pagination: {
        page,
        limit,
        total: category ? responseProviders.length : total,
        pages: Math.ceil((category ? responseProviders.length : total) / limit),
        hasNext: page * limit < (category ? responseProviders.length : total),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch providers',
    });
  }
});

// GET /api/providers/me - Get current provider's profile and stats (Provider only)
router.get('/me', authenticateToken, requireRole(['PROVIDER']), async (req, res) => {
  try {
    const userId = req.user.id;

    // Find provider profile for this user
    const provider = await prisma.provider.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 reviews
        },
        bookings: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
            price: true,
            finalPrice: true,
            address: true,
            description: true,
            urgency: true,
            customer: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            service: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Provider profile not found',
      });
    }

    // Calculate stats
    const completedBookings = provider.bookings.filter(b => b.status === 'COMPLETED');
    const activeBookings = provider.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
    const pendingRequests = provider.bookings.filter(b => b.status === 'PENDING');
    
    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + (booking.finalPrice || booking.price || 0);
    }, 0);

    const totalClients = new Set(completedBookings.map(b => b.customerId)).size;

    const stats = {
      totalEarnings,
      activeJobs: activeBookings.length,
      completedJobs: completedBookings.length,
      averageRating: provider.rating || 0,
      totalClients,
      totalBookings: provider._count.bookings,
      totalReviews: provider._count.reviews,
    };

    res.json({
      provider,
      stats,
      recentRequests: pendingRequests.slice(0, 5),
      upcomingJobs: activeBookings.slice(0, 5),
    });
  } catch (error) {
    console.error('Get provider me error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch provider data',
    });
  }
});

// GET /api/providers/:id - Get provider by ID with detailed info
router.get('/:id', validate(idSchema, 'params'), optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
            booking: {
              select: {
                id: true,
                scheduledAt: true,
                completedAt: true,
                service: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
            service: {
              select: {
                name: true,
              },
            },
            customer: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 bookings
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Provider not found',
      });
    }

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0]; // 1-5 stars
    provider.reviews.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating - 1]++;
      }
    });

    const response = {
      id: provider.id,
      userId: provider.userId,
      rating: provider.rating || 0,
      location: provider.location,
      experience: provider.experience,
      description: provider.description,
      availability: provider.availability,
      user: provider.user,
      services: provider.services.map(ps => ({
        ...ps.service,
        providerPrice: ps.price,
      })),
      reviews: provider.reviews,
      recentBookings: provider.bookings,
      stats: {
        totalBookings: provider._count.bookings,
        totalReviews: provider._count.reviews,
        ratingDistribution,
      },
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };

    res.json(response);
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch provider',
    });
  }
});

// PUT /api/providers/:id - Update provider profile (Provider only)
router.put('/:id', validate(idSchema, 'params'), authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validate(providerUpdateSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { location, experience, description, availability } = req.body;

    // Check if user owns this provider profile (unless admin)
    if (req.user.role !== 'ADMIN') {
      const provider = await prisma.provider.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!provider || provider.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own provider profile',
        });
      }
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        location,
        experience,
        description,
        availability,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    res.json({
      message: 'Provider profile updated successfully',
      provider: updatedProvider,
    });
  } catch (error) {
    console.error('Update provider error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update provider profile',
    });
  }
});

// POST /api/providers/:id/services - Add service to provider (Provider only)
router.post('/:id/services', validate(idSchema, 'params'), authenticateToken, requireRole(['PROVIDER', 'ADMIN']), validate(providerServiceSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, price } = req.body;

    // Check if user owns this provider profile (unless admin)
    if (req.user.role !== 'ADMIN') {
      const provider = await prisma.provider.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!provider || provider.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only add services to your own provider profile',
        });
      }
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
      });
    }

    // Check if provider already has this service
    const existingProviderService = await prisma.providerService.findUnique({
      where: {
        providerId_serviceId: {
          providerId: id,
          serviceId,
        },
      },
    });

    if (existingProviderService) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Provider already offers this service',
      });
    }

    const providerService = await prisma.providerService.create({
      data: {
        providerId: id,
        serviceId,
        price,
      },
      include: {
        service: true,
      },
    });

    res.status(201).json({
      message: 'Service added to provider successfully',
      providerService,
    });
  } catch (error) {
    console.error('Add provider service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add service to provider',
    });
  }
});

// DELETE /api/providers/:id/services/:serviceId - Remove service from provider (Provider only)
router.delete('/:id/services/:serviceId', validate(idSchema, 'params'), authenticateToken, requireRole(['PROVIDER', 'ADMIN']), async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    // Check if user owns this provider profile (unless admin)
    if (req.user.role !== 'ADMIN') {
      const provider = await prisma.provider.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!provider || provider.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only remove services from your own provider profile',
        });
      }
    }

    const providerService = await prisma.providerService.delete({
      where: {
        providerId_serviceId: {
          providerId: id,
          serviceId,
        },
      },
    });

    res.json({
      message: 'Service removed from provider successfully',
      providerService,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Provider service not found',
      });
    }

    console.error('Remove provider service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to remove service from provider',
    });
  }
});

export default router;
