"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { VocabularyWord, QuizType } from "@/lib/types/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

function QuizSetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listId = searchParams.get("listId");

  const [loading, setLoading] = useState(true);
  const [vocabularyCount, setVocabularyCount] = useState(0);
  const [quizType, setQuizType] = useState<QuizType>("meaning-from-word-reading");
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (!listId) return;

      try {
        const { data, error } = await supabase
          .from("vocabulary_words")
          .select("id")
          .eq("vocabulary_list_id", listId);

        if (error) throw error;
        setVocabularyCount(data.length);
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listId]);

  const getQuestionOptions = () => {
    const options = [10, 20, 30, 50];
    const validOptions = options.filter(opt => opt <= vocabularyCount);

    if (vocabularyCount > 0 && !validOptions.includes(vocabularyCount)) {
      validOptions.push(vocabularyCount);
    }

    return validOptions.sort((a, b) => a - b);
  };

  const handleStartQuiz = () => {
    const params = new URLSearchParams({
      listId: listId!,
      type: quizType,
      count: questionCount.toString(),
    });

    router.push(`/quiz?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!listId || vocabularyCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            No vocabulary list found. Please go back to the dashboard and select an episode.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const questionOptions = getQuestionOptions();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Setup</h1>
        <p className="text-gray-600">
          Configure your quiz before starting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quiz Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quiz Type
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="quizType"
                  value="meaning-from-word-reading"
                  checked={quizType === "meaning-from-word-reading"}
                  onChange={(e) => setQuizType(e.target.value as QuizType)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    Meaning from Word + Reading
                  </div>
                  <div className="text-sm text-gray-600">
                    Given a Japanese word with its reading, select the correct English meaning
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Example: &quot;進撃 (しんげき)&quot; → &quot;advance/attack&quot;
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="quizType"
                  value="word-from-meaning"
                  checked={quizType === "word-from-meaning"}
                  onChange={(e) => setQuizType(e.target.value as QuizType)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    Word from Meaning
                  </div>
                  <div className="text-sm text-gray-600">
                    Given an English meaning, select the correct Japanese word
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Example: &quot;advance/attack&quot; → &quot;進撃&quot;
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="quizType"
                  value="reading-from-word"
                  checked={quizType === "reading-from-word"}
                  onChange={(e) => setQuizType(e.target.value as QuizType)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    Reading from Word
                  </div>
                  <div className="text-sm text-gray-600">
                    Given a Japanese word, select the correct hiragana reading
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Example: &quot;進撃&quot; → &quot;しんげき&quot;
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {questionOptions.map((option) => (
                <option key={option} value={option}>
                  {option} {option === vocabularyCount ? "(All)" : "questions"}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Total vocabulary available: {vocabularyCount} words
            </p>
          </div>

          {/* Start Button */}
          <div className="pt-4">
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="w-full"
            >
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <QuizSetupContent />
    </Suspense>
  );
}

