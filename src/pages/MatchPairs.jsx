import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import { codeToFlag, getCountriesForDifficulty } from '../data/countries'
import { useProgressContext } from '../context/ProgressContext'
import { pickRandom, shuffle, starsFromScore } from '../lib/gameUtils'
import {
  playClick,
  playCorrect,
  playWrong,
  playWin,
  speakName,
  speakUi,
  speakUiLater,
  unlockAudio,
} from '../lib/audio'
import SunburstBg from '../components/SunburstBg'
import LevelResult from '../components/LevelResult'

function pairCount(difficulty) {
  if (difficulty === 'hard') return 8
  if (difficulty === 'medium') return 6
  return 4
}

function PairFlag({ code }) {
  const emoji = codeToFlag(code)
  const src = `https://flagcdn.com/w320/${code}.png`
  const src2x = `https://flagcdn.com/w640/${code}.png`
  return (
    <span className="pair-flag-big">
      <img
        src={src}
        srcSet={`${src} 1x, ${src2x} 2x`}
        alt=""
        draggable={false}
        className="pair-flag-img"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fb = e.currentTarget.nextElementSibling
          if (fb) fb.style.display = 'flex'
        }}
      />
      <span className="pair-flag-emoji-fallback" style={{ display: 'none' }}>
        {emoji}
      </span>
      <span className="pair-flag-shine" aria-hidden />
    </span>
  )
}

export default function MatchPairs() {
  const { progress, recordLevel } = useProgressContext()
  const voiceOn = progress.voiceEnabled !== false
  const soundOn = progress.soundEnabled !== false

  const pool = useMemo(
    () => getCountriesForDifficulty(progress.difficulty),
    [progress.difficulty],
  )
  const n = pairCount(progress.difficulty)

  const [seed, setSeed] = useState(0)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [lock, setLock] = useState(false)
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)
  const [justMatched, setJustMatched] = useState([])

  const countries = useMemo(() => {
    void seed
    return pickRandom(pool, n)
  }, [pool, n, seed])

  const cards = useMemo(() => {
    const flagCards = countries.map((c) => ({
      uid: `f-${c.id}`,
      pairId: c.id,
      type: 'flag',
      code: c.code,
      name: c.name,
      speak: c.name,
    }))
    const nameCards = countries.map((c) => ({
      uid: `n-${c.id}`,
      pairId: c.id,
      type: 'name',
      code: c.code,
      name: c.name,
      speak: c.name,
    }))
    return shuffle([...flagCards, ...nameCards])
  }, [countries])

  const found = matched.length / 2

  useEffect(() => {
    if (voiceOn && !done) speakUiLater('tapTwoCards', true, 350)
  }, [seed]) // eslint-disable-line react-hooks/exhaustive-deps

  const onCard = (card) => {
    if (lock || matched.includes(card.uid) || flipped.find((f) => f.uid === card.uid)) return
    unlockAudio()
    playClick(soundOn)

    const next = [...flipped, card]
    setFlipped(next)

    if (next.length < 2) return

    setLock(true)
    setMoves((m) => m + 1)
    const [a, b] = next
    const ok = a.pairId === b.pairId && a.type !== b.type

    if (ok) {
      playCorrect(soundOn)
      if (voiceOn) speakName(a.pairId, '', true)
      const newMatched = [...matched, a.uid, b.uid]
      setMatched(newMatched)
      setJustMatched([a.uid, b.uid])
      setTimeout(() => setJustMatched([]), 600)
      setFlipped([])
      setLock(false)
      if (newMatched.length === cards.length) {
        const perfectMoves = n
        const scoreLike = Math.max(0, n - Math.floor((moves + 1 - perfectMoves) / 2))
        const stars = starsFromScore(scoreLike, n)
        recordLevel(
          'pairs',
          stars,
          countries.map((c) => c.id),
        )
        playWin(soundOn)
        if (voiceOn) setTimeout(() => speakUi('levelComplete', true), 300)
        setTimeout(() => setDone(true), 500)
      }
    } else {
      playWrong(soundOn)
      setTimeout(() => {
        setFlipped([])
        setLock(false)
      }, 850)
    }
  }

  const restart = () => {
    setSeed((s) => s + 1)
    setFlipped([])
    setMatched([])
    setLock(false)
    setMoves(0)
    setDone(false)
    setJustMatched([])
  }

  if (done) {
    const perfectMoves = n
    const scoreLike = Math.max(0, n - Math.floor((moves - perfectMoves) / 2))
    return (
      <div className="yt-quiz">
        <SunburstBg />
        <div className="yt-quiz-inner">
          <LevelResult
            stars={starsFromScore(scoreLike, n)}
            correct={n}
            total={n}
            sampleCode={countries[0]?.code}
            onAgain={restart}
            homeTo="/play"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="yt-quiz" onPointerDown={() => unlockAudio()}>
      <SunburstBg />
      <div className="yt-quiz-inner yt-quiz-inner--wide">
        <div className="yt-top">
          <div className="yt-top-left">
            <Link to="/play" className="yt-back">
              ←
            </Link>
          </div>
          <span className="yt-score" style={{ margin: 0, padding: 0 }}>
            {found} / {n}
          </span>
        </div>
        <h1 className="yt-title">{t('modePairs').toUpperCase()}</h1>
        <p className="shell-lead">{t('tapTwoCards')}</p>

        <div className={`pairs-board pairs-board--${n}`}>
          {cards.map((card, i) => {
            const isUp = flipped.some((f) => f.uid === card.uid) || matched.includes(card.uid)
            const isMatch = matched.includes(card.uid)
            const isPop = justMatched.includes(card.uid)
            return (
              <button
                key={card.uid}
                type="button"
                className={[
                  'pair-tile',
                  isUp ? 'pair-tile--up' : '',
                  isMatch ? 'pair-tile--match' : '',
                  isPop ? 'pair-tile--pop' : '',
                  card.type === 'flag' ? 'pair-tile--flag' : 'pair-tile--name',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => onCard(card)}
                disabled={isMatch}
              >
                <span className="pair-tile-inner">
                  <span className="pair-tile-face pair-tile-face--back">
                    <span className="pair-tile-q">?</span>
                    <span className="pair-tile-back-shine" aria-hidden />
                  </span>
                  <span className="pair-tile-face pair-tile-face--front">
                    {card.type === 'flag' ? (
                      <PairFlag code={card.code} />
                    ) : (
                      <span className="pair-name-big">
                        <span className="pair-name-mini-flag" aria-hidden>
                          {codeToFlag(card.code)}
                        </span>
                        {card.name}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
