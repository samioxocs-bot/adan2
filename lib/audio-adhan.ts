// Real HTML5 MP3 Adhan Audio Player + Web Audio & SpeechSynthesis Fallback Engine
// Streams real recorded Adhan MP3 via /api/adhan-audio?id=... and notifies all UI listeners

import { MUEZZIN_PROFILES } from './prayer-engine'

export interface AdhanPlaybackState {
  isPlaying: boolean
  muezzinId: string | null
  currentTime: number
  duration: number
  volume: number
  mode: 'mp3' | 'synth' | 'idle'
  currentPhraseAr: string
}

type Listener = (state: AdhanPlaybackState) => void

let audioElement: HTMLAudioElement | null = null
let activeAudioCtx: AudioContext | null = null
let activeNodes: OscillatorNode[] = []
let stopTimeout: ReturnType<typeof setTimeout> | null = null
let phraseInterval: ReturnType<typeof setInterval> | null = null
let currentVolume = 0.9

const listeners = new Set<Listener>()

let state: AdhanPlaybackState = {
  isPlaying: false,
  muezzinId: null,
  currentTime: 0,
  duration: 0,
  volume: 0.9,
  mode: 'idle',
  currentPhraseAr: '',
}

const MAGHREBI_ADHAN_PHRASES = [
  'اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ (تثنية التكبير على المذهب المالكي)',
  'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ (مع الترجيع المغاربي الأصيل)',
  'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ ﷺ',
  'حَيَّ عَلَى الصَّلَاةِ ، حَيَّ عَلَى الصَّلَاةِ',
  'حَيَّ عَلَى الْفَلَاحِ ، حَيَّ عَلَى الْفَلَاحِ',
  'اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ — لَا إِلَٰهَ إِلَّا اللَّهُ',
]

const MASHRIQI_ADHAN_PHRASES = [
  'اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ',
  'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ',
  'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ ﷺ',
  'حَيَّ عَلَى الصَّلَاةِ ، حَيَّ عَلَى الصَّلَاةِ',
  'حَيَّ عَلَى الْفَلَاحِ ، حَيَّ عَلَى الْفَلَاحِ',
  'اللَّهُ أَكْبَرُ ، اللَّهُ أَكْبَرُ — لَا إِلَٰهَ إِلَّا اللَّهُ',
]

function notifyListeners() {
  listeners.forEach((fn) => fn({ ...state }))
}

export function subscribeAdhanState(listener: Listener): () => void {
  listeners.add(listener)
  listener({ ...state })
  return () => {
    listeners.delete(listener)
  }
}

export function getAdhanState(): AdhanPlaybackState {
  return { ...state }
}

export function setAdhanVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol))
  if (audioElement) {
    audioElement.volume = currentVolume
  }
  state = { ...state, volume: currentVolume }
  notifyListeners()
}

export function stopAdhanAudio() {
  if (stopTimeout) {
    clearTimeout(stopTimeout)
    stopTimeout = null
  }
  if (phraseInterval) {
    clearInterval(phraseInterval)
    phraseInterval = null
  }
  if (audioElement) {
    try {
      audioElement.pause()
      audioElement.currentTime = 0
      audioElement.src = ''
    } catch {
      // ignore
    }
    audioElement = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel()
    } catch {
      // ignore
    }
  }
  activeNodes.forEach((osc) => {
    try {
      osc.stop()
      osc.disconnect()
    } catch {
      // ignore
    }
  })
  activeNodes = []
  if (activeAudioCtx && activeAudioCtx.state !== 'closed') {
    activeAudioCtx.close().catch(() => {})
    activeAudioCtx = null
  }

  state = {
    ...state,
    isPlaying: false,
    muezzinId: null,
    currentTime: 0,
    duration: 0,
    mode: 'idle',
    currentPhraseAr: '',
  }
  notifyListeners()
}

export function triggerVibration(pattern: number[] = [200, 100, 200]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // ignore if unsupported
    }
  }
}

