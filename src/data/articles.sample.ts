import type { Article } from './types';

// Copy this file to articles.ts and add your own articles.
// articles.ts is gitignored so your data stays private.

export const articles: Article[] = [
  {
    id: 'example-article',
    title: 'Example Article Title',
    category: 'General',
    level: 'Beginner',
    date: '2026-01-01',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    summary: 'A short summary of the article content.',
    vocabulary: [
      {
        word: 'example',
        partOfSpeech: 'noun',
        pronunciation: '/ɪɡˈzæmpl/',
        meaning: 'a thing characteristic of its kind or illustrating a general rule',
        meaningZh: '範例',
        example: 'This is an example sentence.',
      },
    ],
    paragraphs: [
      'This is the first paragraph of the article.',
      'This is the second paragraph with more details.',
    ],
    questions: [
      {
        id: 1,
        question: 'What is this article about?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
      },
    ],
    discussion: [
      { id: 1, question: 'What do you think about this topic?' },
    ],
  },
];
