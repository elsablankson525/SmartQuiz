# ByteBattle Quiz App

A comprehensive quiz application built with Next.js, Prisma, and PostgreSQL.

## 🚀 Quick Start for Lecturers/Reviewers

### Option 1: Use the Live Demo (Recommended)
The application is deployed and ready to use at: [Your Vercel URL here]

### Option 2: Local Setup with Cloud Database

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd bytebattle-quiz-app
   ```

2. **Set up Cloud Database (Supabase - Free)**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project
   - Go to Settings > Database
   - Copy the connection string (it looks like: `postgresql://postgres:[password]@[host]:5432/postgres`)

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase database URL:
   ```
   DATABASE_URL="your-supabase-connection-string"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### For Development
- **Local PostgreSQL**: Use Docker or install PostgreSQL locally
- **Cloud Database**: Use Supabase, Neon, or Railway (recommended for sharing)

### For Production/Deployment
- **Vercel**: Use Vercel Postgres or connect to Supabase
- **Railway**: Use Railway's PostgreSQL service
- **Supabase**: Use Supabase's hosted PostgreSQL

## 🔐 Authentication Setup

The app uses NextAuth.js with multiple providers:

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

2. **GitHub OAuth**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Add callback URL: `http://localhost:3000/api/auth/callback/github`

## 📊 Features

- **Quiz System**: Multiple choice questions with explanations
- **Learning Paths**: Structured learning journeys
- **Progress Tracking**: User progress and achievements
- **Leaderboard**: Competitive scoring system
- **Analytics**: Performance insights and recommendations
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- **Railway**: Supports both app and database deployment
- **Netlify**: Frontend deployment (requires separate database)
- **Heroku**: Full-stack deployment

## 📚 Database Schema

The application includes the following main models:
- Users and Authentication
- Categories and Subjects
- Quiz Questions and Results
- Learning Paths and Progress
- Achievements and Leaderboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Note**: For lecturers and reviewers, the easiest way to access the application is through the deployed version. If you need to run it locally, follow the cloud database setup instructions above. 