import type { LearningResource, StudyPlanItem, QuizResult } from "./types"

export interface RuleBasedRecommendations {
  weakAreas: string[]
  strongAreas: string[]
  recommendedResources: LearningResource[]
  nextQuizSuggestion: {
    category: string
    difficulty: string
    reason: string
    confidence: number
  }
  studyPlan: StudyPlanItem[]
  performanceInsights: Record<string, unknown>
  categorySpecificAdvice: string
}

export interface StudyPlanWeek {
  week: number
  focus: string
  resources: string[]
  quizTopics: string[]
  goals: string[]
  priority: 'high' | 'medium' | 'low'
  estimatedTime: number
  difficultyAdjustment: string
}

export class RuleBasedEngine {
  static async generateRecommendations(
    userHistory: QuizResult[],
    category: string,
    options: {
      difficulty: string
      timeAvailable: number
      goals: string[]
    }
  ): Promise<RuleBasedRecommendations> {
    // Enhanced rule-based logic
    const weakAreas = this.getWeakAreas(category, userHistory)
    const strongAreas = this.getStrongAreas(category, userHistory)
    const recommendedResources = this.getRecommendedResources(category, weakAreas, options.difficulty)
    const nextQuizSuggestion = this.getNextQuizSuggestion(category, userHistory, options)
    const studyPlan = this.generateStudyPlan(category, weakAreas, options)
    const performanceInsights = this.analyzePerformance(userHistory)
    const categorySpecificAdvice = this.getCategorySpecificAdvice(category, weakAreas, strongAreas)
    
    return {
      weakAreas,
      strongAreas,
      recommendedResources,
      nextQuizSuggestion,
      studyPlan,
      performanceInsights,
      categorySpecificAdvice
    }
  }

