export interface VocabularyItem {
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  meaning: string;
  meaningZh: string;
  example: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface DiscussionPrompt {
  id: number;
  question: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
  imageUrl: string;
  summary: string;
  vocabulary: VocabularyItem[];
  paragraphs: string[];
  questions: Question[];
  discussion: DiscussionPrompt[];
}
