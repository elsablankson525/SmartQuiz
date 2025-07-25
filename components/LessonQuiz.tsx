import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Brain, ArrowRight } from "lucide-react";

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
  const [score, setScore] = useState(0);

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
      } catch (err) {
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

  const handleAnswerSubmit = (answer: string | null) => {
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
                  className="h-auto py-3 px-4 justify-start text-left"
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswerSubmitted}
                >
                  <span className="flex-1">{option}</span>
                </Button>
              );
            })}
          </div>
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Explanation
              </h4>
              <p className="text-sm text-muted-foreground mb-2">{currentQuestion.explanation}</p>
              {currentQuestion.relatedConcepts && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-muted-foreground">Related concepts:</span>
                  {currentQuestion.relatedConcepts.map((concept) => (
                    <Badge key={concept} variant="outline" className="text-xs">
                      {concept}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            onClick={() => handleAnswerSubmit(selectedAnswer)}
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