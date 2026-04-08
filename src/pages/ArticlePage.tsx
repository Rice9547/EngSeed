import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { articles } from '../data/articles'
import VocabularyStep from '../components/VocabularyStep'
import ReadingStep from '../components/ReadingStep'
import QuestionsStep from '../components/QuestionsStep'
import DiscussionStep from '../components/DiscussionStep'

const steps = ['Vocabulary', 'Reading', 'Questions', 'Discussion'] as const
type Step = (typeof steps)[number]

const stepIcons: Record<Step, string> = {
  Vocabulary: '📝',
  Reading: '📖',
  Questions: '❓',
  Discussion: '💬',
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('Vocabulary')

  useEffect(() => {
    speechSynthesis.cancel()
  }, [currentStep])

  useEffect(() => {
    return () => { speechSynthesis.cancel() }
  }, [])

  const article = articles.find(a => a.id === id)
  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500">Article not found</p>
          <button onClick={() => navigate('/')} className="mt-3 text-primary font-medium">
            Go back
          </button>
        </div>
      </div>
    )
  }

  const currentIndex = steps.indexOf(currentStep)

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="mr-3 text-gray-500 active:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800 truncate flex-1">
            {article.title}
          </h1>
        </div>

        {/* Step tabs */}
        <div className="flex border-t border-gray-50">
          {steps.map((step, i) => (
            <button
              key={step}
              onClick={() => {
                setCurrentStep(step)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors relative ${
                currentStep === step
                  ? 'text-primary'
                  : i <= currentIndex
                    ? 'text-gray-600'
                    : 'text-gray-400'
              }`}
            >
              <span className="block text-base mb-0.5">{stepIcons[step]}</span>
              {step}
              {currentStep === step && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {currentStep === 'Vocabulary' && <VocabularyStep vocabulary={article.vocabulary} />}
        {currentStep === 'Reading' && <ReadingStep article={article} />}
        {currentStep === 'Questions' && <QuestionsStep questions={article.questions} />}
        {currentStep === 'Discussion' && <DiscussionStep prompts={article.discussion} />}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium active:bg-gray-50"
          >
            ← {steps[currentIndex - 1]}
          </button>
        )}
        {currentIndex < steps.length - 1 ? (
          <button
            onClick={goNext}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-medium active:bg-primary-dark"
          >
            {steps[currentIndex + 1]} →
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium active:bg-green-600"
          >
            ✓ Complete
          </button>
        )}
      </div>
    </div>
  )
}