export function playPrePrayerChime(minutesBefore: 5 | 15) {
  stopAdhanAudio()
  if (typeof window === 'undefined') return

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  activeAudioCtx = ctx

  const notes =
    minutesBefore === 15
      ? [
          { freq: 440, start: 0, dur: 0.45 },
          { freq: 554.37, start: 0.4, dur: 0.55 },
          { freq: 659.25, start: 0.9, dur: 0.9 },
        ]
      : [
          { freq: 493.88, start: 0, dur: 0.35 },
          { freq: 523.25, start: 0.32, dur: 0.35 },
          { freq: 622.25, start: 0.65, dur: 0.45 },
          { freq: 659.25, start: 1.05, dur: 0.95 },
        ]

  notes.forEach((note) => {
    const osc = ctx.createOscillator()
    const sub = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start)

    sub.type = 'triangle'
    sub.frequency.setValueAtTime(note.freq * 0.5, ctx.currentTime + note.start)

    gain.gain.setValueAtTime(0.001, ctx.currentTime + note.start)
    gain.gain.exponentialRampToValueAtTime(
      0.3 * currentVolume,
      ctx.currentTime + note.start + 0.06
    )
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + note.start + note.dur
    )

    osc.connect(gain)
    sub.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + note.start)
    sub.start(ctx.currentTime + note.start)
    osc.stop(ctx.currentTime + note.start + note.dur + 0.05)
    sub.stop(ctx.currentTime + note.start + note.dur + 0.05)

    activeNodes.push(osc, sub)
  })
}

// Primary function to play full recorded MP3 Adhan by Muezzin ID (with automatic fallback)
export function playAdhanByMuezzinId(muezzinId: string, onEnded?: () => void) {
  stopAdhanAudio()
  if (typeof window === 'undefined') return

  const profile =
    MUEZZIN_PROFILES.find((m) => m.id === muezzinId) || MUEZZIN_PROFILES[0]
  const phrases =
    profile.region === 'maghreb'
      ? MAGHREBI_ADHAN_PHRASES
      : MASHRIQI_ADHAN_PHRASES

  state = {
    isPlaying: true,
    muezzinId: profile.id,
    currentTime: 0,
    duration: 45,
    volume: currentVolume,
    mode: 'mp3',
    currentPhraseAr: phrases[0],
  }
  notifyListeners()

  let phraseIdx = 0
  phraseInterval = setInterval(() => {
    phraseIdx = (phraseIdx + 1) % phrases.length
    state = { ...state, currentPhraseAr: phrases[phraseIdx] }
    notifyListeners()
  }, 5500)

  try {
    const audio = new Audio(profile.audioStreamUrl)
    audio.volume = currentVolume
    audio.preload = 'auto'
    audioElement = audio

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        state = { ...state, duration: Math.round(audio.duration) }
        notifyListeners()
      }
    })

    audio.addEventListener('timeupdate', () => {
      const progressRatio =
        audio.duration > 0 ? audio.currentTime / audio.duration : 0
      const computedIdx = Math.min(
        phrases.length - 1,
        Math.floor(progressRatio * phrases.length)
      )
      state = {
        ...state,
        currentTime: Math.round(audio.currentTime),
        duration:
          audio.duration && Number.isFinite(audio.duration)
            ? Math.round(audio.duration)
            : state.duration,
        currentPhraseAr: phrases[computedIdx] || phrases[0],
      }
      notifyListeners()
    })

    audio.addEventListener('ended', () => {
      stopAdhanAudio()
      onEnded?.()
    })

    audio.addEventListener('error', () => {
      // Fallback to rich synthesizer if audio stream is blocked or offline
      playSynthesizedFallback(profile.baseFreq, profile.id, phrases, onEnded)
    })

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playSynthesizedFallback(profile.baseFreq, profile.id, phrases, onEnded)
      })
    }
  } catch {
    playSynthesizedFallback(profile.baseFreq, profile.id, phrases, onEnded)
  }
}

