# Prisma P1001 Error Troubleshooting Guide

## Error: "Can't reach database server at db.cmjpwawlcyoteoiaytci.supabase.co:5432"

### 🔍 Quick Diagnosis Commands (PowerShell)

```powershell
# 1. Test basic network connectivity
Test-NetConnection -ComputerName "db.cmjpwawlcyoteoiaytci.supabase.co" -Port 5432

# 2. Test with telnet (if available)
telnet db.cmjpwawlcyoteoiaytci.supabase.co 5432

# 3. Run our connection test script
cd c:\serviceapp\service-platform
node test-db-connection.js
```

### 🛠️ Step-by-Step Solutions

#### Step 1: Verify DATABASE_URL Format
```bash
# Correct format:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:5432/postgres"

# Common mistakes:
# ❌ Missing protocol: "postgres://..." (should be "postgresql://")
# ❌ Wrong port: using 6543 without pgbouncer=true
# ❌ Missing database name: end at .co:5432/
```

#### Step 2: Get Correct Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → Database
4. Copy "Connection string" → "URI"
5. Replace `[YOUR-PASSWORD]` with your actual database password

#### Step 3: Check Supabase Database Status
- Ensure project is **Active** (not paused)
- Verify database is **Online**
- Check if you're on free tier (may have connection limits)

#### Step 4: Network & Firewall Issues
```powershell
# Check if you're behind VPN/Proxy
# Try disconnecting VPN and test again

# Windows Firewall (run as Administrator)
netsh advfirewall show allprofiles

# Temporarily disable for testing (NOT recommended for production)
netsh advfirewall set allprofiles state off
# Remember to re-enable: netsh advfirewall set allprofiles state on
```

#### Step 5: Alternative Connection (Connection Pooling)
```bash
# Use Supabase's connection pooler (port 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:6543/postgres?pgbouncer=true"
```

#### Step 6: Test with Different Tools
```powershell
# Install PostgreSQL client tools
winget install PostgreSQL.pgCLI

# Test with psql
psql "postgresql://postgres:[PASSWORD]@db.cmjpwawlcyoteoiaytci.supabase.co:5432/postgres"
```

### 🚨 Common P1001 Causes

1. **Wrong DATABASE_URL** - 90% of cases
2. **Supabase project paused** - Free tier auto-pause
3. **Network restrictions** - Corporate firewall/VPN
4. **Incorrect password** - Reset in Supabase dashboard
5. **Port blocked** - 5432 blocked by ISP/network

### 📋 Verification Checklist

- [ ] DATABASE_URL copied correctly from Supabase
- [ ] Password replaced without brackets `[PASSWORD]`
- [ ] `.env` file exists in project root
- [ ] Supabase project is active (not paused)
- [ ] Can reach `db.cmjpwawlcyoteoiaytci.supabase.co:5432`
- [ ] No VPN/proxy blocking connection
- [ ] Using `postgresql://` not `postgres://`

### 🆘 Still Not Working?

1. **Try local PostgreSQL** for development:
   ```bash
   # Install PostgreSQL locally
   winget install PostgreSQL.PostgreSQL
   
   # Update .env to use local DB
   DATABASE_URL="postgresql://postgres:password@localhost:5432/servicedb"
   ```

2. **Use Supabase Direct API** as fallback:
   ```javascript
   // Direct REST API calls instead of Prisma
   const { data, error } = await supabase
     .from('providers')
     .select('*');
   ```

3. **Contact Supabase support** if database appears down
