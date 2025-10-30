"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoVocabulary } from "@/lib/demo-vocabulary";
import { generateQuizQuestions, QuizQuestion, QuizAnswer } from "@/lib/quiz-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DemoQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    // Generate 10 questions using the meaning-from-word-reading quiz type
    const quizQuestions = generateQuizQuestions(
      demoVocabulary,
      "meaning-from-word-reading",
      10
    );
    setQuestions(quizQuestions);
  }, []);

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

  const finishQuiz = () => {
    const allAnswers = [...answers];
    if (selectedAnswer) {
      allAnswers.push({
        questionId: questions[currentQuestionIndex].id,
        selectedAnswer,
        isCorrect: selectedAnswer === questions[currentQuestionIndex].correctAnswer,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        vocabularyWord: questions[currentQuestionIndex].vocabularyWord,
      });
    }

    sessionStorage.setItem("demoQuizResults", JSON.stringify(allAnswers));
    router.push("/demo/results");
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading demo quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">KOTOBAnime</span>
          </Link>
          <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
            <span className="font-semibold">Demo Quiz</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
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

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Demo Quiz:</strong> This is a sample quiz featuring vocabulary from Attack on Titan. 
              Sign up to access hundreds more vocabulary words from your favorite anime!
            </p>
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
                      <span className="font-medium text-lg">{currentQuestion.vocabularyWord.word}</span>
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
        </div>
      </div>
    </div>
  );
}

