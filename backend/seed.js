// Database seed script
// Run with: npm run db:seed

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import providers from '../src/mock/providers.json' assert { type: 'json' };
import services from '../src/mock/services.json' assert { type: 'json' };

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Services first
  console.log('📝 Creating services...');
  const createdServices = {};
  
  for (const serviceData of services) {
    const service = await prisma.service.create({
      data: {
        id: `service_${serviceData.id}`,
        name: serviceData.name,
        icon: serviceData.icon || null,
        description: serviceData.description,
        category: serviceData.category,
        price: serviceData.price || null,
      },
    });
    createdServices[serviceData.name] = service;
    console.log(`✅ Created service: ${service.name}`);
  }

  // 2. Create Users and Providers
  console.log('👥 Creating users and providers...');
  
  for (const providerData of providers) {
    // Create User account for provider
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: providerData.email,
        password: hashedPassword,
        name: providerData.name,
        phone: providerData.phone,
        role: 'PROVIDER',
      },
    });

    // Create Provider profile
    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        rating: providerData.rating || 0,
        location: providerData.location,
        experience: providerData.experience || null,
        description: providerData.description || null,
        availability: providerData.availability || null,
      },
    });

    // Link Provider to Service
    const service = createdServices[providerData.service];
    if (service) {
      await prisma.providerService.create({
        data: {
          providerId: provider.id,
          serviceId: service.id,
          price: service.price, // Use service base price
        },
      });
    }

    console.log(`✅ Created provider: ${providerData.name} (${providerData.service})`);
  }

  // 3. Create a sample customer user
  console.log('👤 Creating sample customer...');
  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      phone: '+91 98765 43200',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Created sample customer: customer@example.com');

  // 4. Create sample bookings and reviews
  console.log('📅 Creating sample bookings and reviews...');
  
  const allProviders = await prisma.provider.findMany({
    include: { services: { include: { service: true } } }
  });

  for (let i = 0; i < 3; i++) {
    const provider = allProviders[i];
    if (provider && provider.services.length > 0) {
      const service = provider.services[0].service;
      
      // Create booking
      const booking = await prisma.booking.create({
        data: {
          customerId: customer.id,
          providerId: provider.id,
          serviceId: service.id,
          status: 'COMPLETED',
          scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        },
      });

      // Create review for completed booking
      await prisma.review.create({
        data: {
          customerId: customer.id,
          providerId: provider.id,
          bookingId: booking.id,
          rating: 4 + Math.random(), // Random rating between 4-5
          comment: `Great service! ${provider.name} was very professional.`,
        },
      });

      console.log(`✅ Created booking and review for ${provider.name}`);
    }
  }

  // 5. Create sample knowledge base articles
  console.log('📚 Creating sample knowledge base...');
  
  await Promise.all([
    prisma.knowledge.create({
      data: {
        title: 'How to Choose a Service Provider',
        keywords: 'provider, selection, tips, guide',
        content: 'When choosing a service provider, consider their experience, reviews, pricing, and availability. Always ask for references and verify their credentials.',
        language: 'en'
      }
    }),
    prisma.knowledge.create({
      data: {
        title: 'Understanding Service Categories',
        keywords: 'categories, services, types, help',
        content: 'Our platform offers various service categories including electrical, plumbing, HVAC, carpentry, painting, and cleaning services. Each category has specialized providers.',
        language: 'en'
      }
    }),
    prisma.knowledge.create({
      data: {
        title: 'Booking Process Guide',
        keywords: 'booking, process, steps, howto',
        content: 'To book a service: 1) Browse providers by category, 2) Check availability and ratings, 3) Select a provider, 4) Schedule your service, 5) Confirm booking details.',
        language: 'en'
      }
    })
  ]);

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- Services: ${Object.keys(createdServices).length}`);
  console.log(`- Providers: ${providers.length}`);
  console.log(`- Customers: 1`);
  console.log(`- Sample Bookings: 3`);
  console.log(`- Knowledge Articles: 3`);
  console.log('\n🔑 Login credentials:');
  console.log('- Customer: customer@example.com / customer123');
  console.log('- Providers: use their email / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
