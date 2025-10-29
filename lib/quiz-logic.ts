import { VocabularyWord, QuizType } from "./types/database.types";
import { shuffleArray } from "./utils";

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  correctIndex: number;
  vocabularyWord: VocabularyWord;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  vocabularyWord: VocabularyWord;
}

export function generateQuizQuestions(
  vocabularyWords: VocabularyWord[],
  quizType: QuizType,
  count: number
): QuizQuestion[] {
  // Shuffle and take the requested number of words
  const selectedWords = shuffleArray(vocabularyWords).slice(0, Math.min(count, vocabularyWords.length));

  return selectedWords.map((word) => {
    let question: string;
    let correctAnswer: string;
    let distractors: string[];

    switch (quizType) {
      case "meaning-from-word-reading":
        question = `What is the meaning of: ${word.word} (${word.reading})?`;
        correctAnswer = word.meaning;
        distractors = generateDistractors(
          vocabularyWords,
          word.id,
          (w) => w.meaning,
          3
        );
        break;

      case "word-from-meaning":
        question = `Which word means: ${word.meaning}?`;
        correctAnswer = word.word;
        distractors = generateDistractors(
          vocabularyWords,
          word.id,
          (w) => w.word,
          3
        );
        break;

      case "reading-from-word":
        question = `What is the reading of: ${word.word}?`;
        correctAnswer = word.reading;
        distractors = generateDistractors(
          vocabularyWords,
          word.id,
          (w) => w.reading,
          3
        );
        break;

      default:
        question = `What is the meaning of: ${word.word} (${word.reading})?`;
        correctAnswer = word.meaning;
        distractors = generateDistractors(
          vocabularyWords,
          word.id,
          (w) => w.meaning,
          3
        );
    }

    // Combine correct answer with distractors and shuffle
    const allOptions = [...distractors, correctAnswer];
    const shuffledOptions = shuffleArray(allOptions);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      id: word.id,
      question,
      correctAnswer,
      options: shuffledOptions,
      correctIndex,
      vocabularyWord: word,
    };
  });
}

function generateDistractors(
  allWords: VocabularyWord[],
  currentWordId: string,
  extractField: (word: VocabularyWord) => string,
  count: number
): string[] {
  const otherWords = allWords.filter((w) => w.id !== currentWordId);
  const shuffled = shuffleArray(otherWords);
  const distractors: string[] = [];

  for (const word of shuffled) {
    const value = extractField(word);
    if (!distractors.includes(value)) {
      distractors.push(value);
    }
    if (distractors.length >= count) {
      break;
    }
  }

  // If not enough unique distractors, pad with placeholders
  while (distractors.length < count) {
    distractors.push(`Option ${distractors.length + 1}`);
  }

  return distractors;
}

export function calculateScore(answers: QuizAnswer[]): {
  correct: number;
  total: number;
  percentage: number;
} {
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percentage };
}

