/**
 * Ovozire: fișiere WAV preînregistrate (vocea Ioana) — funcționează sigur în Chrome.
 * Fallback: Web Speech API, dacă lipsește fișierul.
 */

let audioCtx = null
let currentAudio = null
let unlocked = false
let preferredVoiceURI = null

const BASE = '/audio/ro'

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) audioCtx = new AC()
  }
  return audioCtx
}

export function unlockAudio() {
  unlocked = true
  const ctx = getCtx()
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {})
  // „trezește” redarea audio cu un sunet foarte scurt
  try {
    const a = new Audio(`${BASE}/ui/este.wav`)
    a.volume = 0.01
    a.play().then(() => {
      a.pause()
      a.currentTime = 0
    }).catch(() => {})
  } catch {
    /* ignore */
  }
}

function stopCurrent() {
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
    } catch {
      /* ignore */
    }
    currentAudio = null
  }
  try {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
}

/**
 * Redă un fișier WAV. Returnează Promise care se rezolvă la final.
 */
export function playUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false)
      return
    }
    stopCurrent()
    unlockAudio()
    try {
      const a = new Audio(url)
      a.preload = 'auto'
      a.volume = 1
      currentAudio = a
      a.onended = () => {
        if (currentAudio === a) currentAudio = null
        resolve(true)
      }
      a.onerror = () => {
        if (currentAudio === a) currentAudio = null
        resolve(false)
      }
      const p = a.play()
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          // autoplay blocat — încearcă din nou după micro-gest
          resolve(false)
        })
      }
    } catch {
      resolve(false)
    }
  })
}

export function speakUi(key, enabled = true) {
  if (enabled === false || !key) return Promise.resolve(false)
  return playUrl(`${BASE}/ui/${key}.wav`)
}

/** variant: '' | 'ok' | 'wrong' */
export function speakName(countryId, variant = '', enabled = true) {
  if (enabled === false || !countryId) return Promise.resolve(false)
  const file = variant ? `${countryId}_${variant}` : countryId
  return playUrl(`${BASE}/name/${file}.wav`)
}

export function speakCapital(countryId, variant = '', enabled = true) {
  if (enabled === false || !countryId) return Promise.resolve(false)
  const file = variant ? `${countryId}_${variant}` : countryId
  return playUrl(`${BASE}/capital/${file}.wav`)
}

/**
 * Întrebare: „A cărei țări este această capitală?”
 * (apoi, opțional, numele capitalei)
 */
export async function speakWhichCapital(countryId, enabled = true) {
  if (enabled === false) return
  await speakUi('whichCapital', true)
  // spune și capitala, ca să fie clar la ce se referă
  if (countryId) await speakCapital(countryId, '', true)
}

export function speakUiLater(key, enabled = true, delayMs = 350) {
  if (enabled === false) return
  setTimeout(() => {
    speakUi(key, true)
  }, delayMs)
}

export function speakNameLater(countryId, variant = '', enabled = true, delayMs = 350) {
  if (enabled === false) return
  setTimeout(() => {
    speakName(countryId, variant, true)
  }, delayMs)
}

/* ---------- Compat: text liber (fallback speechSynthesis) ---------- */

function pickVoice() {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices() || []
  if (preferredVoiceURI) {
    const p = voices.find((v) => v.voiceURI === preferredVoiceURI)
    if (p) return p
  }
  return (
    voices.find((v) => (v.lang || '').toLowerCase().startsWith('ro')) ||
    voices.find((v) => /ioana/i.test(v.name || '')) ||
    voices[0] ||
    null
  )
}

/** Mapare text → fișier UI, dacă se potrivește */
const TEXT_TO_UI = {
  'Ce țară are acest steag?': 'whichCountry',
  'Ce steag e acesta?': 'whichCountry',
  'Care este capitala?': 'whichCapital',
  'A cărei țări este această capitală?': 'whichCapital',
  'A cărei țări este capitala?': 'whichCapitalShort',
  'Care este capitala acestei țări?': 'whichCapitalOfCountry',
  'Foarte bine!': 'correct',
  'Bravo!': 'correct',
  'Mai încearcă o dată!': 'wrong',
  'Aproape!': 'wrong',
  'Ai terminat nivelul!': 'levelComplete',
  'Super! Ai terminat!': 'levelComplete',
  'Lumea Steagurilor': 'appName',
  'Hai la joacă!': 'play',
  'Alege un joc': 'modes',
  'Ce steag e acesta?': 'modeGuessFlag',
  'Care e capitala?': 'modeGuessCapital',
  'Găsește perechea': 'modePairs',
  'Găsește perechea!': 'tapTwoCards',
  'Puzzle cu steag': 'modePuzzle',
  'Călătorie prin lume': 'modeJourney',
  'Atinge două cartonașe care se potrivesc': 'tapTwoCards',
  'Mai joacă o dată': 'again',
  'Mai joacă o dată!': 'again',
}

