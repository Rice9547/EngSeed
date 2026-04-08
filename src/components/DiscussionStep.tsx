import { useState, useEffect, useRef } from 'react'
import type { DiscussionPrompt } from '../data/types'
import { useAuth } from '../contexts/AuthContext'
import { fetchNotes, saveNote } from '../data/api'

interface Props {
  articleId: string
  prompts: DiscussionPrompt[]
}

export default function DiscussionStep({ articleId, prompts }: Props) {
  const { username } = useAuth()
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [expandedId, setExpandedId] = useState<number | null>(prompts[0]?.id ?? null)
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  // Load saved notes
  useEffect(() => {
    if (!username) return
    fetchNotes(articleId)
      .then(list => {
        const map: Record<number, string> = {}
        for (const n of list) map[n.prompt_id] = n.content
        setNotes(map)
      })
      .catch(() => {})
  }, [articleId, username])

  const updateNote = (promptId: number, content: string) => {
    setNotes(prev => ({ ...prev, [promptId]: content }))

    // Auto-save with debounce (only when logged in)
    if (!username) return
    if (saveTimers.current[promptId]) clearTimeout(saveTimers.current[promptId])
    saveTimers.current[promptId] = setTimeout(() => {
      saveNote(articleId, promptId, content).catch(() => {})
    }, 1000)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Think about these questions and write your thoughts. Practice expressing your opinions in English.
      </p>

      <div className="space-y-3">
        {prompts.map((prompt, i) => (
          <div key={prompt.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
              className="w-full text-left p-4 flex items-start gap-3"
            >
              <span className="bg-primary/10 text-primary rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <p className="font-medium text-gray-800 text-sm leading-relaxed">
                {prompt.question}
              </p>
              {notes[prompt.id] && (
                <span className="text-xs text-primary ml-auto shrink-0">✎</span>
              )}
            </button>

            {expandedId === prompt.id && (
              <div className="px-4 pb-4">
                <textarea
                  value={notes[prompt.id] || ''}
                  onChange={(e) => updateNote(prompt.id, e.target.value)}
                  placeholder={username ? "Write your answer here... (auto-saved)" : "Write your answer here..."}
                  className="w-full h-32 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {(notes[prompt.id] || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => {
                      const text = notes[prompt.id]
                      if (text) {
                        const utterance = new SpeechSynthesisUtterance(text)
                        utterance.lang = 'en-US'
                        utterance.rate = 0.85
                        speechSynthesis.speak(utterance)
                      }
                    }}
                    className="text-xs text-primary active:text-primary-dark"
                  >
                    🔊 Listen to my answer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-5 bg-amber-50 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800">💡 Tips for Discussion</p>
        <ul className="text-xs text-amber-700 mt-2 space-y-1">
          <li>• Use complete sentences to practice grammar</li>
          <li>• Try to use the vocabulary words from this article</li>
          <li>• Give reasons and examples to support your opinions</li>
          <li>• Read your answer aloud to practice pronunciation</li>
        </ul>
      </div>
    </div>
  )
}
