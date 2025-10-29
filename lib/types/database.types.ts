export type UserRole = "user" | "admin";

export type QuizType =
    | "meaning-from-word-reading"
    | "word-from-meaning"
    | "reading-from-word";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    is_ad_free: boolean;
    stripe_payment_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Anime {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Season {
    id: string;
    anime_id: string;
    season_number: number;
    created_at: string;
}

export interface Episode {
    id: string;
    season_id: string;
    episode_number: number;
    created_at: string;
    updated_at: string;
}

export interface VocabularyList {
    id: string;
    episode_id: string;
    csv_filename: string | null;
    uploaded_by: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface VocabularyWord {
    id: string;
    vocabulary_list_id: string;
    word: string;
    reading: string;
    meaning: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    vocabulary_list_id: string | null;
    quiz_type: string;
    total_questions: number;
    correct_answers: number;
    completed_at: string;
}

// Extended types with relations
export interface AnimeWithSeasons extends Anime {
    seasons: SeasonWithEpisodes[];
}

export interface SeasonWithEpisodes extends Season {
    episodes: EpisodeWithVocabulary[];
}

export interface EpisodeWithVocabulary extends Episode {
    vocabulary_lists: VocabularyList[];
}

export interface VocabularyListWithWords extends VocabularyList {
    vocabulary_words: VocabularyWord[];
}

