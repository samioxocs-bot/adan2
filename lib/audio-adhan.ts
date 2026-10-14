// Web Audio API Harmonic Adhan & Pre-Prayer Chime Synthesizer
// Produces warm, resonant Maqam-tuned spiritual tones & pre-adhan alerts without external audio dependencies

let activeAudioCtx: AudioContext | null = null
let activeNodes: OscillatorNode[] = []
let stopTimeout: ReturnType<typeof setTimeout> | null = null

export function stopAdhanAudio() {
  if (stopTimeout) {
    clearTimeout(stopTimeout)
    stopTimeout = null
  }
  activeNodes.forEach((osc) => {
    try {
      osc.stop()
      osc.disconnect()
    } catch {
      // ignore already stopped
    }
  })
  activeNodes = []
  if (activeAudioCtx && activeAudioCtx.state !== 'closed') {
    activeAudioCtx.close().catch(() => {})
    activeAudioCtx = null
  }
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

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  activeAudioCtx = ctx

  // 15-min uses warm emerald fifth intervals; 5-min uses urgent golden Hijaz cadence
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
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + note.start + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.start + note.dur)

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

// Plays a serene Maqam Hijaz / Bayati melodic Takbeer & Shahada resonance
export function playHarmonicAdhanPreview(baseFreq = 293.66, onEnded?: () => void) {
  stopAdhanAudio()
  if (typeof window === 'undefined') return

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  activeAudioCtx = ctx

  // Maqam Hijaz intervals relative to root: 1, b2 (1.067), 3 (1.26), 4 (1.333), 5 (1.5), b6 (1.6), 7 (1.875)
  const phrase = [
    { ratio: 1.0, start: 0.0, dur: 0.9 },
    { ratio: 1.333, start: 0.85, dur: 0.8 },
    { ratio: 1.5, start: 1.6, dur: 1.4 },
    { ratio: 1.6, start: 3.1, dur: 0.6 },
    { ratio: 1.5, start: 3.65, dur: 0.7 },
    { ratio: 1.26, start: 4.3, dur: 1.1 },
    { ratio: 1.067, start: 5.35, dur: 0.75 },
    { ratio: 1.0, start: 6.05, dur: 1.8 },
  ]

  phrase.forEach((step) => {
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

    // Subtle vocal-like Maqam vibrato
    vibrato.frequency.setValueAtTime(5.2, ctx.currentTime + step.start)
    vibratoGain.gain.setValueAtTime(2.4, ctx.currentTime + step.start)
    vibrato.connect(vibratoGain)
    vibratoGain.connect(osc.frequency)

    const harmonicGain = ctx.createGain()
    harmonicGain.gain.setValueAtTime(0.06, ctx.currentTime + step.start)

    gain.gain.setValueAtTime(0.001, ctx.currentTime + step.start)
    gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + step.start + 0.14)
    gain.gain.setValueAtTime(0.2, ctx.currentTime + step.start + step.dur * 0.7)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + step.start + step.dur)

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
  }, 8000)
}
