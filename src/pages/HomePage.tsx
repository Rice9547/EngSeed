import { useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, type Article } from '../data/articles'

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const
const categories = ['All', ...new Set(articles.map(a => a.category))] as const

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-orange-100 text-orange-700',
}

const levelIcons: Record<string, string> = {
  Beginner: '🌱',
  Intermediate: '🌿',
  Advanced: '🌳',
}

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filtered = articles.filter(a => {
    if (selectedLevel !== 'All' && a.level !== selectedLevel) return false
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false
    return true
  })

  return (
    <div className="safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-primary-dark to-primary text-white px-4 py-4">
        <h1 className="text-xl font-bold">🌱 EngSeed</h1>
        <p className="text-sm text-emerald-200 mt-0.5">Grow your English, one day at a time</p>
      </header>

      {/* Filters */}
      <div className="px-4 pt-3 pb-2 space-y-2 bg-soil border-b border-stone-200">
        {/* Level filter */}
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
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
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
      </div>

      {/* Article List */}
      <div className="px-4 py-3 space-y-3">
        {filtered.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">No articles found</p>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/article/${article.id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm active:shadow-md transition-shadow"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[article.level]}`}>
            {levelIcons[article.level]} {article.level}
          </span>
          <span className="text-xs text-gray-400">{article.category}</span>
          <span className="text-xs text-gray-400 ml-auto">{article.date}</span>
        </div>
        <h2 className="font-semibold text-gray-800 text-base leading-snug">{article.title}</h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>📝 {article.vocabulary.length} words</span>
          <span>❓ {article.questions.length} questions</span>
          <span>💬 {article.discussion.length} topics</span>
        </div>
      </div>
    </Link>
  )
}
