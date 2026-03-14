# Vercel Deployment Guide for Prisma + Supabase

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup
```bash
# In Vercel Dashboard → Project Settings → Environment Variables
# Add these variables:

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:5432/postgres
NODE_ENV=production
```

### 2. Build Configuration
Update `package.json` scripts for production:

```json
{
  "scripts": {
    "build": "vite build",
    "postbuild": "cd backend && npm run db:generate",
    "vercel-build": "npm run build && cd backend && npx prisma generate"
  }
}
```

### 3. Vercel Configuration
Update `vercel.json`:

```json
{
  "buildCommand": "npm run vercel-build",
  "functions": {
    "backend/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/$1"
    },
    {
      "source": "/((?!api|_next/static|_next/image|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🛠️ Deployment Steps

### Step 1: Install Vercel CLI
```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

### Step 2: Deploy Project
```powershell
# From project root
cd c:\serviceapp\service-platform

# Deploy to Vercel
vercel --prod

# Follow prompts to:
# - Link to existing Vercel project
# - Confirm build settings
# - Add environment variables
```

### Step 3: Verify Database Connection
```powershell
# Test production database
vercel env pull .env.production
node test-db-connection.js
```

## 🔧 Production Database Setup

### Supabase Production Settings
1. **Enable Connection Pooling** (recommended):
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:6543/postgres?pgbouncer=true"
   ```

2. **Configure IP Allowlist** (if needed):
   - Go to Supabase Dashboard → Settings → Database
   - Add Vercel's IP ranges to allowlist
   - Or use 0.0.0.0/0 for all IPs (less secure)

3. **Monitor Connection Limits**:
   - Free tier: 60 connections max
   - Consider connection pooling for high traffic

## 🐛 Common Deployment Issues

### Issue 1: P1001 Error on Vercel
```bash
# Solution: Use connection pooling URL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:6543/postgres?pgbouncer=true"
```

### Issue 2: Prisma Client Generation
```bash
# Add to vercel.json
{
  "buildCommand": "npm run build && cd backend && npx prisma generate"
}
```

### Issue 3: Environment Variables Not Loading
```bash
# Verify in Vercel Dashboard
vercel env ls

# Pull locally to test
vercel env pull .env.local
```

## 📊 Monitoring & Debugging

### Vercel Logs
```bash
# View real-time logs
vercel logs

# View function logs
vercel logs --follow
```

### Database Health Check
```javascript
// Add to your API routes
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});
```

## 🔄 CI/CD Integration

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Generate Prisma Client
        run: cd backend && npx prisma generate
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Success Criteria

- [ ] DATABASE_URL configured in Vercel
- [ ] Prisma client generates on build
- [ ] Database connects in production
- [ ] Migrations run successfully
- [ ] API endpoints respond correctly
- [ ] Health check returns 200 OK

## 🆘 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Supabase Connection Issues](https://supabase.com/docs/guides/database/connecting-to-postgres)
