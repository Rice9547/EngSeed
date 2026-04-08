import type { ArticleListItem, Article } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchArticles(params?: {
  level?: string;
  category?: string;
  limit?: number;
}): Promise<ArticleListItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.level) searchParams.set('level', params.level);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return fetchJSON(`/api/articles${query ? `?${query}` : ''}`);
}

export async function fetchArticle(id: string): Promise<Article> {
  return fetchJSON(`/api/articles/${id}`);
}

export async function fetchCategories(): Promise<string[]> {
  return fetchJSON('/api/articles/categories');
}
