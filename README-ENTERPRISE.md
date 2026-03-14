# Service Platform - Enterprise Marketplace

A fully dynamic, enterprise-ready service marketplace built with React frontend and Node.js/Express + Prisma backend with PostgreSQL.

## 🚀 Features

### Backend (Node.js + Express + Prisma)
- **Authentication**: JWT-based auth with role-based access (Customer, Provider, Admin)
- **API Endpoints**: Complete REST API for services, providers, bookings, and reviews
- **Validation**: Input validation using Zod schemas
- **Security**: Helmet, CORS, rate limiting, and secure headers
- **Database**: PostgreSQL with Prisma ORM and enterprise-ready schema
- **Error Handling**: Comprehensive error handling and logging
- **Deployment**: Vercel serverless functions ready

### Frontend (React + Vite)
- **Dynamic Data**: All data fetched from APIs (no static JSON)
- **Authentication**: Complete auth flow with context management
- **UI Components**: Modern UI with Tailwind CSS and shadcn/ui components
- **Loading States**: Skeleton loaders and error handling
- **Responsive Design**: Mobile-first responsive design
- **Toast Notifications**: User feedback with react-toastify

### Enterprise Features
- **Role-based Access**: Customers, Providers, and Admin roles
- **Pagination**: Server-side pagination for all lists
- **Search & Filtering**: Advanced search and filtering capabilities
- **Reviews & Ratings**: Complete review system with ratings
- **Booking Management**: Full booking lifecycle management

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Services
- `GET /api/services` - Get all services (with pagination, search, filters)
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/categories/list` - Get all categories
- `POST /api/services` - Create new service (Admin only)

### Providers
- `GET /api/providers` - Get all providers (with pagination, search, filters)
- `GET /api/providers/:id` - Get provider by ID with details
- `PUT /api/providers/:id` - Update provider profile
- `POST /api/providers/:id/services` - Add service to provider
- `DELETE /api/providers/:id/services/:serviceId` - Remove service

### Bookings
- `GET /api/bookings` - Get user bookings (filtered by role)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking (Customer only)
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `GET /api/reviews` - Get reviews (with filters)
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review (Customer only)
- `PUT /api/reviews/:id` - Update review (own reviews only)
- `DELETE /api/reviews/:id` - Delete review

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcrypt

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **State Management**: React Context
- **Notifications**: react-toastify
- **Forms**: react-hook-form + zod

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd service-platform
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, JWT_SECRET
```

4. **Database Setup**
```bash
# Generate Prisma client
cd backend
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
cd ..
```

5. **Start Development Servers**
```bash
# Start backend server (port 3001)
cd backend
npm run dev

# Start frontend server (port 5173)
cd ..
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@localhost:5432/service_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Environment Variables**
Set the following in Vercel dashboard:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Your JWT secret key
- `NODE_ENV` - Set to `production`

### Database Setup for Production

1. **Create PostgreSQL database** (recommended: Supabase, Railway, or Neon)
2. **Run migrations**
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## 📊 Database Schema

### Core Models
- **User**: Authentication and user management
- **Provider**: Service provider profiles
- **Service**: Available services
- **ProviderService**: Many-to-many relationship between providers and services
- **Booking**: Service bookings with status tracking
- **Review**: Customer reviews and ratings
- **Knowledge**: Knowledge base articles

### User Roles
- `CUSTOMER`: Can book services and leave reviews
- `PROVIDER`: Can manage profile, services, and bookings
- `ADMIN`: Full system access

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Role-based Access**: Proper authorization checks

## 🧪 Testing

### API Testing
```bash
# Install testing dependencies
npm install -g supertest

# Run API tests
npm test
```

### Manual Testing
Use Postman or similar tool with the following collection:
- Import the API endpoints
- Set base URL to `http://localhost:3001/api`
- Test authentication flows
- Verify role-based access

## 📝 Development Notes

### Code Structure
```
├── backend/
│   ├── index.js              # Main server file
│   ├── middleware/           # Auth and validation middleware
│   ├── routes/              # API route handlers
│   ├── prisma/              # Database schema and migrations
│   └── seed.js              # Database seeding script
├── src/
│   ├── components/          # React components
│   ├── context/             # React contexts
│   ├── pages/               # Page components
│   ├── services/            # API client
│   └── App.jsx              # Main app component
└── public/                  # Static assets
```

### API Response Format
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Handling
All API errors return consistent format:
```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": { ... } // Optional validation errors
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting guide
2. Review the API documentation
3. Create an issue with detailed information

---

**Built with ❤️ for modern service marketplaces**
