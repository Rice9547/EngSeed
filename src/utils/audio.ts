/**
 * Play audio from URL if available, otherwise fall back to browser TTS.
 */
export function playAudio(text: string, soundUrl?: string) {
  speechSynthesis.cancel()

  if (soundUrl) {
    const audio = new Audio(soundUrl)
    audio.play().catch(() => {
      // Fallback to TTS if audio fails
      speakTTS(text)
    })
    return
  }

  speakTTS(text)
}

function speakTTS(text: string) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.85
  speechSynthesis.speak(utterance)
}
