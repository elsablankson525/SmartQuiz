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
- **OpenAI API** - AI-powered recommendations
- **Google Generative AI** - Content generation
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
cd bytebattle-quiz-app
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
bytebattle-quiz-app/
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