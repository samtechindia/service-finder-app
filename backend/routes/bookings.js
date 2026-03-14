import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, idSchema, paginationSchema, bookingCreateSchema, bookingUpdateSchema } from '../middleware/validation.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/bookings - Get bookings (filtered by user role)
router.get('/', authenticateToken, validate(paginationSchema, 'query'), async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    let where = {};

    // Filter bookings based on user role
    if (req.user.role === 'CUSTOMER') {
      where.customerId = userId;
    } else if (req.user.role === 'PROVIDER') {
      // Get provider ID for this user
      const provider = await prisma.provider.findUnique({
        where: { userId },
        select: { id: true },
      });
      
      if (provider) {
        where.providerId = provider.id;
      } else {
        // If user is provider but has no provider profile, return empty
        return res.json({
          bookings: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
            hasNext: false,
            hasPrev: false,
          },
        });
      }
    }
    // Admin can see all bookings (no filter)

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          provider: {
            include: {
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
          service: {
            select: {
              id: true,
              name: true,
              category: true,
              icon: true,
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch bookings',
    });
  }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', validate(idSchema, 'params'), authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          include: {
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
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            icon: true,
            price: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    // Check if user has permission to view this booking
    const hasPermission = 
      req.user.role === 'ADMIN' ||
      booking.customerId === userId ||
      booking.provider.userId === userId;

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to view this booking',
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch booking',
    });
  }
});

// POST /api/bookings - Create new booking (Customer only)
router.post('/', authenticateToken, requireRole(['CUSTOMER']), validate(bookingCreateSchema), async (req, res) => {
  try {
    const { providerId, serviceId, scheduledAt } = req.body;
    const customerId = req.user.id;

    // Verify provider exists and get service price
    const providerService = await prisma.providerService.findUnique({
      where: {
        providerId_serviceId: {
          providerId,
          serviceId,
        },
      },
      include: {
        provider: true,
        service: true,
      },
    });

    if (!providerService) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Provider does not offer this service',
      });
    }

    // Check if customer already has a pending booking with this provider for the same service
    const existingBooking = await prisma.booking.findFirst({
      where: {
        customerId,
        providerId,
        serviceId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'You already have an active booking for this service with this provider',
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        providerId,
        serviceId,
        scheduledAt: new Date(scheduledAt),
        status: 'PENDING',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          include: {
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
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            icon: true,
            price: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create booking',
    });
  }
});

// PUT /api/bookings/:id - Update booking status
router.put('/:id', validate(idSchema, 'params'), authenticateToken, validate(bookingUpdateSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    // Check permissions and validate status transitions
    const isCustomer = existingBooking.customerId === userId;
    const isProvider = existingBooking.provider.userId === userId;
    const isAdmin = req.user.role === 'ADMIN';

    let hasPermission = false;
    let validStatuses = [];

    if (isCustomer) {
      hasPermission = true;
      validStatuses = ['CANCELLED']; // Customers can only cancel
    } else if (isProvider) {
      hasPermission = true;
      validStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']; // Providers can manage workflow
    } else if (isAdmin) {
      hasPermission = true;
      validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']; // Admin can do anything
    }

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this booking',
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `You cannot change booking status to ${status}`,
      });
    }

    // Prepare update data
    const updateData = { status };

    // Add completedAt timestamp if status is COMPLETED
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          include: {
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
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            icon: true,
            price: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update booking',
    });
  }
});

// DELETE /api/bookings/:id - Cancel booking (Customer only)
router.delete('/:id', validate(idSchema, 'params'), authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Booking not found',
      });
    }

    // Only customers can cancel their own bookings (or admin)
    const hasPermission = 
      req.user.role === 'ADMIN' ||
      (booking.customerId === userId && req.user.role === 'CUSTOMER');

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only cancel your own bookings',
      });
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot cancel booking that is already in progress or completed',
      });
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          include: {
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
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            icon: true,
          },
        },
      },
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to cancel booking',
    });
  }
});

export default router;
