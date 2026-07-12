import { useCallback, useEffect, useState } from 'react'
import {
  addStars,
  collectFlags,
  loadProgress,
  resetProgress as reset,
  saveProgress,
  setContinentStars,
  unlockAchievement,
} from '../lib/storage'
import { checkAchievements } from '../lib/gameUtils'

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const update = useCallback((fn) => {
    setProgress((prev) => {
      let next = typeof fn === 'function' ? fn(prev) : { ...prev, ...fn }
      const newly = checkAchievements(next)
      newly.forEach((id) => {
        next = unlockAchievement(next, id)
      })
      return next
    })
  }, [])

  const recordLevel = useCallback(
    (mode, stars, countryIds = []) => {
      update((prev) => {
        let next = addStars(prev, mode, stars)
        next = collectFlags(next, countryIds)
        return next
      })
    },
    [update],
  )

  const recordContinent = useCallback(
    (continentId, stars, countryIds = []) => {
      update((prev) => {
        let next = addStars(prev, 'journey', stars)
        next = setContinentStars(next, continentId, stars)
        next = collectFlags(next, countryIds)
        return next
      })
    },
    [update],
  )

  const setDifficulty = useCallback(
    (difficulty) => update({ difficulty }),
    [update],
  )

  const setVoice = useCallback(
    (voiceEnabled) => update({ voiceEnabled }),
    [update],
  )

  const setSound = useCallback(
    (soundEnabled) => update({ soundEnabled }),
    [update],
  )

  const resetAll = useCallback(() => {
    const fresh = reset()
    setProgress(fresh)
  }, [])

  return {
    progress,
    recordLevel,
    recordContinent,
    setDifficulty,
    setVoice,
    setSound,
    resetAll,
  }
}
