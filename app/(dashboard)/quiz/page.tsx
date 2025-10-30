"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/AuthContext";
import { VocabularyWord, QuizType } from "@/lib/types/database.types";
import { generateQuizQuestions, QuizQuestion, QuizAnswer } from "@/lib/quiz-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import AdSense from "@/components/AdSense";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const listId = searchParams.get("listId");
  const quizType = searchParams.get("type") as QuizType;
  const questionCount = Number(searchParams.get("count"));

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!listId || !quizType || !questionCount) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("vocabulary_words")
          .select("*")
          .eq("vocabulary_list_id", listId)
          .order("order_index");

        if (error) throw error;

        const quizQuestions = generateQuizQuestions(
          data as VocabularyWord[],
          quizType,
          questionCount
        );

        setQuestions(quizQuestions);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [listId, quizType, questionCount]);

  const handleSelectAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    const quizAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      vocabularyWord: currentQuestion.vocabularyWord,
    };

    setAnswers([...answers, quizAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Quiz completed
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const correctCount = answers.filter((a) => a.isCorrect).length;

    // Save quiz attempt
    try {
      await supabase.from("quiz_attempts").insert({
        user_id: user?.id,
        vocabulary_list_id: listId,
        quiz_type: quizType,
        total_questions: questions.length,
        correct_answers: correctCount,
      });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }

    // Navigate to results
    sessionStorage.setItem("quizResults", JSON.stringify(answers));
    router.push("/quiz/results");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Unable to load quiz. Please go back and try again.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Ad */}
      <AdSense adSlot="1234567890" className="my-4" />

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = answered && isCorrect;
            const showIncorrect = answered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={answered}
                className={cn(
                  "w-full p-4 text-left border-2 rounded-lg transition-all flex items-center justify-between",
                  !answered && "hover:bg-gray-50 cursor-pointer",
                  answered && "cursor-not-allowed",
                  !answered && !isSelected && "border-gray-300",
                  isSelected && !answered && "border-blue-500 bg-blue-50",
                  showCorrect && "border-green-500 bg-green-50",
                  showIncorrect && "border-red-500 bg-red-50"
                )}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-500 bg-gray-100 w-10 h-10 flex items-center justify-center rounded">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg">{option}</span>
                </div>
                {showCorrect && (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                )}
                {showIncorrect && (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                )}
              </button>
            );
          })}

          {answered && (
            <div className="pt-4">
              <Button onClick={handleNextQuestion} size="lg" className="w-full">
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "View Results"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Card */}
      {answered && (
        <Card
          className={cn(
            "border-2",
            selectedAnswer === currentQuestion.correctAnswer
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          )}
        >
          <CardContent className="pt-6">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Correct!</h4>
                  <p className="text-green-800">Great job! Keep it up.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Incorrect</h4>
                  <p className="text-red-800">
                    The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Word Details */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <h5 className="font-semibold text-gray-900 mb-2">Word Details:</h5>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Word:</span>{" "}
                  <span className="font-medium">{currentQuestion.vocabularyWord.word}</span>
                </p>
                <p>
                  <span className="text-gray-600">Reading:</span>{" "}
                  <span className="font-medium">{currentQuestion.vocabularyWord.reading}</span>
                </p>
                <p>
                  <span className="text-gray-600">Meaning:</span>{" "}
                  <span className="font-medium">{currentQuestion.vocabularyWord.meaning}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Ad */}
      <AdSense adSlot="0987654321" className="my-4" />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

