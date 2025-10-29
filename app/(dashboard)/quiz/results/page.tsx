"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizAnswer } from "@/lib/quiz-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from "lucide-react";
import { calculatePercentage } from "@/lib/utils";

export default function QuizResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => {
    const resultsData = sessionStorage.getItem("quizResults");
    if (resultsData) {
      setAnswers(JSON.parse(resultsData));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  if (answers.length === 0) {
    return null;
  }

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = calculatePercentage(correctAnswers, totalQuestions);
  const incorrectAnswers = answers.filter((a) => !a.isCorrect);

  const getGradeMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", color: "text-green-600" };
    if (percentage >= 80) return { message: "Great Job!", color: "text-blue-600" };
    if (percentage >= 70) return { message: "Good Work!", color: "text-yellow-600" };
    if (percentage >= 60) return { message: "Keep Practicing!", color: "text-orange-600" };
    return { message: "Keep Trying!", color: "text-red-600" };
  };

  const grade = getGradeMessage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card className="border-2 border-blue-500">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Quiz Complete!</h1>
              <p className={`text-2xl font-semibold mt-2 ${grade.color}`}>
                {grade.message}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm text-gray-600 mt-1">Score</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button onClick={() => router.push("/dashboard")} size="lg">
                <Home className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => {
                  sessionStorage.removeItem("quizResults");
                  router.back();
                  router.back();
                }}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incorrect Answers Review */}
      {incorrectAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Incorrect Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incorrectAnswers.map((answer, index) => (
              <div
                key={index}
                className="p-4 border-2 border-red-200 bg-red-50 rounded-lg"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">
                      Word: {answer.vocabularyWord.word} ({answer.vocabularyWord.reading})
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-600 font-medium min-w-[120px]">
                          Your Answer:
                        </span>
                        <span className="text-red-700">{answer.selectedAnswer}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-600 font-medium min-w-[120px]">
                          Correct Answer:
                        </span>
                        <span className="text-green-700 font-semibold">
                          {answer.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-red-200 mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Word:</span>{" "}
                      <span className="font-medium">{answer.vocabularyWord.word}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reading:</span>{" "}
                      <span className="font-medium">{answer.vocabularyWord.reading}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Meaning:</span>{" "}
                      <span className="font-medium">{answer.vocabularyWord.meaning}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Answers Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  answer.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {answer.vocabularyWord.word} ({answer.vocabularyWord.reading})
                    </div>
                    <div className="text-sm text-gray-600">
                      {answer.vocabularyWord.meaning}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  {answer.isCorrect ? (
                    <span className="text-green-700 font-medium">Correct</span>
                  ) : (
                    <span className="text-red-700 font-medium">Incorrect</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

