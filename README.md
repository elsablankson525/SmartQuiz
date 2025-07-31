# SmartQuiz - AI-Powered Learning Platform

A modern, intelligent quiz application built with Next.js that provides personalized learning experiences through adaptive quizzes, AI-powered recommendations, and comprehensive analytics.

## 🚀 Features

### Core Learning Features
- **AI-Powered Learning**: Personalized recommendations based on learning patterns and performance
- **Adaptive Quizzes**: Dynamic difficulty adjustment to match skill level and learning pace
- **Progress Tracking**: Comprehensive analytics and insights to monitor learning journey
- **Community Learning**: Connect with fellow learners and compete on leaderboards

### Advanced Features
- **Multi-Subject Support**: Computer Science, Mathematics, Science, History, Literature, Art
- **Learning Paths**: Structured learning journeys with milestones and achievements
- **Certificate System**: Earn certificates upon completing subjects and lessons
- **Study Plans**: Personalized study schedules and recommendations
- **Continuous Learning**: AI-driven content recommendations
- **Analytics Dashboard**: Detailed performance insights and learning analytics

### Technical Features
- **Real-time Analytics**: Live performance tracking and insights
- **ML Predictions**: Machine learning models for performance prediction
- **Responsive Design**: Mobile-first design with modern UI components
- **Authentication**: Secure user authentication with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM for robust data management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend & Database
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution

### AI & ML
- **Multi-AI Service** - Fallback system with multiple AI providers (Gemini, DeepSeek, Groq, XAI)
- **Google Generative AI** - Primary AI content generation
- **Intelligent Fallbacks** - Rule-based recommendations when AI services are unavailable
- **ML Matrix** - Machine learning computations
- **Regression** - Statistical analysis

### Additional Libraries
- **Recharts** - Data visualization
- **React Player** - Video content support
- **Date-fns** - Date manipulation
- **JSPDF** - PDF generation
- **Puppeteer** - Web scraping capabilities

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-quiz
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_app"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"

# Email (for password reset, etc.)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# YouTube API (for video content)
YOUTUBE_API_KEY="your-youtube-api-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
smart-quiz/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── analytics/         # Analytics dashboard
│   ├── dashboard/         # User dashboard
│   ├── quiz/             # Quiz functionality
│   ├── subjects/         # Subject pages
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # UI components (Radix UI)
│   └── ...
├── lib/                  # Utility functions and services
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication utilities
│   ├── ml-models.ts      # ML model implementations
│   └── ...
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npm run test:auth` - Test authentication state and flow

## 🎯 Key Features Explained

### AI-Powered Recommendations
The platform uses machine learning models to analyze user performance and provide personalized content recommendations. This includes:
- Quiz difficulty adjustment
- Subject recommendations
- Study plan optimization
- Content relevance scoring

### Adaptive Learning System
- Tracks user progress across subjects
- Adjusts quiz difficulty based on performance
- Provides targeted feedback and hints
- Generates personalized learning paths

### Analytics & Insights
- Performance tracking across subjects
- Learning pattern analysis
- Progress visualization
- Achievement tracking
- Leaderboard rankings

## 🔐 Authentication System

### Authentication Flow
The application implements a secure authentication system that ensures users start in a logged-out state:

1. **Initial State**: Users always start the application in a logged-out state
2. **Public Access**: Homepage and public pages are accessible without authentication
3. **Protected Routes**: Dashboard, profile, analytics, and other features require authentication
4. **Session Management**: Automatic session validation and cleanup of expired sessions
5. **Secure Sign Out**: Complete session cleanup when users sign out

### Authentication Features
- **Multiple Providers**: Google OAuth, GitHub OAuth, and email/password authentication
- **Session Validation**: Automatic validation of session tokens on each request
- **Middleware Protection**: Route-level authentication using NextAuth middleware
- **Session Cleanup**: Automatic cleanup of expired sessions on server startup
- **Secure Cookies**: JWT-based sessions with secure cookie handling

### Testing Authentication
Run the authentication test to verify the system is working correctly:
```bash
npm run test:auth
```

## 🔧 Troubleshooting

### Authentication Issues
- **Users appear logged in when they shouldn't be**: Clear browser cookies and local storage, then restart the server
- **Session persistence issues**: Check that NEXTAUTH_SECRET is properly set and unique
- **Middleware not working**: Ensure the middleware.ts file is in the root directory and properly configured

### AI Service Issues

If you encounter AI service errors (503 Service Unavailable, 402 Payment Required, etc.):

1. **Check AI Status Dashboard**: Visit the dashboard to see real-time AI provider status
2. **Automatic Fallbacks**: The system automatically switches to rule-based recommendations when AI services are unavailable
3. **Provider Rotation**: The system tries multiple AI providers in order of preference
4. **Retry Logic**: Failed requests are automatically retried with exponential backoff

### Common Issues

**YouTube API Errors**: Video recommendations may be unavailable if the YouTube API key is invalid or quota is exceeded. The system will continue to work without video recommendations.

**Database Connection Issues**: Ensure PostgreSQL is running and the DATABASE_URL is correctly configured.

**Authentication Issues**: Check that NEXTAUTH_SECRET and NEXTAUTH_URL are properly set in your environment variables.

### Performance Optimization

- The system includes intelligent caching and fallback mechanisms
- AI requests are optimized with retry logic and provider rotation
- Rule-based recommendations ensure the app remains functional even when AI services are down

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI tutoring features
- [ ] Social learning features
- [ ] Integration with external learning platforms
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies** 