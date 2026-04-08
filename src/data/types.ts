export interface VocabularyItem {
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  meaning: string;
  meaningZh: string;
  example: string;
  soundUrl?: string;
}

export interface Sentence {
  text: string;
  soundUrl?: string;
}

export interface Paragraph {
  text: string;
  sentences: Sentence[];
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

export interface ArticleListItem {
  id: string;
  title: string;
  category: string;
  level: string;
  date: string;
  image_url: string;
  summary: string;
  vocabulary_count: number;
  question_count: number;
  discussion_count: number;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  level: string;
  date: string;
  image_url: string;
  summary: string;
  vocabulary: VocabularyItem[];
  paragraphs: Paragraph[];
  questions: Question[];
  discussion: DiscussionPrompt[];
}
