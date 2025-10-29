"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";

interface VocabularyList {
  id: string;
  csv_filename: string;
  is_published: boolean;
  created_at: string;
  episode: {
    id: string;
    episode_number: number;
    season: {
      id: string;
      season_number: number;
      anime: {
        id: string;
        name: string;
      };
    };
  };
  word_count?: number;
}

export default function AdminManagePage() {
  const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnimes, setExpandedAnimes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVocabularyLists();
  }, []);

  const fetchVocabularyLists = async () => {
    try {
      setLoading(true);

      const { data: listsData, error: listsError } = await supabase
        .from("vocabulary_lists")
        .select(`
          *,
          episode:episodes (
            id,
            episode_number,
            season:seasons (
              id,
              season_number,
              anime:animes (
                id,
                name
              )
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (listsError) throw listsError;

      // Fetch word counts for each list
      const listsWithCounts = await Promise.all(
        listsData.map(async (list) => {
          const { count } = await supabase
            .from("vocabulary_words")
            .select("*", { count: "exact", head: true })
            .eq("vocabulary_list_id", list.id);

          return {
            ...list,
            word_count: count || 0,
          };
        })
      );

      setVocabularyLists(listsWithCounts as VocabularyList[]);
    } catch (error) {
      console.error("Error fetching vocabulary lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (listId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("vocabulary_lists")
        .update({ is_published: !currentStatus })
        .eq("id", listId);

      if (error) throw error;

      // Refresh the list
      fetchVocabularyLists();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status");
    }
  };

  const handleDelete = async (listId: string) => {
    if (!confirm("Are you sure you want to delete this vocabulary list? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete vocabulary words first (cascade should handle this, but being explicit)
      await supabase
        .from("vocabulary_words")
        .delete()
        .eq("vocabulary_list_id", listId);

      // Delete vocabulary list
      const { error } = await supabase
        .from("vocabulary_lists")
        .delete()
        .eq("id", listId);

      if (error) throw error;

      // Refresh the list
      fetchVocabularyLists();
    } catch (error) {
      console.error("Error deleting vocabulary list:", error);
      alert("Failed to delete vocabulary list");
    }
  };

  const toggleAnime = (animeName: string) => {
    const newExpanded = new Set(expandedAnimes);
    if (newExpanded.has(animeName)) {
      newExpanded.delete(animeName);
    } else {
      newExpanded.add(animeName);
    }
    setExpandedAnimes(newExpanded);
  };

  // Group lists by anime
  const groupedLists = vocabularyLists.reduce((acc, list) => {
    const animeName = list.episode.season.anime.name;
    if (!acc[animeName]) {
      acc[animeName] = [];
    }
    acc[animeName].push(list);
    return acc;
  }, {} as Record<string, VocabularyList[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (vocabularyLists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Content Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            No vocabulary lists have been uploaded yet. Go to the Upload page to add content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Content</h1>
        <p className="text-gray-600">
          View, edit, publish/unpublish, and delete vocabulary lists
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vocabulary Lists ({vocabularyLists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(groupedLists).map((animeName) => (
              <div key={animeName} className="border rounded-lg overflow-hidden">
                {/* Anime Header */}
                <button
                  onClick={() => toggleAnime(animeName)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedAnimes.has(animeName) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="font-semibold text-lg">{animeName}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {groupedLists[animeName].length} list{groupedLists[animeName].length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Lists */}
                {expandedAnimes.has(animeName) && (
                  <div className="divide-y">
                    {groupedLists[animeName].map((list) => (
                      <div key={list.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-medium text-gray-900">
                                Season {list.episode.season.season_number}, Episode{" "}
                                {list.episode.episode_number}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  list.is_published
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {list.is_published ? "Published" : "Draft"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Words: {list.word_count}</div>
                              <div>File: {list.csv_filename}</div>
                              <div>
                                Created: {new Date(list.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleTogglePublish(list.id, list.is_published)}
                              variant="outline"
                              size="sm"
                            >
                              {list.is_published ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDelete(list.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

