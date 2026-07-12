export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n)
}

/** Opțiuni multiple: 1 corect + distractori */
export function buildOptions(correct, pool, field = 'name', count = 4) {
  const others = shuffle(pool.filter((c) => c.id !== correct.id)).slice(0, count - 1)
  return shuffle([correct, ...others]).map((c) => ({
    id: c.id,
    label: c[field],
  }))
}

/** Stele: 3 = 90%+, 2 = 70%+, 1 = 40%+, 0 = sub */
export function starsFromScore(correct, total) {
  if (total === 0) return 0
  const ratio = correct / total
  if (ratio >= 0.9) return 3
  if (ratio >= 0.7) return 2
  if (ratio >= 0.4) return 1
  return 0
}

export function questionsForDifficulty(difficulty) {
  if (difficulty === 'hard') return 10
  if (difficulty === 'medium') return 8
  return 6
}

export function optionsCount(difficulty) {
  if (difficulty === 'hard') return 6
  if (difficulty === 'medium') return 4
  return 3
}

export const ACHIEVEMENTS = [
  { id: 'first_star', titleKey: 'achFirstStar', descKey: 'achFirstStarDesc', emoji: '⭐' },
  { id: 'ten_stars', titleKey: 'achTenStars', descKey: 'achTenStarsDesc', emoji: '🌟' },
  { id: 'fifty_stars', titleKey: 'achFiftyStars', descKey: 'achFiftyStarsDesc', emoji: '💫' },
  { id: 'first_flag', titleKey: 'achFirstFlag', descKey: 'achFirstFlagDesc', emoji: '🧭' },
  { id: 'half_flags', titleKey: 'achHalfFlags', descKey: 'achHalfFlagsDesc', emoji: '🗺️' },
  { id: 'all_base', titleKey: 'achAllBase', descKey: 'achAllBaseDesc', emoji: '🏆' },
  { id: 'perfect', titleKey: 'achPerfectLevel', descKey: 'achPerfectLevelDesc', emoji: '🎯' },
  { id: 'journey', titleKey: 'achJourney', descKey: 'achJourneyDesc', emoji: '✈️' },
]

export function checkAchievements(state) {
  const unlocked = new Set(state.achievements)
  const add = []

  if (state.starsTotal >= 1 && !unlocked.has('first_star')) add.push('first_star')
  if (state.starsTotal >= 10 && !unlocked.has('ten_stars')) add.push('ten_stars')
  if (state.starsTotal >= 50 && !unlocked.has('fifty_stars')) add.push('fifty_stars')
  if (state.collectedFlags.length >= 1 && !unlocked.has('first_flag')) add.push('first_flag')
  if (state.collectedFlags.length >= 25 && !unlocked.has('half_flags')) add.push('half_flags')
  if (state.collectedFlags.length >= 50 && !unlocked.has('all_base')) add.push('all_base')
  if (state.perfectLevels >= 1 && !unlocked.has('perfect')) add.push('perfect')

  const continentsDone = Object.values(state.continentStars || {}).filter((s) => s >= 2).length
  if (continentsDone >= 1 && !unlocked.has('journey')) add.push('journey')

  return add
}
