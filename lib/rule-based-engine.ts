import type { QuizResult } from "./types"
import type { LearningPath } from "./learning-paths"
import type { LearningResource } from "./learning-resources"
import { getLearningResources } from "./recommendation-engine" // Use DB-based resource fetching
import { getLearningPaths } from "./learning-paths"
import { recommendLearningPaths } from "./learning-paths"

export interface RuleBasedRecommendation {
  resources: LearningResource[]
  nextQuizSuggestion: {
    category: string
    difficulty: string
    reason: string
  }
  learningPath?: LearningPath
  studyPlan: StudyPlanItem[]
  pathRecommendations?: { path: LearningPath; reason: string; matchScore: number }[]
}

export interface StudyPlanItem {
  week: number
  focus: string
  resources: string[]
  quizTopics: string[]
  goals: string[]
}

// Rule-based recommendation engine as fallback
export class RuleBasedEngine {
  // Main recommendation function
  static async generateRecommendations(
    userHistory: QuizResult[],
    currentCategory?: string,
    userPreferences?: {
      difficulty: string
      timeAvailable: number // hours per week
      goals: string[]
    },
  ): Promise<RuleBasedRecommendation> {
    // Rule 1: New user with no history
    if (userHistory.length === 0) {
      return await this.getNewUserRecommendations(currentCategory, userPreferences)
    }

    // Rule 2: User with limited history (< 5 quizzes)
    if (userHistory.length < 5) {
      return await this.getLimitedHistoryRecommendations(userHistory, userPreferences)
    }

    // Rule 3: Experienced user with performance patterns
    return await this.getExperiencedUserRecommendations(userHistory, userPreferences)
  }

  // Rule 1: New user recommendations
  private static async getNewUserRecommendations(
    category?: string,
    preferences?: { difficulty: string; timeAvailable: number; goals: string[] },
  ): Promise<RuleBasedRecommendation> {
    const targetCategory = category || "computer-science"
    const difficulty = preferences?.difficulty || "beginner"

    // Get beginner resources for the category from DB
    const dbResources = await getLearningResources(targetCategory)
    const resources = dbResources
      .filter(r => r.difficulty === "beginner")
      .slice(0, 5)
      .map(r => ({
        ...r,
        category: r.category || targetCategory,
        provider: r.provider || "Unknown",
        rating: r.rating || 0,
        tags: r.tags || [],
        language: r.language || "English",
        isFree: typeof r.isFree === "boolean" ? r.isFree : true,
      }))

    // Suggest starting with fundamentals
    const nextQuizSuggestion = {
      category: targetCategory,
      difficulty: "beginner",
      reason: "Start with fundamentals to build a strong foundation",
    }

    // Find appropriate learning path
    const learningPaths = await getLearningPaths()
    const learningPath = learningPaths.find(
      (path: any) => path.category === targetCategory && path.difficulty === "beginner"
    ) as LearningPath | undefined

    // Create basic study plan
    const studyPlan = this.createBeginnerStudyPlan(targetCategory)

    return {
      resources,
      nextQuizSuggestion,
      learningPath,
      studyPlan,
    }
  }