  static getStudyPlanForSubjectAndLearnerType(
    subject: string,
    learnerType: 'slow' | 'inBetween' | 'fast'
  ): StudyPlanWeek[] {
    // Comprehensive study plans for different subjects
    const subjectPlans: Record<string, StudyPlanWeek[]> = {
      'computer-science': [
        {
          week: 1,
          focus: "Programming Fundamentals",
          resources: ["Introduction to Programming", "Basic Syntax Tutorial", "Code Examples"],
          quizTopics: ["Variables", "Data Types", "Basic Operations"],
          goals: ["Understand basic programming concepts", "Write simple programs", "Debug basic errors"],
          priority: "high",
          estimatedTime: 8,
          difficultyAdjustment: "maintain"
        },
        {
          week: 2,
          focus: "Control Structures",
          resources: ["Conditional Statements", "Loops Tutorial", "Practice Problems"],
          quizTopics: ["If-else statements", "For loops", "While loops"],
          goals: ["Master control flow", "Write structured programs", "Solve algorithmic problems"],
          priority: "high",
          estimatedTime: 10,
          difficultyAdjustment: "increase"
        },
        {
          week: 3,
          focus: "Functions and Methods",
          resources: ["Function Basics", "Parameter Passing", "Return Values"],
          quizTopics: ["Function definition", "Parameters", "Return statements"],
          goals: ["Create reusable functions", "Understand scope", "Practice modular programming"],
          priority: "medium",
          estimatedTime: 8,
          difficultyAdjustment: "increase"
        },
        {
          week: 4,
          focus: "Data Structures",
          resources: ["Arrays and Lists", "Object-Oriented Programming", "Data Organization"],
          quizTopics: ["Arrays", "Lists", "Objects", "Classes"],
          goals: ["Understand data organization", "Implement basic data structures", "Apply OOP concepts"],
          priority: "medium",
          estimatedTime: 12,
          difficultyAdjustment: "increase"
        },
        {
          week: 5,
          focus: "Advanced Concepts",
          resources: ["Algorithms", "Complexity Analysis", "Best Practices"],
          quizTopics: ["Algorithm efficiency", "Time complexity", "Space complexity"],
          goals: ["Analyze algorithm performance", "Optimize code", "Follow best practices"],
          priority: "medium",
          estimatedTime: 10,
          difficultyAdjustment: "increase"
        },
        {
          week: 6,
          focus: "Project Development",
          resources: ["Project Planning", "Version Control", "Testing"],
          quizTopics: ["Project management", "Git basics", "Unit testing"],
          goals: ["Complete a small project", "Use version control", "Write tests"],
          priority: "low",
          estimatedTime: 15,
          difficultyAdjustment: "maintain"
        }
      ],
      'mathematics': [
        {
          week: 1,
          focus: "Algebraic Foundations",
          resources: ["Basic Algebra", "Equations and Inequalities", "Mathematical Notation"],
          quizTopics: ["Linear equations", "Quadratic equations", "Inequalities"],
          goals: ["Solve linear equations", "Understand quadratic functions", "Work with inequalities"],
          priority: "high",
          estimatedTime: 8,
          difficultyAdjustment: "maintain"
        },
        {
          week: 2,
          focus: "Functions and Graphs",
          resources: ["Function Theory", "Graphing Techniques", "Function Properties"],
          quizTopics: ["Function notation", "Domain and range", "Graphing"],
          goals: ["Understand function concepts", "Graph various functions", "Analyze function behavior"],
          priority: "high",
          estimatedTime: 10,
          difficultyAdjustment: "increase"
        },
        {
          week: 3,
          focus: "Calculus Fundamentals",
          resources: ["Limits and Continuity", "Derivatives", "Applications"],
          quizTopics: ["Limits", "Derivatives", "Rate of change"],
          goals: ["Calculate limits", "Find derivatives", "Apply calculus concepts"],
          priority: "medium",
          estimatedTime: 12,
          difficultyAdjustment: "increase"
        },
        {
          week: 4,
          focus: "Integration",
          resources: ["Antiderivatives", "Definite Integrals", "Integration Techniques"],
          quizTopics: ["Antiderivatives", "Definite integrals", "Integration methods"],
          goals: ["Find antiderivatives", "Calculate definite integrals", "Apply integration techniques"],
          priority: "medium",
          estimatedTime: 12,
          difficultyAdjustment: "increase"
        },
        {
          week: 5,
          focus: "Applications",
          resources: ["Real-world Applications", "Problem Solving", "Mathematical Modeling"],
          quizTopics: ["Optimization", "Related rates", "Area and volume"],
          goals: ["Solve optimization problems", "Apply calculus to real situations", "Model mathematical problems"],
          priority: "medium",
          estimatedTime: 10,
          difficultyAdjustment: "maintain"
        }
      ],
      'physics': [
        {
          week: 1,
          focus: "Mechanics Fundamentals",
          resources: ["Newton's Laws", "Kinematics", "Force and Motion"],
          quizTopics: ["Newton's laws", "Motion equations", "Forces"],
          goals: ["Understand Newton's laws", "Solve motion problems", "Analyze forces"],
          priority: "high",
          estimatedTime: 8,
          difficultyAdjustment: "maintain"
        },
        {
          week: 2,
          focus: "Energy and Work",
          resources: ["Energy Conservation", "Work and Power", "Potential Energy"],
          quizTopics: ["Kinetic energy", "Potential energy", "Work-energy theorem"],
          goals: ["Understand energy concepts", "Calculate work and power", "Apply energy conservation"],
          priority: "high",
          estimatedTime: 10,
          difficultyAdjustment: "increase"
        },
        {
          week: 3,
          focus: "Waves and Oscillations",
          resources: ["Wave Properties", "Simple Harmonic Motion", "Wave Phenomena"],
          quizTopics: ["Wave characteristics", "Frequency and period", "Wave interference"],
          goals: ["Understand wave properties", "Analyze oscillations", "Study wave phenomena"],
          priority: "medium",
          estimatedTime: 10,
          difficultyAdjustment: "increase"
        },
        {
          week: 4,
          focus: "Electricity and Magnetism",
          resources: ["Electric Fields", "Magnetic Fields", "Electromagnetic Induction"],
          quizTopics: ["Electric charge", "Magnetic fields", "Electromagnetic forces"],
          goals: ["Understand electric fields", "Analyze magnetic phenomena", "Study electromagnetic induction"],
          priority: "medium",
          estimatedTime: 12,
          difficultyAdjustment: "increase"
        },
        {
          week: 5,
          focus: "Modern Physics",
          resources: ["Quantum Mechanics", "Relativity", "Nuclear Physics"],
          quizTopics: ["Quantum concepts", "Relativistic effects", "Nuclear processes"],
          goals: ["Understand quantum mechanics", "Study relativity", "Learn nuclear physics"],
          priority: "low",
          estimatedTime: 12,
          difficultyAdjustment: "increase"
        }
      ]
    }

    // Get the specific plan for the subject, or use a generic plan
    const basePlan = subjectPlans[subject] || this.getGenericStudyPlan(subject)

    // Adjust based on learner type
    if (learnerType === 'slow') {
      return basePlan.map(week => ({
        ...week,
        estimatedTime: Math.round(week.estimatedTime * 1.5),
        priority: "high" as const,
        difficultyAdjustment: "decrease"
      }))
    } else if (learnerType === 'fast') {
      return basePlan.map(week => ({
        ...week,
        estimatedTime: Math.round(week.estimatedTime * 0.7),
        priority: "medium" as const,
        difficultyAdjustment: "increase"
      }))
    }

    return basePlan
  }

