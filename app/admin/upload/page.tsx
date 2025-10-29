"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Trash2, Plus, Upload, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { slugify } from "@/lib/utils";

interface VocabularyRow {
  word: string;
  reading: string;
  meaning: string;
}

interface Anime {
  id: string;
  name: string;
}

interface Season {
  id: string;
  season_number: number;
}

interface Episode {
  id: string;
  episode_number: number;
}

export default function AdminUploadPage() {
  const { user } = useAuth();
  
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [selectedAnimeId, setSelectedAnimeId] = useState("");
  const [newAnimeName, setNewAnimeName] = useState("");
  
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [newSeasonNumber, setNewSeasonNumber] = useState("");
  
  const [selectedEpisodeId, setSelectedEpisodeId] = useState("");
  const [newEpisodeNumber, setNewEpisodeNumber] = useState("");

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [vocabularyData, setVocabularyData] = useState<VocabularyRow[]>([]);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnimes();
  }, []);

  useEffect(() => {
    if (selectedAnimeId) {
      fetchSeasons(selectedAnimeId);
    } else {
      setSeasons([]);
      setSelectedSeasonId("");
    }
  }, [selectedAnimeId]);

  useEffect(() => {
    if (selectedSeasonId) {
      fetchEpisodes(selectedSeasonId);
    } else {
      setEpisodes([]);
      setSelectedEpisodeId("");
    }
  }, [selectedSeasonId]);

  const fetchAnimes = async () => {
    const { data, error } = await supabase
      .from("animes")
      .select("*")
      .order("name");
    
    if (!error && data) {
      setAnimes(data);
    }
  };

  const fetchSeasons = async (animeId: string) => {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .eq("anime_id", animeId)
      .order("season_number");
    
    if (!error && data) {
      setSeasons(data);
    }
  };

  const fetchEpisodes = async (seasonId: string) => {
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .eq("season_id", seasonId)
      .order("episode_number");
    
    if (!error && data) {
      setEpisodes(data);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as VocabularyRow[];
        
        // Validate CSV structure
        if (data.length === 0) {
          setError("CSV file is empty");
          return;
        }

        const firstRow = data[0];
        if (!firstRow.word || !firstRow.reading || !firstRow.meaning) {
          setError("CSV must have 'word', 'reading', and 'meaning' columns");
          return;
        }

        setVocabularyData(data);
      },
      error: (error) => {
        setError("Failed to parse CSV: " + error.message);
      },
    });
  };

  const handleAddRow = () => {
    setVocabularyData([...vocabularyData, { word: "", reading: "", meaning: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setVocabularyData(vocabularyData.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof VocabularyRow, value: string) => {
    const newData = [...vocabularyData];
    newData[index][field] = value;
    setVocabularyData(newData);
  };

  const handlePublish = async (isPublished: boolean) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Get or create anime
      let animeId = selectedAnimeId;
      if (!animeId && newAnimeName) {
        const { data, error } = await supabase
          .from("animes")
          .insert({ name: newAnimeName, slug: slugify(newAnimeName) })
          .select()
          .single();
        
        if (error) throw error;
        animeId = data.id;
      }

      if (!animeId) {
        throw new Error("Please select or create an anime");
      }

      // Get or create season
      let seasonId = selectedSeasonId;
      if (!seasonId && newSeasonNumber) {
        const { data, error } = await supabase
          .from("seasons")
          .insert({
            anime_id: animeId,
            season_number: Number(newSeasonNumber),
          })
          .select()
          .single();
        
        if (error) throw error;
        seasonId = data.id;
      }

      if (!seasonId) {
        throw new Error("Please select or create a season");
      }

      // Get or create episode
      let episodeId = selectedEpisodeId;
      if (!episodeId && newEpisodeNumber) {
        const { data, error } = await supabase
          .from("episodes")
          .insert({
            season_id: seasonId,
            episode_number: Number(newEpisodeNumber),
          })
          .select()
          .single();
        
        if (error) throw error;
        episodeId = data.id;
      }

      if (!episodeId) {
        throw new Error("Please select or create an episode");
      }

      if (vocabularyData.length === 0) {
        throw new Error("Please upload a CSV file with vocabulary");
      }

      // Create vocabulary list
      const { data: listData, error: listError } = await supabase
        .from("vocabulary_lists")
        .insert({
          episode_id: episodeId,
          csv_filename: csvFile?.name || "manual-entry",
          uploaded_by: user?.id,
          is_published: isPublished,
        })
        .select()
        .single();

      if (listError) throw listError;

      // Insert vocabulary words
      const wordsToInsert = vocabularyData.map((row, index) => ({
        vocabulary_list_id: listData.id,
        word: row.word,
        reading: row.reading,
        meaning: row.meaning,
        order_index: index,
      }));

      const { error: wordsError } = await supabase
        .from("vocabulary_words")
        .insert(wordsToInsert);

      if (wordsError) throw wordsError;

      setSuccess(
        isPublished
          ? "Vocabulary list published successfully!"
          : "Vocabulary list saved as draft!"
      );

      // Reset form
      setTimeout(() => {
        setSelectedAnimeId("");
        setNewAnimeName("");
        setSelectedSeasonId("");
        setNewSeasonNumber("");
        setSelectedEpisodeId("");
        setNewEpisodeNumber("");
        setCsvFile(null);
        setVocabularyData([]);
        fetchAnimes();
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to save vocabulary list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Vocabulary</h1>
        <p className="text-gray-600">
          Create or select anime, season, and episode, then upload vocabulary
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Anime, Season & Episode Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Anime Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Existing Anime
              </label>
              <select
                value={selectedAnimeId}
                onChange={(e) => {
                  setSelectedAnimeId(e.target.value);
                  setNewAnimeName("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Anime --</option>
                {animes.map((anime) => (
                  <option key={anime.id} value={anime.id}>
                    {anime.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Create New Anime
              </label>
              <input
                type="text"
                value={newAnimeName}
                onChange={(e) => {
                  setNewAnimeName(e.target.value);
                  setSelectedAnimeId("");
                }}
                placeholder="Enter anime name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Season Selection */}
          {(selectedAnimeId || newAnimeName) && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Existing Season
                </label>
                <select
                  value={selectedSeasonId}
                  onChange={(e) => {
                    setSelectedSeasonId(e.target.value);
                    setNewSeasonNumber("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedAnimeId}
                >
                  <option value="">-- Select Season --</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      Season {season.season_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Create New Season
                </label>
                <input
                  type="number"
                  value={newSeasonNumber}
                  onChange={(e) => {
                    setNewSeasonNumber(e.target.value);
                    setSelectedSeasonId("");
                  }}
                  placeholder="Season number (e.g., 1)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Episode Selection */}
          {(selectedSeasonId || newSeasonNumber) && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Existing Episode
                </label>
                <select
                  value={selectedEpisodeId}
                  onChange={(e) => {
                    setSelectedEpisodeId(e.target.value);
                    setNewEpisodeNumber("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedSeasonId}
                >
                  <option value="">-- Select Episode --</option>
                  {episodes.map((episode) => (
                    <option key={episode.id} value={episode.id}>
                      Episode {episode.episode_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Create New Episode
                </label>
                <input
                  type="number"
                  value={newEpisodeNumber}
                  onChange={(e) => {
                    setNewEpisodeNumber(e.target.value);
                    setSelectedEpisodeId("");
                  }}
                  placeholder="Episode number (e.g., 1)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                CSV format: word, reading, meaning (UTF-8 encoding)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Table */}
      {vocabularyData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Vocabulary Preview ({vocabularyData.length} words)</CardTitle>
              <Button onClick={handleAddRow} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">Word (Japanese)</th>
                    <th className="text-left p-3 font-semibold">Reading (Hiragana)</th>
                    <th className="text-left p-3 font-semibold">Meaning (English)</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vocabularyData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{index + 1}</td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={row.word}
                          onChange={(e) => handleUpdateRow(index, "word", e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={row.reading}
                          onChange={(e) => handleUpdateRow(index, "reading", e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={row.meaning}
                          onChange={(e) => handleUpdateRow(index, "meaning", e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleRemoveRow(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button
                onClick={() => handlePublish(false)}
                disabled={loading}
                variant="outline"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : null}
                Save as Draft
              </Button>
              <Button
                onClick={() => handlePublish(true)}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

