const KEY = 'lumea-steagurilor-v1'

const defaultState = () => ({
  starsTotal: 0,
  modeStars: {
    flag: 0,
    capital: 0,
    pairs: 0,
    puzzle: 0,
    journey: 0,
  },
  collectedFlags: [],
  achievements: [],
  continentStars: {},
  difficulty: 'easy',
  voiceEnabled: true,
  soundEnabled: true,
  perfectLevels: 0,
})

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    // Vocea și sunetul pornite implicit (dacă lipsesc din salvare)
    return {
      ...defaultState(),
      ...parsed,
      voiceEnabled: parsed.voiceEnabled !== false,
      soundEnabled: parsed.soundEnabled !== false,
    }
  } catch {
    return defaultState()
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}

export function resetProgress() {
  const fresh = defaultState()
  saveProgress(fresh)
  return fresh
}

export function addStars(state, mode, stars) {
  const next = {
    ...state,
    starsTotal: state.starsTotal + stars,
    modeStars: {
      ...state.modeStars,
      [mode]: (state.modeStars[mode] || 0) + stars,
    },
  }
  if (stars >= 3) next.perfectLevels = (state.perfectLevels || 0) + 1
  return next
}

export function collectFlags(state, countryIds) {
  const set = new Set(state.collectedFlags)
  countryIds.forEach((id) => set.add(id))
  return { ...state, collectedFlags: [...set] }
}

export function unlockAchievement(state, id) {
  if (state.achievements.includes(id)) return state
  return { ...state, achievements: [...state.achievements, id] }
}

export function setContinentStars(state, continentId, stars) {
  const prev = state.continentStars[continentId] || 0
  return {
    ...state,
    continentStars: {
      ...state.continentStars,
      [continentId]: Math.max(prev, stars),
    },
  }
}
