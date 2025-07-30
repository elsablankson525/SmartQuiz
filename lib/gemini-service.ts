import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface QuizRecommendationRequest {
  userId: string;
  userPerformance: {
    totalScore: number;
    averageScore: number;
    completedQuizzes: number;
    weakAreas: string[];
    strongAreas: string[];
  };
  availableSubjects: string[];
  userPreferences?: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    preferredSubjects: string[];
    studyTime: number; // in minutes
  };
}

export interface QuizRecommendation {
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reasoning: string;
  estimatedScore: number;
  studyTips: string[];
}

export interface StudyPlanRequest {
  userId: string;
  targetSubject: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  availableTime: number; // in minutes per day
  targetDate: string; // ISO date string
}

export interface StudyPlan {
  dailyGoals: {
    day: number;
    topics: string[];
    estimatedTime: number;
    practiceQuestions: number;
  }[];
  milestones: {
    week: number;
    description: string;
    assessment: string;
  }[];
  tips: string[];
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Public method to access the model
  async generateContent(prompt: string) {
    return await this.model.generateContent(prompt);
  }

  async generateQuizRecommendations(request: QuizRecommendationRequest): Promise<QuizRecommendation[]> {
    try {
      const prompt = `
        As an AI tutor, analyze the following student data and recommend the best quiz subjects for improvement:
        
        Student Performance:
        - Total Score: ${request.userPerformance.totalScore}
        - Average Score: ${request.userPerformance.averageScore}
        - Completed Quizzes: ${request.userPerformance.completedQuizzes}
        - Weak Areas: ${request.userPerformance.weakAreas.join(', ')}
        - Strong Areas: ${request.userPerformance.strongAreas.join(', ')}
        
        Available Subjects: ${request.availableSubjects.join(', ')}
        User Preferences: ${JSON.stringify(request.userPreferences)}
        
        Please provide 3-5 quiz recommendations in the following JSON format:
        [
          {
            "subject": "subject name",
            "difficulty": "beginner|intermediate|advanced",
            "reasoning": "explanation of why this quiz is recommended",
            "estimatedScore": 75,
            "studyTips": ["tip 1", "tip 2", "tip 3"]
          }
        ]
        
        Focus on:
        1. Addressing weak areas
        2. Building on strong areas
        3. Matching user's preferred difficulty level
        4. Providing actionable study tips
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating quiz recommendations:', error);
      return this.getFallbackRecommendations(request);
    }
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<StudyPlan> {
    try {
      const prompt = `
        Create a personalized study plan for a student with the following details:
        
        Subject: ${request.targetSubject}
        Current Level: ${request.currentLevel}
        Available Time: ${request.availableTime} minutes per day
        Target Date: ${request.targetDate}
        
        Please provide a comprehensive study plan in the following JSON format:
        {
          "dailyGoals": [
            {
              "day": 1,
              "topics": ["topic 1", "topic 2"],
              "estimatedTime": 30,
              "practiceQuestions": 10
            }
          ],
          "milestones": [
            {
              "week": 1,
              "description": "Complete basic concepts",
              "assessment": "Take a practice quiz on fundamentals"
            }
          ],
          "tips": ["Study tip 1", "Study tip 2"]
        }
        
        Make the plan:
        1. Realistic for the available time
        2. Progressive in difficulty
        3. Include regular assessments
        4. Provide practical study tips
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating study plan:', error);
      return this.getFallbackStudyPlan(request);
    }
  }

  async generateQuizQuestions(subject: string, difficulty: string, count: number = 5): Promise<Record<string, unknown>[]> {
    try {
      const prompt = `
        Generate ${count} multiple-choice quiz questions for ${subject} at ${difficulty} level.
        
        Format each question as:
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Why this answer is correct"
        }
        
        Make questions:
        1. Relevant to the subject and difficulty
        2. Clear and unambiguous
        3. Include explanations for learning
        4. Vary in complexity
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return [];
    }
  }

  private getFallbackRecommendations(request: QuizRecommendationRequest): QuizRecommendation[] {
    return [
      {
        subject: request.availableSubjects[0] || 'General Knowledge',
        difficulty: 'intermediate',
        reasoning: 'Based on your performance, this subject will help build a strong foundation.',
        estimatedScore: 70,
        studyTips: [
          'Review basic concepts first',
          'Practice with sample questions',
          'Focus on understanding rather than memorizing'
        ]
      }
    ];
  }

  private getFallbackStudyPlan(request: StudyPlanRequest): StudyPlan {
    return {
      dailyGoals: [
        {
          day: 1,
          topics: ['Introduction to ' + request.targetSubject],
          estimatedTime: request.availableTime,
          practiceQuestions: 5
        }
      ],
      milestones: [
        {
          week: 1,
          description: 'Complete basic concepts',
          assessment: 'Take a practice quiz on fundamentals'
        }
      ],
      tips: [
        'Study consistently every day',
        'Take regular breaks',
        'Practice with real questions'
      ]
    };
  }
}

export const geminiService = new GeminiService(); 