import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles, fetchCategories, fetchCompletions } from '../data/api'
import { useAuth } from '../contexts/AuthContext'
import type { ArticleListItem } from '../data/types'

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Proficient'] as const

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-orange-100 text-orange-700',
  Proficient: 'bg-red-100 text-red-700',
}

const levelIcons: Record<string, string> = {
  Beginner: '🌱',
  Intermediate: '🌿',
  Advanced: '🌳',
  Proficient: '🌲',
}

export default function HomePage() {
  const { username, logout } = useAuth()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [completions, setCompletions] = useState<Record<string, string[]>>({})
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchCompletions()
      .then(list => {
        const map: Record<string, string[]> = {}
        for (const c of list) map[c.article_id] = c.steps
        setCompletions(map)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchArticles({
      level: selectedLevel !== 'All' ? selectedLevel : undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      limit: 50,
    })
      .then(setArticles)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [selectedLevel, selectedCategory])

  return (
    <div className="safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-primary-dark to-primary text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🌱 EngSeed</h1>
            <p className="text-sm text-emerald-200 mt-0.5">Grow your English, one day at a time</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-200">{username}</p>
            <button onClick={logout} className="text-xs text-emerald-300 active:text-white mt-0.5">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 pt-3 pb-2 space-y-2 bg-soil border-b border-stone-200">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-primary text-white'
                  : 'bg-white text-bark active:bg-stone-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-bark active:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article List */}
      <div className="px-4 py-3 space-y-3">
        {loading && (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        )}
        {error && (
          <p className="text-center text-red-400 py-10">Failed to load articles</p>
        )}
        {!loading && !error && articles.map(article => (
          <ArticleCard key={article.id} article={article} completedSteps={completions[article.id] || []} />
        ))}
        {!loading && !error && articles.length === 0 && (
          <p className="text-center text-gray-400 py-10">No articles found</p>
        )}
      </div>
    </div>
  )
}

const ALL_STEPS = ['vocabulary', 'reading', 'discussion']

function ArticleCard({ article, completedSteps }: { article: ArticleListItem; completedSteps: string[] }) {
  const done = ALL_STEPS.every(s => completedSteps.includes(s))

  return (
    <Link
      to={`/article/${article.id}`}
      className={`block bg-white rounded-xl overflow-hidden shadow-sm active:shadow-md transition-shadow ${done ? 'ring-2 ring-primary/30' : ''}`}
    >
      <div className="relative">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {done && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            ✓ Done
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[article.level] || 'bg-gray-100 text-gray-700'}`}>
            {levelIcons[article.level] || '📚'} {article.level}
          </span>
          <span className="text-xs text-gray-400">{article.category}</span>
          <span className="text-xs text-gray-400 ml-auto">{article.date}</span>
        </div>
        <h2 className="font-semibold text-gray-800 text-base leading-snug">{article.title}</h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>📝 {article.vocabulary_count} words</span>
          <span>💬 {article.discussion_count} topics</span>
          {completedSteps.length > 0 && !done && (
            <span className="ml-auto text-primary font-medium">{completedSteps.length}/{ALL_STEPS.length}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
