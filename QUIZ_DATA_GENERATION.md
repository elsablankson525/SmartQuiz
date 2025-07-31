# Quiz Data Generation for SmartQuiz

This directory contains scripts to generate comprehensive quiz questions and learning resources for all 20 subjects in the SmartQuiz application.

## 📋 Overview

The SmartQuiz application includes 20 subjects with quiz questions across 4 difficulty levels:
- **Beginner**: Basic concepts and fundamentals
- **Intermediate**: Advanced concepts and practical applications
- **Advanced**: Expert-level topics and cutting-edge developments
- **Adaptive**: Problem-solving and optimization approaches

## 🎯 Subjects Covered

1. **JavaScript Fundamentals** - Core JavaScript concepts and modern features
2. **Python Programming** - Python basics to advanced programming
3. **Web Development** - Full-stack web development
4. **Data Science** - Data analysis and scientific computing
5. **Machine Learning** - ML algorithms and applications
6. **Human Anatomy** - Human body structure and function
7. **Medical Terminology** - Medical terms and definitions
8. **Business Fundamentals** - Core business concepts
9. **Digital Marketing** - Modern marketing strategies
10. **Legal Fundamentals** - Basic legal concepts
11. **Psychology Basics** - Human behavior and mental processes
12. **Mathematics** - Mathematical concepts and problem-solving
13. **React Development** - React.js framework
14. **Node.js Backend** - Server-side JavaScript
15. **Database Design** - Database concepts and SQL
16. **DevOps & CI/CD** - Development operations
17. **Cybersecurity** - Information security
18. **Mobile Development** - iOS and Android development
19. **Cloud Computing** - AWS, Azure, Google Cloud
20. **Blockchain & Crypto** - Blockchain technology

## 📁 Files

### Core Generation Scripts

- **`create-quiz-questions.js`** - Generates 800 quiz questions (10 per difficulty level per subject)
- **`create-learning-resources.js`** - Generates learning resources for each subject
- **`run-all-generators.js`** - Master script that runs both generators

### Individual Subject Files

- **`quiz-questions-javascript.ts`** - Detailed JavaScript-specific questions
- **`generate-all-quiz-questions.ts`** - Comprehensive TypeScript version

## 🚀 Quick Start

### Prerequisites

1. Ensure your database is set up and Prisma is configured
2. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

### Generate All Data

Run the master script to generate everything at once:

```bash
node run-all-generators.js
```

This will:
- Generate 800 quiz questions (20 subjects × 4 difficulties × 10 questions)
- Create learning resources for each subject
- Provide a summary of all generated content

### Generate Individual Components

#### Quiz Questions Only
```bash
node create-quiz-questions.js
```

#### Learning Resources Only
```bash
node create-learning-resources.js
```

## 📊 Data Structure

### Quiz Questions

Each question includes:
- **Question text** - The actual question
- **Options** - 4 multiple choice options (A, B, C, D)
- **Correct Answer** - The right answer
- **Explanation** - Detailed explanation of the answer
- **Topic** - Specific topic within the subject
- **Related Concepts** - Array of related topics
- **Difficulty Level** - beginner, intermediate, advanced, or adaptive
- **Category** - The subject name

### Learning Resources

Each resource includes:
- **Title** - Resource name
- **Type** - video, course, article, book
- **URL** - Link to the resource
- **Difficulty** - beginner, intermediate, advanced
- **Description** - Detailed description
- **Duration/Read Time** - Time to complete
- **Provider** - Source platform (Coursera, Udemy, etc.)
- **Rating** - User rating (1-5 stars)
- **Tags** - Relevant keywords
- **Language** - Resource language
- **Free/Paid** - Cost information
- **Certification** - Whether it provides certification

## 🎨 Customization

### Adding New Subjects

1. Add the subject name to the `subjects` array in the generation scripts
2. Optionally add specific question templates for the subject
3. Run the generation scripts

### Modifying Question Templates

Edit the `questionTemplates` object in `create-quiz-questions.js` to:
- Change question formats
- Add new difficulty levels
- Modify answer options
- Update explanations

### Customizing Learning Resources

Edit the `resourceTemplates` object in `create-learning-resources.js` to:
- Add specific resources for subjects
- Change resource types
- Update providers and ratings
- Modify descriptions

## 🔧 Database Schema

The scripts work with the following Prisma models:

### Question Model
```prisma
model Question {
  id              String   @id
  question        String
  options         String[]
  correctAnswer   String
  explanation     String?
  category        String
  difficulty      String
  topic           String?
  relatedConcepts String[]
  quizId          String?
  createdAt       DateTime @default(now())
  Quiz            Quiz?    @relation(fields: [quizId], references: [id])
}
```

### LearningResource Model
```prisma
model LearningResource {
  id            String   @id @default(cuid())
  title         String
  type          String
  url           String
  difficulty    String
  category      String
  topic         String
  description   String?
  duration      String?
  readTime      String?
  provider      String?
  rating        Float?
  tags          String[]
  language      String?
  isFree        Boolean?
  certification Boolean?
  createdAt     DateTime @default(now())
}
```

## 📈 Statistics

After running the generation scripts, you'll have:

- **800 Quiz Questions** total
  - 200 Beginner questions
  - 200 Intermediate questions
  - 200 Advanced questions
  - 200 Adaptive questions

- **80+ Learning Resources** total
  - 4+ resources per subject
  - Mix of free and paid resources
  - Various types (videos, courses, articles, books)

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure your database is running
   - Check your DATABASE_URL in `.env`
   - Run `npx prisma generate` if needed

2. **Prisma Client Error**
   - Run `npx prisma generate`
   - Restart your development server

3. **Duplicate Questions**
   - The scripts use unique IDs to prevent duplicates
   - If you need to regenerate, clear existing data first

### Regenerating Data

To regenerate all data:

1. Clear existing data:
   ```sql
   DELETE FROM "Question";
   DELETE FROM "LearningResource";
   ```

2. Run the generation scripts again:
   ```bash
   node run-all-generators.js
   ```

## 🎯 Next Steps

After generating the data:

1. **Test the Application** - Verify questions appear correctly
2. **Review Content** - Check question quality and accuracy
3. **Customize Further** - Add subject-specific questions
4. **Add Real Resources** - Replace placeholder URLs with real learning resources
5. **Implement Analytics** - Track question performance and user engagement

## 📝 Notes

- The current questions use template placeholders (Option A, B, C, D)
- Learning resource URLs are examples and should be replaced with real resources
- Consider adding more specific questions for each subject based on your curriculum
- The adaptive difficulty questions focus on problem-solving and optimization

## 🤝 Contributing

To add more specific questions or resources:

1. Fork the repository
2. Create a new branch for your changes
3. Add specific question templates for subjects
4. Update learning resource templates
5. Submit a pull request

---

**Happy Learning! 🎓** 