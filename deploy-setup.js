#!/usr/bin/env node

/**
 * Deployment Setup Script for ByteBattle Quiz App
 * This script helps set up the project for deployment and sharing with lecturers
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ByteBattle Quiz App - Deployment Setup\n');

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local file...');
  
  if (fs.existsSync(envPath)) {
    // Copy .env to .env.local
    const envContent = fs.readFileSync(envPath, 'utf8');
    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ Copied .env to .env.local');
  } else {
    console.log('❌ No .env file found. Please create one first.');
    process.exit(1);
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Set up a cloud database (Supabase/Neon/Railway)');
console.log('2. Update DATABASE_URL in .env.local with your cloud database connection string');
console.log('3. Run: npm install');
console.log('4. Run: npx prisma generate');
console.log('5. Run: npx prisma db push');
console.log('6. Run: npx prisma db seed');
console.log('7. Run: npm run dev');

console.log('\n🌐 For Deployment:');
console.log('1. Push your code to GitHub');
console.log('2. Deploy to Vercel/Railway');
console.log('3. Add environment variables in your deployment platform');
console.log('4. Share the live URL with your lecturers');

console.log('\n📚 For Lecturers:');
console.log('1. Ask the student for the live URL (easiest)');
console.log('2. Or follow the SETUP_GUIDE.md for local setup');

console.log('\n🔗 Useful Links:');
console.log('- Supabase: https://supabase.com');
console.log('- Neon: https://neon.tech');
console.log('- Railway: https://railway.app');
console.log('- Vercel: https://vercel.com');

console.log('\n📖 Check SETUP_GUIDE.md for detailed instructions!\n'); 