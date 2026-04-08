import { useState } from 'react'
import type { VocabularyItem } from '../data/types'
import { playAudio } from '../utils/audio'

interface Props {
  vocabulary: VocabularyItem[]
}

export default function VocabularyStep({ vocabulary }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">
        Learn these words before reading the article. Tap a card to see more details.
      </p>
      {vocabulary.map((item, i) => (
        <VocabCard key={i} item={item} index={i} />
      ))}
    </div>
  )
}

function VocabCard({ item, index }: { item: VocabularyItem; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{index + 1}</span>
            <h3 className="font-bold text-lg text-gray-800">{item.word}</h3>
            <span className="text-xs text-gray-400 italic">{item.partOfSpeech}</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{item.pronunciation}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            playAudio(item.word, item.soundUrl)
          }}
          className="p-2 rounded-full active:bg-gray-100"
          aria-label={`Listen to ${item.word}`}
        >
          🔊
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <div>
            <p className="text-sm text-gray-700">{item.meaning}</p>
            {item.meaningZh && <p className="text-sm text-primary-dark mt-1">{item.meaningZh}</p>}
          </div>
          <div className="bg-surface rounded-lg p-3">
            <p className="text-sm text-gray-600 italic">"{item.example}"</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                playAudio(item.example)
              }}
              className="text-xs text-primary mt-1 active:text-primary-dark"
            >
              🔊 Listen to example
            </button>
          </div>
        </div>
      )}

      {!expanded && item.meaningZh && (
        <p className="text-sm text-primary-dark mt-1">{item.meaningZh}</p>
      )}
    </div>
  )
}
