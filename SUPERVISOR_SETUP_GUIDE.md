# SmartQuiz - Supervisor Setup Guide

## 🎯 Project Overview

SmartQuiz is a comprehensive AI-powered learning platform built with Next.js, TypeScript, and PostgreSQL. The application features adaptive quizzes, personalized learning recommendations, comprehensive analytics, and a modern user interface.

## 🚀 Quick Start for Supervisor

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git**

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/elsablankson525/SmartQuiz.git
   cd SmartQuiz
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your actual credentials
   # See detailed instructions below
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with initial data
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Environment Configuration

### Required Environment Variables

Edit `.env.local` and configure the following variables:

#### Database (Required)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/SmartQuiz"
```

#### Authentication (Required)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
JWT_SECRET="your-jwt-secret-here"
```

#### OAuth Providers (Optional but Recommended)
```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

#### AI Services (Optional)
```env
GOOGLE_AI_API_KEY="your-google-ai-api-key"
DEEPSEEK_API_KEY="your-deepseek-api-key"
GROQ_API_KEY="your-groq-api-key"
XAI_API_KEY="your-xai-api-key"
YOUTUBE_API_KEY="your-youtube-api-key"
```

### Generating Secrets

Generate secure secrets using:
```bash
# For NEXTAUTH_SECRET and JWT_SECRET
openssl rand -base64 32
```

## 📊 Key Features Demonstrated

### 1. **Authentication System**
- Multiple OAuth providers (Google, GitHub)
- Email/password authentication
- Secure session management
- Test page: `/test-auth`

### 2. **Quiz System**
- Adaptive difficulty adjustment
- Multiple subjects and categories
- Real-time scoring and feedback
- Progress tracking

### 3. **AI-Powered Features**
- Personalized recommendations
- Performance analysis
- Content suggestions
- Fallback to rule-based recommendations when AI is unavailable

### 4. **Analytics Dashboard**
- Performance tracking
- Learning insights
- Progress visualization
- Achievement system

### 5. **Learning Management**
- Structured learning paths
- Certificate system
- Study plans
- Resource recommendations

## 🧪 Testing the Application

### Test Pages Available
- **Authentication Test**: `/test-auth`
- **Recommendations Test**: `/test-recommendations`
- **ML Demo**: `/ml-demo`
- **Analytics**: `/analytics`

### Sample Data
The database is seeded with:
- Sample users and quiz results
- Multiple subjects and categories
- Learning resources and paths
- Achievement system data

## 🔍 Code Quality

### TypeScript & Linting
- ✅ All TypeScript errors resolved
- ✅ All ESLint warnings fixed
- ✅ Clean, maintainable code

### Database Schema
- ✅ Proper relationships and constraints
- ✅ Migration history preserved
- ✅ Seed data for testing

### Security
- ✅ Environment variables properly configured
- ✅ No secrets committed to repository
- ✅ Secure authentication flow

## 📁 Project Structure

```
SmartQuiz/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── dashboard/         # User dashboard
│   ├── quiz/             # Quiz functionality
│   └── ...
├── components/            # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL format
   - Run `npx prisma migrate dev` if schema changes

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check OAuth provider configurations
   - Clear browser cookies if needed

3. **AI Service Errors**
   - AI services are optional
   - System falls back to rule-based recommendations
   - Check API keys if using AI features

### Getting Help
- Check the main README.md for detailed documentation
- Review the console for error messages
- Test individual features using the test pages

## 🎉 Success Criteria

The application is ready for review when:
- ✅ Server starts without errors
- ✅ Database connects successfully
- ✅ Authentication works (login/signup)
- ✅ Quiz functionality is operational
- ✅ Analytics dashboard displays data
- ✅ All test pages are accessible

## 📞 Support

For any issues during setup or review:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running and accessible
4. Review the main README.md for additional details

---

**Project Status**: ✅ Ready for Supervisor Review
**Last Updated**: July 31, 2025
**Developer**: [Your Name] 