import type { ArticleListItem, Article } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { ...options?.headers as Record<string, string> };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Articles ──

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

// ── Auth ──

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Wrong password');
    throw new Error(`Login failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchMe(): Promise<{ id: number; username: string }> {
  return fetchJSON('/api/auth/me');
}

// ── Completions ──

export interface CompletionStatus {
  article_id: string;
  steps: string[];
}

export async function fetchCompletions(): Promise<CompletionStatus[]> {
  return fetchJSON('/api/completions');
}

export async function fetchArticleCompletion(articleId: string): Promise<CompletionStatus> {
  return fetchJSON(`/api/completions/${articleId}`);
}

export async function markStepComplete(articleId: string, step: string): Promise<void> {
  await fetchJSON('/api/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId, step }),
  });
}

// ── Discussion Notes ──

export interface NoteResponse {
  prompt_id: number;
  content: string;
}

export async function fetchNotes(articleId: string): Promise<NoteResponse[]> {
  return fetchJSON(`/api/notes/${articleId}`);
}

export async function saveNote(articleId: string, promptId: number, content: string): Promise<void> {
  await fetchJSON('/api/notes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId, prompt_id: promptId, content }),
  });
}
