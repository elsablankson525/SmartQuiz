"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Timer,
  Brain,
  Trophy,
  Loader2,
  BarChart3,
  BookOpen
} from "lucide-react";

import { AdvancedAIRecommendationPanel } from "@/components/advanced-ai-recommendation-panel";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number; // Total time remaining for the entire quiz
  questionTimeRemaining: number; // Time remaining for current question
  questionStartTime: number; // When the current question started
  isComplete: boolean;
  score: number;
  percentageScore: number;
  totalQuestions: number;
  showFeedback: boolean;
  submittedAnswers: Record<string, boolean>;
  questionTimes: Record<string, number>; // Track time spent on each question
}

export default function QuizPlayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 60,
    questionTimeRemaining: 60,
    questionStartTime: 0,
    isComplete: false,
    score: 0,
    percentageScore: 0,
    totalQuestions: 0,
    showFeedback: false,
    submittedAnswers: {},
    questionTimes: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Get quiz parameters from URL
  const category = searchParams.get("category") || "general";
  const difficulty = searchParams.get("difficulty") || "medium";
  const questionCount = parseInt(searchParams.get("count") || "10");
  const timeLimit = parseInt(searchParams.get("time") || "60");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load questions
  useEffect(() => {
    async function loadQuestions() {
      if (status !== "authenticated") return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/quiz-questions?category=${category}&difficulty=${difficulty}&count=${questionCount}`
        );
        
        if (!response.ok) throw new Error("Failed to load questions");
        
        const data = await response.json();
        console.log("Quiz questions response:", data);
        console.log("Questions array:", data.questions);
        console.log("Questions length:", data.questions?.length);
        setQuestions(data.questions || []);
        setQuizState(prev => ({
          ...prev,
          totalQuestions: data.questions?.length || 0,
          timeRemaining: timeLimit,
          questionTimeRemaining: timeLimit,
          questionStartTime: Date.now(),
          showFeedback: false,
          submittedAnswers: {},
          questionTimes: {},
        }));
      } catch (err) {
        setError("Could not load quiz questions. Please try again.");
        console.error("Error loading questions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [category, difficulty, questionCount, timeLimit, status]);

  // Timer effect for per-question timing
  useEffect(() => {
    if (!loading && !quizState.isComplete && quizState.questionTimeRemaining > 0) {
      const timer = setInterval(() => {
        setQuizState(prev => {
          // Update both total time and question time
          const newTotalTime = Math.max(0, prev.timeRemaining - 1);
          const newQuestionTime = Math.max(0, prev.questionTimeRemaining - 1);
          
          // If question time runs out, auto-submit current question
          if (newQuestionTime <= 0) {
            const currentQuestion = questions[prev.currentQuestionIndex];
            if (currentQuestion && !prev.submittedAnswers[currentQuestion.id]) {
              // Auto-submit the current question

              
              // Calculate time spent on this question
              const timeSpent = timeLimit - newQuestionTime;
              
              return {
                ...prev,
                questionTimeRemaining: 0,
                timeRemaining: newTotalTime,
                submittedAnswers: { ...prev.submittedAnswers, [currentQuestion.id]: true },
                questionTimes: { ...prev.questionTimes, [currentQuestion.id]: timeSpent },
                showFeedback: true,
              };
            }
          }
          
          // If total time runs out, end the quiz
          if (newTotalTime <= 0) {
            clearInterval(timer);
            return { ...prev, timeRemaining: 0, questionTimeRemaining: 0, isComplete: true };
          }
          
          return { 
            ...prev, 
            timeRemaining: newTotalTime,
            questionTimeRemaining: newQuestionTime
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, quizState.isComplete, quizState.questionTimeRemaining, questions, timeLimit]);

  const calculateResults = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = quizState.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = correctAnswers; // Store raw score (number of correct answers)
    const percentageScore = Math.round((correctAnswers / questions.length) * 100);
    setQuizState(prev => ({ ...prev, score, percentageScore }));
    setShowResults(true);
  }, [questions, quizState.answers]);

  // Auto-complete quiz when time runs out
  useEffect(() => {
    if (quizState.isComplete && !showResults) {
      calculateResults();
    }
  }, [quizState.isComplete, showResults, calculateResults]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  };

  const handleAnswerSubmit = (questionId: string) => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    if (!currentQuestion || quizState.submittedAnswers[questionId]) return;



    // Calculate time spent on this question
    const timeSpent = timeLimit - quizState.questionTimeRemaining;

    setQuizState(prev => ({
      ...prev,
      submittedAnswers: { ...prev.submittedAnswers, [questionId]: true },
      questionTimes: { ...prev.questionTimes, [questionId]: timeSpent },
      showFeedback: true,
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        questionTimeRemaining: timeLimit, // Reset timer for next question
        questionStartTime: Date.now(), // Reset start time for next question
        showFeedback: false
      }));
    } else {
      setQuizState(prev => ({ ...prev, isComplete: true }));
      calculateResults();
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        questionTimeRemaining: timeLimit, // Reset timer for previous question
        questionStartTime: Date.now(), // Reset start time for previous question
      }));
    }
  };

  const handleFinishQuiz = async () => {
    if (!session?.user?.email) return;

    try {
      // Prepare questionsAnswered data
      const questionsAnswered = questions.map(question => {
        const userAnswer = quizState.answers[question.id];
        return {
          question: question.question,
          userAnswer: userAnswer || '',
          correctAnswer: question.correctAnswer,
          isCorrect: userAnswer === question.correctAnswer,
          topic: category // Use category as topic for now
        };
      });

      const response = await fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.email,
          category,
          difficulty,
          score: quizState.score,
          totalQuestions: questions.length,
          timeSpent: Math.round(Object.values(quizState.questionTimes).reduce((sum, time) => sum + time, 0)),
          date: new Date().toISOString(),
          questionsAnswered
        })
      });

      if (response.ok) {
        router.push("/dashboard?message=Quiz completed successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error saving quiz result:", errorData);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Quiz</h2>
          <p className="text-muted-foreground">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Quiz</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Quiz Results Summary */}
          <Card className="text-center mb-6">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
              <CardDescription>
                Great job completing the {category} quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-3xl font-bold text-blue-600">{quizState.percentageScore}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="text-3xl font-bold text-green-600">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(Object.values(quizState.questionTimes).reduce((sum, time) => sum + time, 0) / questions.length)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Time/Question</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Correct Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {quizState.score}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Incorrect Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {questions.length - quizState.score}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleFinishQuiz} className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Save Results
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/quiz/new")}
                  className="gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced AI-Powered Recommendations */}
          {session?.user?.email && (
            <div className="space-y-6">
              {/* Enhanced Header for Advanced AI Recommendations */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Advanced AI Analysis
                    </h2>
                    <p className="text-muted-foreground">
                      Machine learning-powered insights and personalized recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>ML Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                    <span>Predictive Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Adaptive Learning</span>
                  </div>
                </div>
              </div>

              <AdvancedAIRecommendationPanel
                userId={session.user.email}
                quizResult={{
                  id: 'temp-id',
                  userId: session.user.email,
                  category,
                  difficulty,
                  score: quizState.score,
                  totalQuestions: questions.length,
                  timeSpent: Math.round(Object.values(quizState.questionTimes).reduce((sum, time) => sum + time, 0)),
                  date: new Date().toISOString(),
                  questionsAnswered: questions.map(question => {
                    const userAnswer = quizState.answers[question.id];
                    return {
                      question: question.question,
                      userAnswer: userAnswer || '',
                      correctAnswer: question.correctAnswer,
                      isCorrect: userAnswer === question.correctAnswer,
                      topic: category
                    };
                  })
                }}
                questions={questions as unknown as Record<string, unknown>[]}
                userHistory={[]}
                learnerType="inBetween"
                onResourceClick={(resource: Record<string, unknown>) => {
                  if (resource.url) {
                    window.open(resource.url as string, '_blank');
                  }
                }}
              />

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  View Dashboard
                </Button>
                <Button 
                  onClick={() => router.push("/analytics")}
                  variant="outline"
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Detailed Analytics
                </Button>
                <Button 
                  onClick={() => router.push("/learning-paths")}
                  variant="outline"
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Learning Paths
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log("Questions array length:", questions.length);
  console.log("Current question index:", quizState.currentQuestionIndex);
  console.log("Questions array:", questions);
  
  const currentQuestion = questions[quizState.currentQuestionIndex];
  console.log("Current question:", currentQuestion);
  
  const progress = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Quiz Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{category} Quiz</h1>
                <p className="text-muted-foreground">Difficulty: {difficulty}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <Timer className={cn("h-5 w-5", {
                      "text-red-500": quizState.questionTimeRemaining <= 10,
                      "text-orange-500": quizState.questionTimeRemaining > 10
                    })} />
                    <span className={cn("text-lg font-bold", {
                      "text-red-500": quizState.questionTimeRemaining <= 10,
                      "text-orange-500": quizState.questionTimeRemaining > 10 && quizState.questionTimeRemaining <= 30,
                    })}>
                      {Math.floor(quizState.questionTimeRemaining / 60)}:
                      {(quizState.questionTimeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Time Remaining</p>
                  {quizState.questionTimeRemaining <= 10 && (
                    <p className="text-xs text-red-500 font-medium">Time running out!</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{quizState.currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        {questions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
                <p className="text-muted-foreground mb-4">
                  No questions found for the selected category and difficulty.
                </p>
                <Button onClick={() => router.push("/quiz/new")}>
                  Choose Different Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : currentQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-sm font-normal text-muted-foreground">
                  Question {quizState.currentQuestionIndex + 1}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">{currentQuestion.question}</h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = quizState.answers[currentQuestion.id] === option;
                    const isSubmitted = quizState.submittedAnswers[currentQuestion.id];
                    const isCorrect = option === currentQuestion.correctAnswer;
                    
                    let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ';
                    let textClass = '';
                    
                    if (isSubmitted) {
                      if (isCorrect) {
                        buttonClass += 'border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md';
                        textClass = 'text-green-800 dark:text-green-200 font-medium';
                      } else if (isSelected) {
                        buttonClass += 'border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md';
                        textClass = 'text-red-800 dark:text-red-200 font-medium';
                      } else {
                        buttonClass += 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600';
                        textClass = 'text-gray-600 dark:text-gray-400';
                      }
                    } else {
                      if (isSelected) {
                        buttonClass += 'border-primary bg-primary/10 dark:bg-primary/20 shadow-sm';
                        textClass = 'text-primary-foreground dark:text-primary-200 font-medium';
                      } else {
                        buttonClass += 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10';
                        textClass = 'text-gray-800 dark:text-gray-200';
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                        className={buttonClass}
                        disabled={isSubmitted}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSubmitted && isCorrect
                              ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
                              : isSubmitted && isSelected && !isCorrect
                              ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                              : isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && !isSubmitted && <CheckCircle className="h-5 w-5" />}
                            {isSubmitted && isCorrect && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                            {isSubmitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                          </div>
                          <span className={textClass}>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Section */}
              {quizState.submittedAnswers[currentQuestion.id] && (
                <div className={`mt-6 p-6 rounded-xl border-2 shadow-lg ${
                  quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <div>
                      <h4 className={`text-lg font-bold ${
                        quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer 
                          ? "Excellent! That's Correct!" 
                          : "Not quite right, but that's okay!"}
                      </h4>
                      <p className={`text-sm ${
                        quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer
                          ? 'text-green-600 dark:text-green-300'
                          : 'text-red-600 dark:text-red-300'
                      }`}>
                        {quizState.answers[currentQuestion.id] === currentQuestion.correctAnswer
                          ? "Great job! You've got this concept down."
                          : "Let's learn from this and improve!"}
                      </p>
                    </div>
                  </div>
                  
                  {currentQuestion.explanation && (
                    <div className="mb-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                      <h5 className="font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Brain className="h-4 w-4" />
                        Explanation
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Answer:</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {quizState.answers[currentQuestion.id]}
                      </p>
                    </div>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Correct Answer:</p>
                      <p className="font-semibold text-green-700 dark:text-green-300">
                        {currentQuestion.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={quizState.currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {!quizState.submittedAnswers[currentQuestion.id] ? (
                  <Button
                    onClick={() => handleAnswerSubmit(currentQuestion.id)}
                    disabled={!quizState.answers[currentQuestion.id]}
                    className="gap-2"
                  >
                    Submit Answer
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="gap-2"
                  >
                    {quizState.currentQuestionIndex === questions.length - 1 ? (
                      <>
                        Finish Quiz
                        <Trophy className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
