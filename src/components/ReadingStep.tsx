import { useState, useCallback } from 'react'
import type { Article } from '../data/articles'

interface Props {
  article: Article
}

export default function ReadingStep({ article }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentParagraph, setCurrentParagraph] = useState(-1)
  const [fontSize, setFontSize] = useState(16)

  const speakAll = useCallback(() => {
    speechSynthesis.cancel()
    setIsPlaying(true)

    const paragraphs = article.paragraphs
    let index = 0

    const speakNext = () => {
      if (index >= paragraphs.length) {
        setIsPlaying(false)
        setCurrentParagraph(-1)
        return
      }
      setCurrentParagraph(index)
      const utterance = new SpeechSynthesisUtterance(paragraphs[index])
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.onend = () => {
        index++
        speakNext()
      }
      utterance.onerror = () => {
        setIsPlaying(false)
        setCurrentParagraph(-1)
      }
      speechSynthesis.speak(utterance)
    }

    speakNext()
  }, [article.paragraphs])

  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentParagraph(-1)
  }

  const speakParagraph = (text: string, index: number) => {
    speechSynthesis.cancel()
    setIsPlaying(true)
    setCurrentParagraph(index)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentParagraph(-1)
    }
    speechSynthesis.speak(utterance)
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={isPlaying ? stopSpeaking : speakAll}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${
            isPlaying
              ? 'bg-red-50 text-red-600 active:bg-red-100'
              : 'bg-primary text-white active:bg-primary-dark'
          }`}
        >
          {isPlaying ? '⏹ Stop' : '▶ Listen to Article'}
        </button>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setFontSize(f => Math.max(14, f - 2))}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm active:bg-gray-200"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(f => Math.min(22, f + 2))}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm active:bg-gray-200"
          >
            A+
          </button>
        </div>
      </div>

      {/* Article image */}
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      {/* Article content */}
      <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
        {article.paragraphs.map((paragraph, i) => (
          <p
            key={i}
            onClick={() => speakParagraph(paragraph, i)}
            className={`leading-relaxed transition-colors cursor-pointer rounded-lg px-2 py-1 -mx-2 ${
              currentParagraph === i
                ? 'bg-primary/10 text-primary-dark'
                : 'text-gray-700 active:bg-gray-50'
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
