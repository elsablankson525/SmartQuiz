"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain, ArrowRight } from "lucide-react";

interface LessonQuizProps {
  quizId: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  topic?: string;
  explanation?: string;
  relatedConcepts?: string[];
  // correctAnswer?: string; // Not exposed for security
}

export default function LessonQuiz({ quizId }: LessonQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use quizId as topic for fetching questions
        const params = new URLSearchParams();
        params.append("topic", quizId);
        params.append("count", "5");
        params.append("random", "true");
        const res = await fetch(`/api/quiz-questions?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch quiz questions");
        const data = await res.json();
        setQuestions(data.questions);
      } catch {
        setError("Could not load quiz questions. Please try again later.");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (isAnswerSubmitted || !currentQuestion) return;
    setIsAnswerSubmitted(true);
    setShowExplanation(true);
    // For lesson quizzes, just show explanation and move to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }, 3000);
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (quizCompleted) return <div className="text-green-600 font-semibold">Quiz completed! Score: {score}/{questions.length}</div>;
  if (!currentQuestion) return <div>No quiz questions found.</div>;

  return (
    <div className="my-4">
      <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-4" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          {currentQuestion.topic && (
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{currentQuestion.topic}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{currentQuestion.difficulty}</Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option;
              // No correct answer info from API for security
              return (
                <Button
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto py-4 px-6 justify-start text-left border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-md' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswerSubmitted}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <span className={`flex-1 text-left ${
                      isSelected 
                        ? 'font-medium text-primary-foreground dark:text-primary-200' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {option}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-6 rounded-xl border-2 shadow-lg bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    Learning Explanation
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Here&apos;s why this is important to understand
                  </p>
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
              
              {currentQuestion.relatedConcepts && (
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                  <h5 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Related Concepts
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.relatedConcepts.map((concept) => (
                      <Badge key={concept} variant="secondary" className="text-xs">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            onClick={() => handleAnswerSubmit()}
            disabled={!selectedAnswer || isAnswerSubmitted}
          >
            {isAnswerSubmitted ? "Next Question" : "Submit Answer"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 