"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Layers,
  Loader2,
  PlayCircle,
} from "lucide-react";

interface VocabularyWord {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  order_index: number;
}

interface VocabularyList {
  id: string;
  episode_id: string;
}

function StudyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listId = searchParams.get("listId");

  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [listInfo, setListInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "flashcard">("list");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    if (listId) {
      fetchVocabularyList();
    } else {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, router]);

  const fetchVocabularyList = async () => {
    try {
      setLoading(true);

      // Fetch vocabulary list info
      const { data: list, error: listError } = await supabase
        .from("vocabulary_lists")
        .select(
          `
          *,
          episodes (
            episode_number,
            seasons (
              season_number,
              animes (
                name
              )
            )
          )
        `
        )
        .eq("id", listId)
        .single();

      if (listError) throw listError;
      setListInfo(list);

      // Fetch vocabulary words
      const { data: wordsData, error: wordsError } = await supabase
        .from("vocabulary_words")
        .select("*")
        .eq("vocabulary_list_id", listId)
        .order("order_index");

      if (wordsError) throw wordsError;
      setWords(wordsData || []);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowMeaning(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowMeaning(false);
    }
  };

  const handleFlipCard = () => {
    setShowMeaning(!showMeaning);
  };

  const handleStartQuiz = () => {
    router.push(`/quiz/setup?listId=${listId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Vocabulary Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This vocabulary list does not have any words yet.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const animeName = listInfo?.episodes?.seasons?.animes?.name || "Unknown";
  const seasonNumber = listInfo?.episodes?.seasons?.season_number || "?";
  const episodeNumber = listInfo?.episodes?.episode_number || "?";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Vocabulary</h1>
        <p className="text-gray-600">
          {animeName} - Season {seasonNumber}, Episode {episodeNumber}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {words.length} vocabulary word{words.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* View Mode Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === "flashcard" ? "default" : "outline"}
                onClick={() => {
                  setViewMode("flashcard");
                  setCurrentCardIndex(0);
                  setShowMeaning(false);
                }}
                size="sm"
              >
                <Layers className="h-4 w-4 mr-2" />
                Flashcards
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleStartQuiz} className="flex-1 sm:flex-none">
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>Vocabulary List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {words.map((word, index) => (
                <div
                  key={word.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-3 mb-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {word.word}
                        </h3>
                        <span className="text-lg text-gray-600">({word.reading})</span>
                      </div>
                      <p className="text-lg text-gray-700 ml-12">{word.meaning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcard View */}
      {viewMode === "flashcard" && (
        <div className="space-y-4">
          <Card className="border-2 border-blue-500">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <span className="text-sm font-semibold text-gray-600">
                  Card {currentCardIndex + 1} of {words.length}
                </span>
              </div>

              {/* Flashcard */}
              <div
                onClick={handleFlipCard}
                className="min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all"
              >
                {!showMeaning ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">Japanese Word</p>
                    <h2 className="text-5xl font-bold text-gray-900 mb-3">
                      {words[currentCardIndex].word}
                    </h2>
                    <p className="text-2xl text-gray-700">
                      ({words[currentCardIndex].reading})
                    </p>
                    <p className="text-sm text-gray-500 mt-8">
                      Click to reveal meaning
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">Meaning</p>
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">
                      {words[currentCardIndex].meaning}
                    </h2>
                    <div className="text-center mt-4">
                      <p className="text-xl text-gray-700">
                        {words[currentCardIndex].word}
                      </p>
                      <p className="text-lg text-gray-600">
                        ({words[currentCardIndex].reading})
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-8">
                      Click to hide meaning
                    </p>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  variant="outline"
                  size="lg"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={handleFlipCard}
                  variant={showMeaning ? "outline" : "default"}
                  size="lg"
                >
                  {showMeaning ? "Hide" : "Reveal"} Meaning
                </Button>

                <Button
                  onClick={handleNextCard}
                  disabled={currentCardIndex === words.length - 1}
                  variant="outline"
                  size="lg"
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentCardIndex + 1) / words.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {currentCardIndex + 1}
                </p>
                <p className="text-sm text-gray-600">Current Card</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-gray-900">{words.length}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {words.length - currentCardIndex - 1}
                </p>
                <p className="text-sm text-gray-600">Remaining</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <StudyContent />
    </Suspense>
  );
}

