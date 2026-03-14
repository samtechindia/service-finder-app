// Database connectivity test script
// Run with: node test-db-connection.js

import { PrismaClient } from '@prisma/client';

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
    console.log('📊 Database info:', result[0]);
    
    // Test if tables exist
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('📋 Existing tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Error code:', error.code);
    
    if (error.code === 'P1001') {
      console.log('\n🚨 P1001 Error - Cannot reach database server');
      console.log('💡 Common solutions:');
      console.log('   1. Check DATABASE_URL in .env file');
      console.log('   2. Verify Supabase database is active');
      console.log('   3. Check network/firewall settings');
      console.log('   4. Confirm database password is correct');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
