import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate, idSchema, paginationSchema, reviewCreateSchema } from '../middleware/validation.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reviews - Get reviews (filtered by provider or customer)
router.get('/', validate(paginationSchema, 'query'), async (req, res) => {
  try {
    const { page, limit, providerId, customerId } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    let where = {};

    if (providerId) {
      where.providerId = providerId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          provider: {
            select: {
              id: true,
              location: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          booking: {
            select: {
              id: true,
              scheduledAt: true,
              completedAt: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      reviews,
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
    console.error('Get reviews error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch reviews',
    });
  }
});

// GET /api/reviews/:id - Get review by ID
router.get('/:id', validate(idSchema, 'params'), async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            location: true,
            experience: true,
            description: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            scheduledAt: true,
            completedAt: true,
            status: true,
            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Review not found',
      });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch review',
    });
  }
});

// POST /api/reviews - Create new review (Customer only, for completed bookings)
router.post('/', authenticateToken, requireRole(['CUSTOMER']), validate(reviewCreateSchema), async (req, res) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;
    const customerId = req.user.id;

    // If bookingId is provided, verify it exists and belongs to this customer
    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          provider: true,
          customer: true,
          service: true,
        },
      });

      if (!booking) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Booking not found',
        });
      }

      // Verify booking belongs to this customer and the specified provider
      if (booking.customerId !== customerId || booking.providerId !== providerId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Invalid booking or provider combination',
        });
      }

      // Verify booking is completed
      if (booking.status !== 'COMPLETED') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Can only review completed bookings',
        });
      }

      // Check if review already exists for this booking
      const existingReview = await prisma.review.findUnique({
        where: { bookingId },
      });

      if (existingReview) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Review already exists for this booking',
        });
      }
    } else {
      // If no bookingId, verify customer has completed bookings with this provider
      const completedBooking = await prisma.booking.findFirst({
        where: {
          customerId,
          providerId,
          status: 'COMPLETED',
        },
      });

      if (!completedBooking) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'You must have a completed booking with this provider to leave a review',
        });
      }
    }

    // Check if customer already reviewed this provider (without booking)
    const existingProviderReview = await prisma.review.findFirst({
      where: {
        customerId,
        providerId,
        bookingId: null, // General provider review
      },
    });

    if (existingProviderReview && !bookingId) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'You have already reviewed this provider',
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        customerId,
        providerId,
        bookingId,
        rating,
        comment,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            location: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        booking: booking ? {
          select: {
            id: true,
            scheduledAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        } : null,
      },
    });

    // Update provider's average rating
    const allProviderReviews = await prisma.review.findMany({
      where: { providerId },
      select: { rating: true },
    });

    const averageRating = allProviderReviews.reduce((sum, review) => sum + review.rating, 0) / allProviderReviews.length;

    await prisma.provider.update({
      where: { id: providerId },
      data: { rating: averageRating },
    });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create review',
    });
  }
});

// PUT /api/reviews/:id - Update review (Customer only, own reviews)
router.put('/:id', validate(idSchema, 'params'), authenticateToken, requireRole(['CUSTOMER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: {
        customerId: true,
        providerId: true,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Review not found',
      });
    }

    // Verify review belongs to this customer
    if (existingReview.customerId !== customerId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own reviews',
      });
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            location: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        booking: {
          select: {
            id: true,
            scheduledAt: true,
            completedAt: true,
            service: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // Update provider's average rating
    const allProviderReviews = await prisma.review.findMany({
      where: { providerId: existingReview.providerId },
      select: { rating: true },
    });

    const averageRating = allProviderReviews.reduce((sum, review) => sum + review.rating, 0) / allProviderReviews.length;

    await prisma.provider.update({
      where: { id: existingReview.providerId },
      data: { rating: averageRating },
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update review',
    });
  }
});

// DELETE /api/reviews/:id - Delete review (Customer only, own reviews or Admin)
router.delete('/:id', validate(idSchema, 'params'), authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get existing review
    const existingReview = await prisma.review.findUnique({
      where: { id },
      select: {
        customerId: true,
        providerId: true,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Review not found',
      });
    }

    // Check permissions (customer can delete own reviews, admin can delete any)
    const hasPermission = 
      req.user.role === 'ADMIN' ||
      (existingReview.customerId === userId && req.user.role === 'CUSTOMER');

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own reviews',
      });
    }

    const deletedReview = await prisma.review.delete({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        provider: {
          select: {
            id: true,
            location: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Update provider's average rating
    const remainingReviews = await prisma.review.findMany({
      where: { providerId: existingReview.providerId },
      select: { rating: true },
    });

    const averageRating = remainingReviews.length > 0 
      ? remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length 
      : 0;

    await prisma.provider.update({
      where: { id: existingReview.providerId },
      data: { rating: averageRating },
    });

    res.json({
      message: 'Review deleted successfully',
      review: deletedReview,
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete review',
    });
  }
});

export default router;
