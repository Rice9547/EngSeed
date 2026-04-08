import { useState, useCallback, useRef } from 'react'
import type { Article, Paragraph } from '../data/types'

interface Props {
  article: Article
}

export default function ReadingStep({ article }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentParagraph, setCurrentParagraph] = useState(-1)
  const [fontSize, setFontSize] = useState(16)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAll = () => {
    speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentParagraph(-1)
  }

  const playParagraphAudio = useCallback((para: Paragraph): Promise<void> => {
    return new Promise<void>((resolve) => {
      // Collect all sentence audio URLs for this paragraph
      const audioUrls = para.sentences
        .map(s => s.soundUrl)
        .filter((url): url is string => !!url)

      if (audioUrls.length > 0) {
        // Play sentence audios sequentially
        let i = 0
        const playNext = () => {
          if (i >= audioUrls.length) {
            resolve()
            return
          }
          const audio = new Audio(audioUrls[i])
          audioRef.current = audio
          audio.onended = () => { i++; playNext() }
          audio.onerror = () => { i++; playNext() }
          audio.play().catch(() => { i++; playNext() })
        }
        playNext()
      } else {
        // Fallback to TTS
        const utterance = new SpeechSynthesisUtterance(para.text)
        utterance.lang = 'en-US'
        utterance.rate = 0.85
        utterance.onend = () => resolve()
        utterance.onerror = () => resolve()
        speechSynthesis.speak(utterance)
      }
    })
  }, [])

  const playAll = useCallback(async () => {
    stopAll()
    setIsPlaying(true)

    for (let i = 0; i < article.paragraphs.length; i++) {
      setCurrentParagraph(i)
      await playParagraphAudio(article.paragraphs[i])
    }

    setIsPlaying(false)
    setCurrentParagraph(-1)
  }, [article.paragraphs, playParagraphAudio])

  const playOne = (para: Paragraph, index: number) => {
    stopAll()
    setIsPlaying(true)
    setCurrentParagraph(index)
    playParagraphAudio(para).then(() => {
      setIsPlaying(false)
      setCurrentParagraph(-1)
    })
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={isPlaying ? stopAll : playAll}
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
        src={article.image_url}
        alt={article.title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      {/* Article content */}
      <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
        {article.paragraphs.map((para, i) => (
          <p
            key={i}
            onClick={() => playOne(para, i)}
            className={`leading-relaxed transition-colors cursor-pointer rounded-lg px-2 py-1 -mx-2 ${
              currentParagraph === i
                ? 'bg-primary/10 text-primary-dark'
                : 'text-gray-700 active:bg-gray-50'
            }`}
          >
            {para.text}
          </p>
        ))}
      </div>
    </div>
  )
}