  private static getGenericStudyPlan(subject: string): StudyPlanWeek[] {
    return [
      {
        week: 1,
        focus: `${subject} Fundamentals`,
        resources: [`${subject} Basics`, `Introduction to ${subject}`, `${subject} Concepts`],
        quizTopics: [subject],
        goals: [`Understand basic ${subject} concepts`, `Learn fundamental principles`],
        priority: "high",
        estimatedTime: 6,
        difficultyAdjustment: "maintain"
      },
      {
        week: 2,
        focus: `${subject} Applications`,
        resources: [`${subject} Practice`, `Real-world ${subject}`, `${subject} Problems`],
        quizTopics: [subject],
        goals: [`Apply ${subject} concepts`, `Solve practical problems`],
        priority: "medium",
        estimatedTime: 8,
        difficultyAdjustment: "increase"
      },
      {
        week: 3,
        focus: `${subject} Advanced Topics`,
        resources: [`Advanced ${subject}`, `${subject} Theory`, `Complex ${subject} Problems`],
        quizTopics: [subject],
        goals: [`Master advanced concepts`, `Handle complex problems`],
        priority: "medium",
        estimatedTime: 10,
        difficultyAdjustment: "increase"
      },
      {
        week: 4,
        focus: `${subject} Mastery`,
        resources: [`${subject} Mastery`, `Expert ${subject}`, `${subject} Projects`],
        quizTopics: [subject],
        goals: [`Achieve mastery`, `Complete projects`],
        priority: "low",
        estimatedTime: 12,
        difficultyAdjustment: "maintain"
      }
    ]
  }

  private static getWeakAreas(category: string, userHistory: QuizResult[]): string[] {
    if (userHistory.length === 0) {
      return this.getDefaultWeakAreas(category)
    }

    // Analyze quiz results to identify weak areas
    const incorrectAnswers: Record<string, number> = {}
    const totalQuestions: Record<string, number> = {}

    userHistory.forEach(quiz => {
      if (quiz.questionsAnswered) {
        const questions = Array.isArray(quiz.questionsAnswered) 
          ? quiz.questionsAnswered 
          : JSON.parse(quiz.questionsAnswered as string)

        questions.forEach((q: { topic?: string; isCorrect: boolean }) => {
          const topic = q.topic || 'General'
          if (!q.isCorrect) {
            incorrectAnswers[topic] = (incorrectAnswers[topic] || 0) + 1
          }
          totalQuestions[topic] = (totalQuestions[topic] || 0) + 1
        })
      }
    })

    // Calculate error rates and identify weak areas
    const weakAreas = Object.entries(incorrectAnswers)
      .filter(([topic, incorrect]) => {
        const total = totalQuestions[topic] || 0
        return total > 0 && (incorrect / total) > 0.3 // More than 30% error rate
      })
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic)

