import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, idSchema, paginationSchema, searchSchema, serviceCreateSchema } from '../middleware/validation.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services - Get all services with filtering, pagination, and search
router.get('/', validate(paginationSchema.merge(searchSchema), 'query'), async (req, res) => {
  try {
    const { page, limit, search, category, minRating, maxRating } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Get services with provider count and average rating
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        include: {
          providers: {
            include: {
              provider: {
                select: {
                  id: true,
                  rating: true,
                  location: true,
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              providers: true,
              bookings: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.service.count({ where }),
    ]);

    // Process services to add aggregated data
    const processedServices = services.map(service => {
      const providers = service.providers.map(ps => ps.provider);
      const avgRating = providers.length > 0 
        ? providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length 
        : 0;

      // Filter by rating if specified
      if ((minRating && avgRating < minRating) || (maxRating && avgRating > maxRating)) {
        return null;
      }

      return {
        id: service.id,
        name: service.name,
        icon: service.icon,
        description: service.description,
        category: service.category,
        price: service.price,
        averageRating: parseFloat(avgRating.toFixed(1)),
        providerCount: service._count.providers,
        bookingCount: service._count.bookings,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    }).filter(Boolean); // Remove null services that don't meet rating criteria

    // Recalculate total after rating filter
    const filteredTotal = processedServices.length;

    res.json({
      services: processedServices,
      pagination: {
        page,
        limit,
        total: filteredTotal,
        pages: Math.ceil(filteredTotal / limit),
        hasNext: page * limit < filteredTotal,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch services',
    });
  }
});

// GET /api/services/:id - Get service by ID with providers
router.get('/:id', validate(idSchema, 'params'), async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        providers: {
          include: {
            provider: {
              select: {
                id: true,
                rating: true,
                location: true,
                experience: true,
                description: true,
                availability: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            providers: true,
            bookings: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
      });
    }

    // Process providers data
    const providers = service.providers.map(ps => ({
      ...ps.provider,
      servicePrice: ps.price,
    }));

    // Calculate average rating
    const avgRating = providers.length > 0 
      ? providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length 
      : 0;

    const response = {
      id: service.id,
      name: service.name,
      icon: service.icon,
      description: service.description,
      category: service.category,
      price: service.price,
      averageRating: parseFloat(avgRating.toFixed(1)),
      providerCount: service._count.providers,
      bookingCount: service._count.bookings,
      providers,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };

    res.json(response);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch service',
    });
  }
});

// GET /api/services/categories - Get all unique service categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.service.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    const categoryList = categories.map(cat => ({
      name: cat.category,
      count: cat._count.category,
    }));

    res.json({
      categories: categoryList,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch categories',
    });
  }
});

// POST /api/services - Create new service (Admin only)
router.post('/', validate(serviceCreateSchema), async (req, res) => {
  try {
    const { name, description, category, price, icon } = req.body;

    // Check if service already exists
    const existingService = await prisma.service.findUnique({
      where: { name },
    });

    if (existingService) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Service with this name already exists',
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        price,
        icon,
      },
    });

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create service',
    });
  }
});

export default router;