function playSynthesizedFallback(
  baseFreq: number,
  muezzinId: string,
  phrases: string[],
  onEnded?: () => void
) {
  if (typeof window === 'undefined') return

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
  activeAudioCtx = ctx

  state = {
    ...state,
    isPlaying: true,
    muezzinId,
    mode: 'synth',
    duration: 14,
    currentTime: 0,
    currentPhraseAr: phrases[0],
  }
  notifyListeners()

  // Also use Arabic Web Speech API if available in browser
  if ('speechSynthesis' in window) {
    try {
      const utter = new SpeechSynthesisUtterance(
        'الله أكبر، الله أكبر، أشهد أن لا إله إلا الله، أشهد أن محمدا رسول الله، حي على الصلاة، حي على الفلاح، الله أكبر، لا إله إلا الله'
      )
      utter.lang = 'ar-MA'
      utter.rate = 0.78
      utter.pitch = 1.0
      utter.volume = currentVolume
      window.speechSynthesis.speak(utter)
    } catch {
      // ignore
    }
  }

  const steps = [
    { ratio: 1.0, start: 0.0, dur: 1.3 },
    { ratio: 1.25, start: 1.25, dur: 1.2 },
    { ratio: 1.333, start: 2.4, dur: 1.6 },
    { ratio: 1.5, start: 4.1, dur: 2.0 },
    { ratio: 1.6, start: 6.2, dur: 1.1 },
    { ratio: 1.5, start: 7.25, dur: 1.4 },
    { ratio: 1.26, start: 8.7, dur: 1.7 },
    { ratio: 1.067, start: 10.4, dur: 1.2 },
    { ratio: 1.0, start: 11.6, dur: 2.4 },
  ]

  steps.forEach((step) => {
    const osc = ctx.createOscillator()
    const harmonic = ctx.createOscillator()
    const vibrato = ctx.createOscillator()
    const vibratoGain = ctx.createGain()
    const gain = ctx.createGain()

    const freq = baseFreq * step.ratio
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + step.start)

    harmonic.type = 'triangle'
    harmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime + step.start)

    vibrato.frequency.setValueAtTime(5.0, ctx.currentTime + step.start)
    vibratoGain.gain.setValueAtTime(2.5, ctx.currentTime + step.start)
    vibrato.connect(vibratoGain)
    vibratoGain.connect(osc.frequency)

    const harmonicGain = ctx.createGain()
    harmonicGain.gain.setValueAtTime(0.08, ctx.currentTime + step.start)

    gain.gain.setValueAtTime(0.001, ctx.currentTime + step.start)
    gain.gain.linearRampToValueAtTime(
      0.32 * currentVolume,
      ctx.currentTime + step.start + 0.14
    )
    gain.gain.setValueAtTime(
      0.26 * currentVolume,
      ctx.currentTime + step.start + step.dur * 0.75
    )
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + step.start + step.dur
    )

    osc.connect(gain)
    harmonic.connect(harmonicGain)
    harmonicGain.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + step.start)
    harmonic.start(ctx.currentTime + step.start)
    vibrato.start(ctx.currentTime + step.start)

    const stopAt = ctx.currentTime + step.start + step.dur + 0.05
    osc.stop(stopAt)
    harmonic.stop(stopAt)
    vibrato.stop(stopAt)

    activeNodes.push(osc, harmonic, vibrato)
  })

  stopTimeout = setTimeout(() => {
    stopAdhanAudio()
    onEnded?.()
  }, 14200)
}

// Backwards-compatible helper used by existing components
export function playHarmonicAdhanPreview(
  baseFreqOrMuezzinId?: number | string,
  onEnded?: () => void
) {
  if (typeof baseFreqOrMuezzinId === 'string') {
    playAdhanByMuezzinId(baseFreqOrMuezzinId, onEnded)
    return
  }
  const matched =
    MUEZZIN_PROFILES.find((m) => m.baseFreq === baseFreqOrMuezzinId) ||
    MUEZZIN_PROFILES[0]
  playAdhanByMuezzinId(matched.id, onEnded)
}