    return weakAreas.length > 0 ? weakAreas : this.getDefaultWeakAreas(category)
  }

  private static getStrongAreas(category: string, userHistory: QuizResult[]): string[] {
    if (userHistory.length === 0) {
      return []
    }

    // Analyze quiz results to identify strong areas
    const correctAnswers: Record<string, number> = {}
    const totalQuestions: Record<string, number> = {}

    userHistory.forEach(quiz => {
      if (quiz.questionsAnswered) {
        const questions = Array.isArray(quiz.questionsAnswered) 
          ? quiz.questionsAnswered 
          : JSON.parse(quiz.questionsAnswered as string)

        questions.forEach((q: { topic?: string; isCorrect: boolean }) => {
          const topic = q.topic || 'General'
          if (q.isCorrect) {
            correctAnswers[topic] = (correctAnswers[topic] || 0) + 1
          }
          totalQuestions[topic] = (totalQuestions[topic] || 0) + 1
        })
      }
    })

    // Calculate success rates and identify strong areas
    return Object.entries(correctAnswers)
      .filter(([topic, correct]) => {
        const total = totalQuestions[topic] || 0
        return total > 0 && (correct / total) > 0.8 // More than 80% success rate
      })
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic)
  }

  private static getDefaultWeakAreas(category: string): string[] {
    const categoryWeakAreas: Record<string, string[]> = {
      'computer-science': ['Programming Logic', 'Data Structures', 'Algorithms'],
      'mathematics': ['Algebra', 'Calculus', 'Problem Solving'],
      'physics': ['Mechanics', 'Electromagnetism', 'Problem Analysis'],
      'chemistry': ['Chemical Reactions', 'Molecular Structure', 'Calculations'],
      'biology': ['Cell Biology', 'Genetics', 'Ecology'],
      'history': ['Historical Analysis', 'Critical Thinking', 'Source Evaluation'],
      'literature': ['Text Analysis', 'Literary Devices', 'Critical Reading'],
      'economics': ['Economic Theory', 'Data Analysis', 'Policy Analysis']
    }

    return categoryWeakAreas[category] || ['Core Concepts', 'Problem Solving', 'Application']
  }

  private static getRecommendedResources(
    category: string, 
    weakAreas: string[], 
    difficulty: string
  ): LearningResource[] {
    // Generate recommended resources based on weak areas and difficulty
    const resources: LearningResource[] = []
    
    weakAreas.forEach(area => {
      resources.push({
        id: `${area}-resource-1`,
        title: `${area} Fundamentals`,
        type: 'article',
        url: `#${area.toLowerCase().replace(/\s+/g, '-')}`,
        difficulty: difficulty,
        relevanceScore: 0.9,
        estimatedTime: 30,
        description: `Comprehensive guide to ${area} concepts`,
        tags: [category, area, difficulty],
        category: category,
        topic: area
      })

      resources.push({
        id: `${area}-resource-2`,
        title: `${area} Practice Problems`,
        type: 'practice',
        url: `#${area.toLowerCase().replace(/\s+/g, '-')}-practice`,
        difficulty: difficulty,
        relevanceScore: 0.85,
        estimatedTime: 45,
        description: `Practice problems for ${area}`,
        tags: [category, area, difficulty, 'practice'],
        category: category,
        topic: area
      })
    })

    return resources
  }

  private static getNextQuizSuggestion(
    category: string,
    userHistory: QuizResult[],
    options: { difficulty: string; timeAvailable: number; goals: string[] }
  ) {
    // Analyze recent performance to suggest next quiz
    const recentQuizzes = userHistory.slice(0, 5)
    const avgScore = recentQuizzes.length > 0 
      ? recentQuizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0) / recentQuizzes.length
      : 0.5

    let suggestedDifficulty = options.difficulty
    let reason = "Based on your current difficulty preference"
    let confidence = 0.7

    if (recentQuizzes.length > 0) {
      if (avgScore > 0.8) {
        suggestedDifficulty = this.getNextDifficulty(options.difficulty, 'up')
        reason = "Excellent performance suggests you're ready for more challenging material"
        confidence = 0.85
      } else if (avgScore < 0.4) {
        suggestedDifficulty = this.getNextDifficulty(options.difficulty, 'down')
        reason = "Lower performance suggests reviewing fundamentals would be beneficial"
        confidence = 0.8
      }
    }

    return {
      category,
      difficulty: suggestedDifficulty,
      reason,
      confidence
    }
  }

  private static getNextDifficulty(current: string, direction: 'up' | 'down'): string {
    const difficulties = ['beginner', 'intermediate', 'advanced', 'expert']
    const currentIndex = difficulties.indexOf(current)
    
    if (direction === 'up' && currentIndex < difficulties.length - 1) {
      return difficulties[currentIndex + 1]
    } else if (direction === 'down' && currentIndex > 0) {
      return difficulties[currentIndex - 1]
    }
    
    return current
  }

  private static generateStudyPlan(
    category: string,
    weakAreas: string[],
    options: { difficulty: string; timeAvailable: number; goals: string[] }
  ): StudyPlanItem[] {
    return weakAreas.map((area, index) => ({
      week: index + 1,
      focus: area,
      activities: [
        `Review ${area} fundamentals`,
        `Practice ${area} problems`,
        `Take ${area} assessment`
      ],
      estimatedHours: Math.min(8, options.timeAvailable / weakAreas.length),
      resources: [`${area} tutorial`, `${area} practice set`],
      milestones: [`Complete ${area} basics`, `Score 80%+ on ${area} quiz`],
      prerequisites: index > 0 ? [weakAreas[index - 1]] : undefined,
      goals: [`Master ${area} concepts`, `Apply ${area} knowledge`]
    }))
  }

  private static analyzePerformance(userHistory: QuizResult[]): Record<string, unknown> {
    if (userHistory.length === 0) {
      return {
        trend: 'stable',
        improvement: 0,
        recommendations: ['Start with basic concepts', 'Take regular quizzes']
      }
    }

    const recentScores = userHistory.slice(0, 5).map(q => q.score / q.totalQuestions)
    const olderScores = userHistory.slice(5, 10).map(q => q.score / q.totalQuestions)

    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    const olderAvg = olderScores.length > 0 
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length 
      : recentAvg

    const improvement = recentAvg - olderAvg
    const trend = improvement > 0.1 ? 'improving' : improvement < -0.1 ? 'declining' : 'stable'

    const recommendations = []
    if (trend === 'improving') {
      recommendations.push('Keep up the excellent work!', 'Consider more challenging material')
    } else if (trend === 'declining') {
      recommendations.push('Review fundamental concepts', 'Practice more regularly')
    } else {
      recommendations.push('Maintain consistent practice', 'Focus on weak areas')
    }

    return {
      trend,
      improvement: Math.round(improvement * 100),
      recommendations,
      averageScore: Math.round(recentAvg * 100),
      totalQuizzes: userHistory.length
    }
  }

  private static getCategorySpecificAdvice(
    category: string,
    weakAreas: string[],
    strongAreas: string[]
  ): string {
    const advice: Record<string, string> = {
      'computer-science': `Focus on ${weakAreas.join(', ')} while building on your strengths in ${strongAreas.join(', ')}. Practice coding regularly and work on problem-solving skills.`,
      'mathematics': `Strengthen your understanding of ${weakAreas.join(', ')} through practice problems. Use your strong foundation in ${strongAreas.join(', ')} to tackle more complex topics.`,
      'physics': `Review ${weakAreas.join(', ')} concepts and practice problem-solving. Apply your knowledge of ${strongAreas.join(', ')} to understand related phenomena.`,
      'chemistry': `Focus on ${weakAreas.join(', ')} through hands-on practice and visualization. Build on your understanding of ${strongAreas.join(', ')}.`,
      'biology': `Study ${weakAreas.join(', ')} through diagrams and real-world examples. Use your knowledge of ${strongAreas.join(', ')} to understand complex biological systems.`
    }

    return advice[category] || `Focus on improving ${weakAreas.join(', ')} while maintaining your strengths in ${strongAreas.join(', ')}. Regular practice and review will help you succeed.`
  }
}

export function getFallbackRecommendations(
  userHistory: QuizResult[],
  category: string
): RuleBasedRecommendations {
  return {
    weakAreas: ['general_concepts'],
    strongAreas: [],
    recommendedResources: [],
    nextQuizSuggestion: {
      category,
      difficulty: 'beginner',
      reason: 'Default recommendation for new learners',
      confidence: 0.5
    },
    studyPlan: [],
    performanceInsights: {
      trend: 'stable',
      improvement: 0,
      recommendations: ['Start with basic concepts', 'Take regular quizzes']
    },
    categorySpecificAdvice: `Start with basic ${category} concepts and build your foundation gradually.`
  }
} 