export function speakRomanian(text, enabled = true) {
  if (enabled === false || !text) return

  const phrase = String(text).trim()

  // 1) fișier UI cunoscut
  const uiKey = TEXT_TO_UI[phrase]
  if (uiKey) {
    speakUi(uiKey, true)
    return
  }

  // 2) „Lumea Steagurilor. …”
  if (phrase.startsWith('Lumea Steagurilor')) {
    speakUi('appName', true)
    return
  }

  // 3) fallback speechSynthesis
  if (!window.speechSynthesis) return
  unlockAudio()
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(phrase)
    u.lang = 'ro-RO'
    u.rate = 0.92
    u.volume = 1
    const v = pickVoice()
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}

export function speakRomanianLater(text, enabled = true, delayMs = 350) {
  if (enabled === false) return
  setTimeout(() => speakRomanian(text, true), delayMs)
}

/* ---------- Settings helpers ---------- */

export function getAllVoices() {
  if (!window.speechSynthesis) return []
  return window.speechSynthesis.getVoices() || []
}

export function getRomanianVoices() {
  return getAllVoices().filter((v) => (v.lang || '').toLowerCase().startsWith('ro'))
}

export function hasRomanianVoice() {
  return true // avem fișiere Ioana
}

export function setPreferredVoiceURI(uri) {
  preferredVoiceURI = uri || null
  try {
    if (uri) localStorage.setItem('lumea-steagurilor-voice', uri)
    else localStorage.removeItem('lumea-steagurilor-voice')
  } catch {
    /* ignore */
  }
}

export function loadPreferredVoiceURI() {
  try {
    preferredVoiceURI = localStorage.getItem('lumea-steagurilor-voice')
  } catch {
    preferredVoiceURI = null
  }
  return preferredVoiceURI
}

export function preloadVoices() {
  loadPreferredVoiceURI()
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      window.speechSynthesis.getVoices()
    })
  }
  // preload întrebarea principală
  try {
    const a = new Audio(`${BASE}/ui/whichCountry.wav`)
    a.preload = 'auto'
  } catch {
    /* ignore */
  }
}

export function installAudioUnlock() {
  if (typeof window === 'undefined') return
  const fn = () => unlockAudio()
  window.addEventListener('pointerdown', fn, { capture: true, passive: true })
  window.addEventListener('touchstart', fn, { capture: true, passive: true })
}

/* ---------- bip-uri ---------- */

function makeBeepWav(freq, durationSec, volume = 0.28) {
  const sampleRate = 22050
  const n = Math.floor(sampleRate * durationSec)
  const dataSize = n * 2
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  const w = (o, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i))
  }
  w(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  w(8, 'WAVE')
  w(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  w(36, 'data')
  view.setUint32(40, dataSize, true)
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate
    const env = Math.min(1, t * 40) * Math.min(1, (durationSec - t) * 40)
    const sample = Math.sin(2 * Math.PI * freq * t) * volume * env
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample)) * 0x7fff, true)
  }
  const bytes = new Uint8Array(buffer)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return `data:audio/wav;base64,${btoa(bin)}`
}

function playWav(freq, dur, vol = 0.28) {
  try {
    const a = new Audio(makeBeepWav(freq, dur, vol))
    a.volume = 1
    a.play().catch(() => {})
  } catch {
    /* ignore */
  }
}

export function playCorrect(enabled = true) {
  if (enabled === false) return
  unlockAudio()
  playWav(523.25, 0.12, 0.3)
  setTimeout(() => playWav(659.25, 0.12, 0.3), 90)
  setTimeout(() => playWav(783.99, 0.18, 0.28), 180)
}

export function playWrong(enabled = true) {
  if (enabled === false) return
  unlockAudio()
  playWav(200, 0.18, 0.28)
  setTimeout(() => playWav(150, 0.22, 0.25), 120)
}

export function playClick(enabled = true) {
  if (enabled === false) return
  unlockAudio()
  playWav(700, 0.05, 0.15)
}

export function playWin(enabled = true) {
  if (enabled === false) return
  unlockAudio()
  ;[523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playWav(f, 0.14, 0.28), i * 90)
  })
}