  // Rule 2: Limited history recommendations
  private static async getLimitedHistoryRecommendations(
    history: QuizResult[],
    preferences?: { difficulty: string; timeAvailable: number; goals: string[] },
  ): Promise<RuleBasedRecommendation> {
    const lastQuiz = history[history.length - 1]
    const averageScore =
      history.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions) * 100, 0) / history.length

    let difficulty: string
    let reason: string

    // Rule: If average score > 80%, increase difficulty
    if (averageScore > 80) {
      difficulty = this.getNextDifficulty(lastQuiz.difficulty)
      reason = "You're performing well! Ready for more challenging content"
    }
    // Rule: If average score < 50%, stay at current or decrease difficulty
    else if (averageScore < 50) {
      difficulty = this.getPreviousDifficulty(lastQuiz.difficulty)
      reason = "Focus on strengthening fundamentals before advancing"
    }
    // Rule: If average score 50-80%, continue at current level
    else {
      difficulty = lastQuiz.difficulty
      reason = "Continue practicing at your current level to build consistency"
    }

    // Fetch resources from DB
    const dbResources = await getLearningResources(lastQuiz.category)
    const resources = dbResources
      .filter(r => r.difficulty === difficulty)
      .slice(0, 5)
      .map(r => ({
        ...r,
        category: r.category || lastQuiz.category,
        provider: r.provider || "Unknown",
        rating: r.rating || 0,
        tags: r.tags || [],
        language: r.language || "English",
        isFree: typeof r.isFree === "boolean" ? r.isFree : true,
      }))

    const nextQuizSuggestion = {
      category: lastQuiz.category,
      difficulty,
      reason,
    }

    const studyPlan = this.createProgressiveStudyPlan(lastQuiz.category, difficulty)

    return {
      resources,
      nextQuizSuggestion,
      studyPlan,
    }
  }

  // Rule 3: Experienced user recommendations
  private static async getExperiencedUserRecommendations(
    history: QuizResult[],
    preferences?: { difficulty: string; timeAvailable: number; goals: string[] },
  ): Promise<RuleBasedRecommendation> {
    // Analyze performance by category
    const categoryPerformance = this.analyzeCategoryPerformance(history)

    // Find weakest category
    const weakestCategory = Object.entries(categoryPerformance).sort(
      ([, a], [, b]) => a.averageScore - b.averageScore,
    )[0]

    // Rule: Focus on weakest area if performance gap > 20%
    const performanceGap = this.calculatePerformanceGap(categoryPerformance)

    let targetCategory: string
    let difficulty: string
    let reason: string

    if (performanceGap > 20) {
      targetCategory = weakestCategory[0]
      difficulty = this.getAppropriatedifficulty(weakestCategory[1].averageScore)
      reason = `Focus on ${targetCategory} to improve your weakest area`
    } else {
      // Rule: Continue with strongest category at higher difficulty
      const strongestCategory = Object.entries(categoryPerformance).sort(
        ([, a], [, b]) => b.averageScore - a.averageScore,
      )[0]

      targetCategory = strongestCategory[0]
      difficulty = this.getNextDifficulty(
        this.getDominantDifficulty(history.filter((h) => h.category === targetCategory)),
      )
      reason = `Advance your expertise in ${targetCategory}`
    }

    // Fetch resources from DB
    const dbResources = await getLearningResources(targetCategory)
    const resources = dbResources
      .filter(r => r.difficulty === difficulty)
      .slice(0, 7)
      .map(r => ({
        ...r,
        category: r.category || targetCategory,
        provider: r.provider || "Unknown",
        rating: r.rating || 0,
        tags: r.tags || [],
        language: r.language || "English",
        isFree: typeof r.isFree === "boolean" ? r.isFree : true,
      }))

    const nextQuizSuggestion = {
      category: targetCategory,
      difficulty,
      reason,
    }

    // Find advanced learning path
    const learningPaths = await getLearningPaths()
    const learningPath = learningPaths.find(
      (path: any) => path.category === targetCategory && (path.difficulty === difficulty || path.difficulty === "advanced")
    ) as LearningPath | undefined

    const studyPlan = this.createAdvancedStudyPlan(targetCategory, difficulty, categoryPerformance)

    return {
      resources,
      nextQuizSuggestion,
      learningPath,
      studyPlan,
    }
  }

  // Helper methods
  private static getNextDifficulty(current: string): string {
    const levels = ["beginner", "intermediate", "advanced"]
    const currentIndex = levels.indexOf(current)
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current
  }

  private static getPreviousDifficulty(current: string): string {
    const levels = ["beginner", "intermediate", "advanced"]
    const currentIndex = levels.indexOf(current)
    return currentIndex > 0 ? levels[currentIndex - 1] : current
  }

  private static analyzeCategoryPerformance(history: QuizResult[]) {
    const performance: Record<string, { averageScore: number; count: number }> = {}

    history.forEach((quiz) => {
      const score = (quiz.score / quiz.totalQuestions) * 100
      if (!performance[quiz.category]) {
        performance[quiz.category] = { averageScore: 0, count: 0 }
      }

      const current = performance[quiz.category]
      performance[quiz.category] = {
        averageScore: (current.averageScore * current.count + score) / (current.count + 1),
        count: current.count + 1,
      }
    })

    return performance
  }

  private static calculatePerformanceGap(performance: Record<string, { averageScore: number; count: number }>): number {
    const scores = Object.values(performance).map((p) => p.averageScore)
    return Math.max(...scores) - Math.min(...scores)
  }

  private static getAppropriatedifficulty(averageScore: number): string {
    if (averageScore < 50) return "beginner"
    if (averageScore < 75) return "intermediate"
    return "advanced"
  }

  private static getDominantDifficulty(history: QuizResult[]): string {
    const difficulties = history.map((h) => h.difficulty)
    const counts = difficulties.reduce(
      (acc, diff) => {
        acc[diff] = (acc[diff] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0]
  }

  private static createBeginnerStudyPlan(category: string): StudyPlanItem[] {
    const plans: Record<string, StudyPlanItem[]> = {
      "computer-science": [
        {
          week: 1,
          focus: "Programming Fundamentals",
          resources: ["js-mdn-complete", "python-official-tutorial"],
          quizTopics: ["javascript", "python"],
          goals: ["Understand basic syntax", "Write simple programs"],
        },
        {
          week: 2,
          focus: "Data Types and Variables",
          resources: ["js-eloquent-book"],
          quizTopics: ["data-types", "variables"],
          goals: ["Master data types", "Variable manipulation"],
        },
      ],
      health: [
        {
          week: 1,
          focus: "Basic Anatomy",
          resources: ["anatomy-khan-academy"],
          quizTopics: ["anatomy"],
          goals: ["Learn body systems", "Understand organ functions"],
        },
      ],
    }

    return plans[category] || plans["computer-science"]
  }

  private static createProgressiveStudyPlan(category: string, difficulty: string): StudyPlanItem[] {
    // Create study plan based on category and difficulty
    return [
      {
        week: 1,
        focus: `${difficulty} concepts in ${category}`,
        resources: [],
        quizTopics: [category],
        goals: [`Master ${difficulty} level concepts`],
      },
    ]
  }

  private static createAdvancedStudyPlan(
    category: string,
    difficulty: string,
    performance: Record<string, { averageScore: number; count: number }>,
  ): StudyPlanItem[] {
    // Create advanced study plan with focus on weak areas
    return [
      {
        week: 1,
        focus: `Advanced ${category} concepts`,
        resources: [],
        quizTopics: [category],
        goals: [`Achieve mastery in ${category}`],
      },
    ]
  }

  // Add this utility function to select the right plan by learner type
  static getStudyPlanForSubjectAndLearnerType(subject: string, learnerType: 'slow' | 'inBetween' | 'fast'): StudyPlanItem[] {
    const plans: Record<string, Record<'slow' | 'inBetween' | 'fast', StudyPlanItem[]>> = {
      // Computer Science - JavaScript
      'javascript': {
        slow: [
          { week: 1, focus: 'Introduction & Syntax', resources: ['js-mdn-complete'], quizTopics: ['javascript'], goals: ['Understand JavaScript syntax', 'Write simple scripts'] },
          { week: 2, focus: 'Variables & Data Types', resources: ['js-eloquent-book'], quizTopics: ['javascript'], goals: ['Master variables', 'Work with data types'] },
          { week: 3, focus: 'Control Structures', resources: ['js-freecodecamp'], quizTopics: ['javascript'], goals: ['Use if/else, loops'] },
          { week: 4, focus: 'Functions & Review', resources: ['js-mdn-complete'], quizTopics: ['javascript'], goals: ['Write and use functions', 'Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Syntax, Variables, Data Types', resources: ['js-mdn-complete', 'js-eloquent-book'], quizTopics: ['javascript'], goals: ['Understand syntax', 'Work with variables and data types'] },
          { week: 2, focus: 'Control Structures & Functions', resources: ['js-freecodecamp'], quizTopics: ['javascript'], goals: ['Use control structures', 'Write functions'] },
        ],
        fast: [
          { week: 1, focus: 'All JavaScript Fundamentals', resources: ['js-mdn-complete', 'js-eloquent-book', 'js-freecodecamp'], quizTopics: ['javascript'], goals: ['Master all basics quickly'] },
        ],
      },
      // Computer Science - Python
      'python': {
        slow: [
          { week: 1, focus: 'Python Basics', resources: ['python-official-tutorial'], quizTopics: ['python'], goals: ['Understand Python syntax', 'Write simple scripts'] },
          { week: 2, focus: 'Data Types & Variables', resources: ['python-automate-book'], quizTopics: ['python'], goals: ['Work with data types and variables'] },
          { week: 3, focus: 'Control Flow', resources: ['python-coursera-michigan'], quizTopics: ['python'], goals: ['Use if/else, loops'] },
          { week: 4, focus: 'Functions & Review', resources: ['python-official-tutorial'], quizTopics: ['python'], goals: ['Write and use functions', 'Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Data Types, Variables', resources: ['python-official-tutorial', 'python-automate-book'], quizTopics: ['python'], goals: ['Understand basics', 'Work with variables'] },
          { week: 2, focus: 'Control Flow & Functions', resources: ['python-coursera-michigan'], quizTopics: ['python'], goals: ['Use control flow', 'Write functions'] },
        ],
        fast: [
          { week: 1, focus: 'All Python Fundamentals', resources: ['python-official-tutorial', 'python-automate-book', 'python-coursera-michigan'], quizTopics: ['python'], goals: ['Master all basics quickly'] },
        ],
      },
      // Computer Science - Algorithms
      'algorithms': {
        slow: [
          { week: 1, focus: 'Algorithm Basics', resources: ['algorithms-mit-course'], quizTopics: ['algorithms'], goals: ['Understand algorithm basics'] },
          { week: 2, focus: 'Sorting & Searching', resources: ['algorithms-visualizer'], quizTopics: ['algorithms'], goals: ['Learn sorting/searching algorithms'] },
          { week: 3, focus: 'Data Structures', resources: ['algorithms-mit-course'], quizTopics: ['algorithms'], goals: ['Understand data structures'] },
          { week: 4, focus: 'Algorithm Analysis', resources: ['algorithms-visualizer'], quizTopics: ['algorithms'], goals: ['Analyze algorithms'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Sorting, Data Structures', resources: ['algorithms-mit-course', 'algorithms-visualizer'], quizTopics: ['algorithms'], goals: ['Understand basics, sorting, data structures'] },
          { week: 2, focus: 'Algorithm Analysis', resources: ['algorithms-visualizer'], quizTopics: ['algorithms'], goals: ['Analyze algorithms'] },
        ],
        fast: [
          { week: 1, focus: 'All Algorithm Fundamentals', resources: ['algorithms-mit-course', 'algorithms-visualizer'], quizTopics: ['algorithms'], goals: ['Master all basics quickly'] },
        ],
      },
      // Health - Nutrition
      'nutrition': {
        slow: [
          { week: 1, focus: 'Nutrition Basics', resources: ['nutrition-harvard-course'], quizTopics: ['nutrition'], goals: ['Understand nutrition basics'] },
          { week: 2, focus: 'Macronutrients', resources: ['nutrition-nih-resources'], quizTopics: ['nutrition'], goals: ['Learn about macronutrients'] },
          { week: 3, focus: 'Micronutrients', resources: ['nutrition-precision-course'], quizTopics: ['nutrition'], goals: ['Learn about micronutrients'] },
          { week: 4, focus: 'Diet Planning', resources: ['nutrition-harvard-course'], quizTopics: ['nutrition'], goals: ['Plan a healthy diet'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Macro/Micronutrients', resources: ['nutrition-harvard-course', 'nutrition-nih-resources'], quizTopics: ['nutrition'], goals: ['Understand basics, nutrients'] },
          { week: 2, focus: 'Diet Planning', resources: ['nutrition-precision-course'], quizTopics: ['nutrition'], goals: ['Plan a healthy diet'] },
        ],
        fast: [
          { week: 1, focus: 'All Nutrition Fundamentals', resources: ['nutrition-harvard-course', 'nutrition-nih-resources', 'nutrition-precision-course'], quizTopics: ['nutrition'], goals: ['Master all basics quickly'] },
        ],
      },
      // Health - Anatomy
      'anatomy': {
        slow: [
          { week: 1, focus: 'Anatomy Basics', resources: ['anatomy-khan-academy'], quizTopics: ['anatomy'], goals: ['Understand anatomy basics'] },
          { week: 2, focus: 'Body Systems', resources: ['anatomy-visible-body'], quizTopics: ['anatomy'], goals: ['Learn about body systems'] },
          { week: 3, focus: 'Organs', resources: ['anatomy-khan-academy'], quizTopics: ['anatomy'], goals: ['Understand organ functions'] },
          { week: 4, focus: 'Review', resources: ['anatomy-visible-body'], quizTopics: ['anatomy'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Body Systems', resources: ['anatomy-khan-academy', 'anatomy-visible-body'], quizTopics: ['anatomy'], goals: ['Understand basics, body systems'] },
          { week: 2, focus: 'Organs & Review', resources: ['anatomy-khan-academy'], quizTopics: ['anatomy'], goals: ['Understand organs, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Anatomy Fundamentals', resources: ['anatomy-khan-academy', 'anatomy-visible-body'], quizTopics: ['anatomy'], goals: ['Master all basics quickly'] },
        ],
      },
      // Health - Mental Health
      'mental-health': {
        slow: [
          { week: 1, focus: 'Mental Health Basics', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Understand mental health basics'] },
          { week: 2, focus: 'Wellness Strategies', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Learn wellness strategies'] },
          { week: 3, focus: 'Psychology', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Understand psychology basics'] },
          { week: 4, focus: 'Review', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Wellness', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Understand basics, wellness'] },
          { week: 2, focus: 'Psychology & Review', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Understand psychology, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Mental Health Fundamentals', resources: ['mental-health-coursera'], quizTopics: ['mental-health'], goals: ['Master all basics quickly'] },
        ],
      },
      // Business - Strategy
      'strategy': {
        slow: [
          { week: 1, focus: 'Strategy Basics', resources: ['strategy-wharton-course'], quizTopics: ['strategy'], goals: ['Understand strategy basics'] },
          { week: 2, focus: 'Business Models', resources: ['strategy-hbr-articles'], quizTopics: ['strategy'], goals: ['Learn about business models'] },
          { week: 3, focus: 'Case Studies', resources: ['strategy-wharton-course'], quizTopics: ['strategy'], goals: ['Analyze case studies'] },
          { week: 4, focus: 'Review', resources: ['strategy-hbr-articles'], quizTopics: ['strategy'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Models', resources: ['strategy-wharton-course', 'strategy-hbr-articles'], quizTopics: ['strategy'], goals: ['Understand basics, models'] },
          { week: 2, focus: 'Case Studies & Review', resources: ['strategy-wharton-course'], quizTopics: ['strategy'], goals: ['Analyze case studies, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Strategy Fundamentals', resources: ['strategy-wharton-course', 'strategy-hbr-articles'], quizTopics: ['strategy'], goals: ['Master all basics quickly'] },
        ],
      },
      // Business - Finance
      'finance': {
        slow: [
          { week: 1, focus: 'Finance Basics', resources: ['finance-mit-course'], quizTopics: ['finance'], goals: ['Understand finance basics'] },
          { week: 2, focus: 'Corporate Finance', resources: ['finance-khan-academy'], quizTopics: ['finance'], goals: ['Learn about corporate finance'] },
          { week: 3, focus: 'Financial Analysis', resources: ['finance-mit-course'], quizTopics: ['finance'], goals: ['Analyze financial statements'] },
          { week: 4, focus: 'Review', resources: ['finance-khan-academy'], quizTopics: ['finance'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Corporate Finance', resources: ['finance-mit-course', 'finance-khan-academy'], quizTopics: ['finance'], goals: ['Understand basics, corporate finance'] },
          { week: 2, focus: 'Analysis & Review', resources: ['finance-mit-course'], quizTopics: ['finance'], goals: ['Analyze statements, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Finance Fundamentals', resources: ['finance-mit-course', 'finance-khan-academy'], quizTopics: ['finance'], goals: ['Master all basics quickly'] },
        ],
      },
      // Business - Marketing
      'marketing': {
        slow: [
          { week: 1, focus: 'Marketing Basics', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Understand marketing basics'] },
          { week: 2, focus: 'Digital Marketing', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Learn about digital marketing'] },
          { week: 3, focus: 'Campaigns', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Plan marketing campaigns'] },
          { week: 4, focus: 'Review', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Digital Marketing', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Understand basics, digital marketing'] },
          { week: 2, focus: 'Campaigns & Review', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Plan campaigns, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Marketing Fundamentals', resources: ['marketing-google-course'], quizTopics: ['marketing'], goals: ['Master all basics quickly'] },
        ],
      },
      // Law - Constitutional Law
      'constitutional-law': {
        slow: [
          { week: 1, focus: 'Constitutional Law Basics', resources: ['constitutional-yale-course'], quizTopics: ['constitutional-law'], goals: ['Understand constitutional law basics'] },
          { week: 2, focus: 'Supreme Court Cases', resources: ['constitutional-justia'], quizTopics: ['constitutional-law'], goals: ['Learn about Supreme Court cases'] },
          { week: 3, focus: 'Case Analysis', resources: ['constitutional-yale-course'], quizTopics: ['constitutional-law'], goals: ['Analyze cases'] },
          { week: 4, focus: 'Review', resources: ['constitutional-justia'], quizTopics: ['constitutional-law'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Supreme Court', resources: ['constitutional-yale-course', 'constitutional-justia'], quizTopics: ['constitutional-law'], goals: ['Understand basics, Supreme Court'] },
          { week: 2, focus: 'Case Analysis & Review', resources: ['constitutional-yale-course'], quizTopics: ['constitutional-law'], goals: ['Analyze cases, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Constitutional Law Fundamentals', resources: ['constitutional-yale-course', 'constitutional-justia'], quizTopics: ['constitutional-law'], goals: ['Master all basics quickly'] },
        ],
      },
      // Law - Contracts
      'contracts': {
        slow: [
          { week: 1, focus: 'Contract Law Basics', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Understand contract law basics'] },
          { week: 2, focus: 'Case Studies', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Analyze contract law cases'] },
          { week: 3, focus: 'Drafting Contracts', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Learn contract drafting'] },
          { week: 4, focus: 'Review', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Case Studies', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Understand basics, analyze cases'] },
          { week: 2, focus: 'Drafting & Review', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Learn drafting, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Contract Law Fundamentals', resources: ['contracts-harvard-course'], quizTopics: ['contracts'], goals: ['Master all basics quickly'] },
        ],
      },
      // Psychology - General Psychology
      'general-psychology': {
        slow: [
          { week: 1, focus: 'Psychology Basics', resources: ['psychology-yale-intro'], quizTopics: ['general-psychology'], goals: ['Understand psychology basics'] },
          { week: 2, focus: 'Research Methods', resources: ['psychology-apa-resources'], quizTopics: ['general-psychology'], goals: ['Learn about research methods'] },
          { week: 3, focus: 'Applications', resources: ['psychology-yale-intro'], quizTopics: ['general-psychology'], goals: ['Explore psychology applications'] },
          { week: 4, focus: 'Review', resources: ['psychology-apa-resources'], quizTopics: ['general-psychology'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Research Methods', resources: ['psychology-yale-intro', 'psychology-apa-resources'], quizTopics: ['general-psychology'], goals: ['Understand basics, research methods'] },
          { week: 2, focus: 'Applications & Review', resources: ['psychology-yale-intro'], quizTopics: ['general-psychology'], goals: ['Explore applications, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Psychology Fundamentals', resources: ['psychology-yale-intro', 'psychology-apa-resources'], quizTopics: ['general-psychology'], goals: ['Master all basics quickly'] },
        ],
      },
      // Psychology - Cognitive Science
      'cognitive-science': {
        slow: [
          { week: 1, focus: 'Cognitive Science Basics', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Understand cognitive science basics'] },
          { week: 2, focus: 'Neuroscience', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Learn about neuroscience'] },
          { week: 3, focus: 'Applications', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Explore cognitive science applications'] },
          { week: 4, focus: 'Review', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Neuroscience', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Understand basics, neuroscience'] },
          { week: 2, focus: 'Applications & Review', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Explore applications, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Cognitive Science Fundamentals', resources: ['cognitive-mit-course'], quizTopics: ['cognitive-science'], goals: ['Master all basics quickly'] },
        ],
      },
      // Mathematics - Calculus
      'calculus': {
        slow: [
          { week: 1, focus: 'Calculus Basics', resources: ['calculus-khan-academy'], quizTopics: ['calculus'], goals: ['Understand calculus basics'] },
          { week: 2, focus: 'Derivatives', resources: ['calculus-mit-course'], quizTopics: ['calculus'], goals: ['Learn about derivatives'] },
          { week: 3, focus: 'Integrals', resources: ['calculus-khan-academy'], quizTopics: ['calculus'], goals: ['Understand integrals'] },
          { week: 4, focus: 'Review', resources: ['calculus-mit-course'], quizTopics: ['calculus'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Derivatives', resources: ['calculus-khan-academy', 'calculus-mit-course'], quizTopics: ['calculus'], goals: ['Understand basics, derivatives'] },
          { week: 2, focus: 'Integrals & Review', resources: ['calculus-khan-academy'], quizTopics: ['calculus'], goals: ['Understand integrals, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Calculus Fundamentals', resources: ['calculus-khan-academy', 'calculus-mit-course'], quizTopics: ['calculus'], goals: ['Master all basics quickly'] },
        ],
      },
      // Mathematics - Statistics
      'statistics': {
        slow: [
          { week: 1, focus: 'Statistics Basics', resources: ['statistics-khan-academy'], quizTopics: ['statistics'], goals: ['Understand statistics basics'] },
          { week: 2, focus: 'Probability', resources: ['statistics-mit-course'], quizTopics: ['statistics'], goals: ['Learn about probability'] },
          { week: 3, focus: 'Data Analysis', resources: ['statistics-khan-academy'], quizTopics: ['statistics'], goals: ['Understand data analysis'] },
          { week: 4, focus: 'Review', resources: ['statistics-mit-course'], quizTopics: ['statistics'], goals: ['Review all topics'] },
        ],
        inBetween: [
          { week: 1, focus: 'Basics, Probability', resources: ['statistics-khan-academy', 'statistics-mit-course'], quizTopics: ['statistics'], goals: ['Understand basics, probability'] },
          { week: 2, focus: 'Data Analysis & Review', resources: ['statistics-khan-academy'], quizTopics: ['statistics'], goals: ['Understand data analysis, review'] },
        ],
        fast: [
          { week: 1, focus: 'All Statistics Fundamentals', resources: ['statistics-khan-academy', 'statistics-mit-course'], quizTopics: ['statistics'], goals: ['Master all basics quickly'] },
        ],
      },
    }
    // Default fallback if not found
    return plans[subject]?.[learnerType] || []
  }
}

// Fallback function for when AI recommendations fail
export async function getFallbackRecommendations(
  userHistory: QuizResult[],
  category?: string,
  preferences?: { difficulty: string; timeAvailable: number; goals: string[] },
): Promise<RuleBasedRecommendation> {
  try {
    return await RuleBasedEngine.generateRecommendations(userHistory, category, preferences)
  } catch (error) {
    console.error("Rule-based engine failed, using basic fallback:", error)

    // Ultimate fallback - basic recommendations from DB
    const dbResources = await getLearningResources(category || "computer-science")
    const fallbackResources = dbResources.slice(0, 3).map(r => ({
      ...r,
      category: r.category || (category || "computer-science"),
      provider: r.provider || "Unknown",
      rating: r.rating || 0,
      tags: r.tags || [],
      language: r.language || "English",
      isFree: typeof r.isFree === "boolean" ? r.isFree : true,
    }))
    return {
      resources: fallbackResources,
      nextQuizSuggestion: {
        category: category || "computer-science",
        difficulty: "beginner",
        reason: "Start with fundamentals",
      },
      studyPlan: [
        {
          week: 1,
          focus: "Getting Started",
          resources: [],
          quizTopics: ["fundamentals"],
          goals: ["Begin learning journey"],
        },
      ],
    }
  }
}
