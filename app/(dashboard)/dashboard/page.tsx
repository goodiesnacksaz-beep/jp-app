"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AnimeWithSeasons } from "@/lib/types/database.types";
import { ChevronDown, ChevronRight, PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DashboardPage() {
  const [animes, setAnimes] = useState<AnimeWithSeasons[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAnimes, setExpandedAnimes] = useState<Set<string>>(new Set());
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnimes();
  }, []);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      
      // Fetch animes with seasons, episodes, and vocabulary lists
      const { data: animesData, error: animesError } = await supabase
        .from("animes")
        .select("*")
        .order("name");

      if (animesError) throw animesError;

      // Fetch all seasons
      const { data: seasonsData, error: seasonsError } = await supabase
        .from("seasons")
        .select("*")
        .order("season_number");

      if (seasonsError) throw seasonsError;

      // Fetch all episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from("episodes")
        .select("*")
        .order("episode_number");

      if (episodesError) throw episodesError;

      // Fetch published vocabulary lists
      const { data: vocabListsData, error: vocabError } = await supabase
        .from("vocabulary_lists")
        .select("*")
        .eq("is_published", true);

      if (vocabError) throw vocabError;

      // Build nested structure
      const animesWithData = animesData.map((anime) => {
        const animeSeasons = seasonsData
          .filter((season) => season.anime_id === anime.id)
          .map((season) => {
            const seasonEpisodes = episodesData
              .filter((episode) => episode.season_id === season.id)
              .map((episode) => ({
                ...episode,
                vocabulary_lists: vocabListsData.filter(
                  (list) => list.episode_id === episode.id
                ),
              }));

            return {
              ...season,
              episodes: seasonEpisodes,
            };
          });

        return {
          ...anime,
          seasons: animeSeasons,
        };
      });

      setAnimes(animesWithData);
    } catch (error) {
      console.error("Error fetching animes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnime = (animeId: string) => {
    const newExpanded = new Set(expandedAnimes);
    if (newExpanded.has(animeId)) {
      newExpanded.delete(animeId);
    } else {
      newExpanded.add(animeId);
    }
    setExpandedAnimes(newExpanded);
  };

  const toggleSeason = (seasonId: string) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId);
    } else {
      newExpanded.add(seasonId);
    }
    setExpandedSeasons(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (animes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Anime Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            There are no anime with vocabulary lists available yet. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Select an anime episode to start learning vocabulary
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anime Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {animes.map((anime) => (
              <div key={anime.id} className="border rounded-lg overflow-hidden">
                {/* Anime Header */}
                <button
                  onClick={() => toggleAnime(anime.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedAnimes.has(anime.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="font-semibold text-lg text-gray-900">
                      {anime.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {anime.seasons.length} season{anime.seasons.length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Seasons */}
                {expandedAnimes.has(anime.id) && (
                  <div className="border-t bg-gray-50">
                    {anime.seasons.map((season) => (
                      <div key={season.id} className="border-b last:border-b-0">
                        <button
                          onClick={() => toggleSeason(season.id)}
                          className="w-full flex items-center justify-between p-3 pl-12 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            {expandedSeasons.has(season.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="font-medium text-gray-800">
                              Season {season.season_number}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {season.episodes.length} episode{season.episodes.length !== 1 ? "s" : ""}
                          </span>
                        </button>

                        {/* Episodes */}
                        {expandedSeasons.has(season.id) && (
                          <div className="bg-white">
                            {season.episodes.map((episode) => (
                              <div
                                key={episode.id}
                                className="flex items-center justify-between p-3 pl-20 hover:bg-gray-50 transition-colors border-t"
                              >
                                <div className="flex items-center space-x-2">
                                  <PlayCircle className="h-4 w-4 text-blue-600" />
                                  <span className="text-gray-700">
                                    Episode {episode.episode_number}
                                  </span>
                                  {episode.vocabulary_lists.length > 0 && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      Available
                                    </span>
                                  )}
                                </div>
                                {episode.vocabulary_lists.length > 0 && (
                                  <Link
                                    href={`/quiz/setup?listId=${episode.vocabulary_lists[0].id}`}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    Start Quiz
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
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

