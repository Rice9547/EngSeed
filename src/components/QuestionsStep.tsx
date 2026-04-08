import { useState } from 'react'
import type { Question } from '../data/types'

interface Props {
  questions: Question[]
}

export default function QuestionsStep({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const selectAnswer = (questionId: number, optionIndex: number) => {
    if (showResults) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined)
  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length

  const reset = () => {
    setAnswers({})
    setShowResults(false)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Answer the questions based on the article you just read.
      </p>

      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-medium text-gray-800 mb-3">
              <span className="text-primary mr-1">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, oi) => {
                const selected = answers[q.id] === oi
                const isCorrect = q.correctIndex === oi
                let style = 'border-gray-200 text-gray-700'

                if (showResults) {
                  if (isCorrect) {
                    style = 'border-green-400 bg-green-50 text-green-700'
                  } else if (selected && !isCorrect) {
                    style = 'border-red-400 bg-red-50 text-red-700'
                  }
                } else if (selected) {
                  style = 'border-primary bg-primary/5 text-primary'
                }

                return (
                  <button
                    key={oi}
                    onClick={() => selectAnswer(q.id, oi)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${style}`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {option}
                    {showResults && isCorrect && ' ✓'}
                    {showResults && selected && !isCorrect && ' ✗'}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit / Results */}
      <div className="mt-5">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            className={`w-full py-3 rounded-xl font-medium text-sm ${
              allAnswered
                ? 'bg-primary text-white active:bg-primary-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {allAnswered ? 'Check Answers' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
          </button>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">
              {correctCount} / {questions.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {correctCount === questions.length
                ? 'Perfect! Great job! 🎉'
                : correctCount >= questions.length / 2
                  ? 'Good work! Keep it up! 💪'
                  : 'Keep practicing! You can do it! 📚'}
            </p>
            <button
              onClick={reset}
              className="mt-3 px-6 py-2 rounded-xl border border-primary text-primary text-sm font-medium active:bg-primary/5"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
