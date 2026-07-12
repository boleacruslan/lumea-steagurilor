import { useEffect, useMemo, useState } from 'react'
import { t } from '../data/i18n'
import { CONTINENTS, getCountriesByContinent } from '../data/countries'
import { useProgressContext } from '../context/ProgressContext'
import {
  buildOptions,
  optionsCount,
  pickRandom,
  starsFromScore,
} from '../lib/gameUtils'
import {
  playCorrect,
  playWrong,
  playWin,
  speakName,
  speakUi,
  speakUiLater,
  unlockAudio,
} from '../lib/audio'
import Shell from '../components/Shell'
import SunburstBg from '../components/SunburstBg'
import Flag from '../components/Flag'
import LevelResult from '../components/LevelResult'

const LETTER_COLORS = ['#39e75f', '#ff8c00', '#ff2d95', '#3dbbff']
const CONT_COLORS = ['#39e75f', '#ff8c00', '#ff2d95', '#3dbbff', '#b44dff']

export default function Journey() {
  const { progress, recordContinent } = useProgressContext()
  const voiceOn = progress.voiceEnabled !== false
  const soundOn = progress.soundEnabled !== false

  const [continentId, setContinentId] = useState(null)
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [flagState, setFlagState] = useState('idle')
  const [done, setDone] = useState(false)
  const [session, setSession] = useState([])
  const [seed, setSeed] = useState(0)

  const pool = useMemo(() => {
    if (!continentId) return []
    return getCountriesByContinent(continentId, progress.difficulty)
  }, [continentId, progress.difficulty])

  const totalQ = Math.min(6, Math.max(3, pool.length))
  const optN = Math.min(3, optionsCount(progress.difficulty))

  const questions = useMemo(() => {
    if (!pool.length) return []
    void seed
    return pickRandom(pool, totalQ)
  }, [pool, totalQ, seed])

  const current = questions[index]
  const options = useMemo(() => {
    if (!current) return []
    return buildOptions(current, pool, 'name', Math.min(optN, pool.length))
  }, [current, pool, optN])

  useEffect(() => {
    if (!continentId || !current || done || !voiceOn) return
    speakUiLater('whichCountry', true, 350)
  }, [index, seed, continentId, current, done, voiceOn])

  const startContinent = (id) => {
    unlockAudio()
    setContinentId(id)
    setIndex(0)
    setCorrectCount(0)
    setPicked(null)
    setFlagState('idle')
    setDone(false)
    setSession([])
    setSeed((s) => s + 1)
  }

  const onPick = (optId) => {
    if (picked || !current) return
    unlockAudio()
    setPicked(optId)
    const ok = optId === current.id
    if (ok) {
      setCorrectCount((c) => c + 1)
      setFlagState('correct')
      playCorrect(soundOn)
      if (voiceOn) speakName(current.id, 'ok', true)
    } else {
      setFlagState('wrong')
      playWrong(soundOn)
      if (voiceOn) speakName(current.id, 'wrong', true)
    }
    const nextSession = [...session, current.id]
    setSession(nextSession)
    setTimeout(() => {
      if (index + 1 >= totalQ) {
        const finalCorrect = ok ? correctCount + 1 : correctCount
        recordContinent(continentId, starsFromScore(finalCorrect, totalQ), nextSession)
        playWin(soundOn)
        if (voiceOn) setTimeout(() => speakUi('levelComplete', true), 300)
        setDone(true)
      } else {
        setIndex((i) => i + 1)
        setPicked(null)
        setFlagState('idle')
      }
    }, 1800)
  }

  if (!continentId) {
    return (
      <Shell title={t('journeyTitle').toUpperCase()} backTo="/play">
        <p className="shell-lead">{t('modeJourneyDesc')}</p>
        <nav className="yt-menu">
          {Object.values(CONTINENTS).map((c, i) => {
            const count = getCountriesByContinent(c.id, progress.difficulty).length
            const stars = progress.continentStars[c.id] || 0
            return (
              <button
                key={c.id}
                type="button"
                className="yt-menu-item"
                disabled={count === 0}
                onClick={() => startContinent(c.id)}
              >
                <span className="yt-menu-letter" style={{ background: CONT_COLORS[i % 5] }}>
                  {c.emoji}
                </span>
                <span className="yt-menu-body">
                  <strong>{c.name.toUpperCase()}</strong>
                  <span>
                    {count} {t('flags')} · ⭐ {stars}
                  </span>
                </span>
                <span className="yt-menu-chevron">›</span>
              </button>
            )
          })}
        </nav>
      </Shell>
    )
  }

  if (done) {
    return (
      <div className="yt-quiz">
        <SunburstBg />
        <div className="yt-quiz-inner">
          <LevelResult
            stars={starsFromScore(correctCount, totalQ)}
            correct={correctCount}
            total={totalQ}
            sampleCode={questions[0]?.code}
            onAgain={() => startContinent(continentId)}
            homeTo="/play/journey"
          />
          <button type="button" className="yt-btn" style={{ marginTop: 12 }} onClick={() => setContinentId(null)}>
            {t('journeyTitle')}
          </button>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <Shell backTo="/play">
        <p className="shell-lead">{t('locked')}</p>
        <button type="button" className="yt-btn" onClick={() => setContinentId(null)}>
          {t('back')}
        </button>
      </Shell>
    )
  }

  const cont = CONTINENTS[continentId]

  return (
    <div className="yt-quiz" onPointerDown={() => unlockAudio()}>
      <SunburstBg />
      <div className="yt-quiz-inner">
        <div className="yt-top">
          <div className="yt-top-left">
            <button type="button" className="yt-back" onClick={() => setContinentId(null)}>
              ←
            </button>
            <div className="yt-round-block">
              <div className="yt-round-circle">{index + 1}</div>
            </div>
          </div>
          <button
            type="button"
            className="yt-speak"
            onClick={() => {
              unlockAudio()
              speakUi('whichCountry', true)
            }}
          >
            🔊
          </button>
        </div>

        <h1 className="yt-title">
          {cont.emoji} {cont.name.toUpperCase()}
        </h1>
        <p className="shell-lead">{t('whichCountry')}</p>

        <div className="yt-flag-wrap" style={{ marginBottom: 16 }}>
          <img
            className="yt-flag-img"
            src={`https://flagcdn.com/w640/${current.code}.png`}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div className="yt-options">
          {options.map((opt, i) => {
            let extra = ''
            if (picked) {
              if (opt.id === current.id) extra = ' yt-opt--ok'
              else if (opt.id === picked) extra = ' yt-opt--bad'
              else extra = ' yt-opt--dim'
            }
            return (
              <button
                key={opt.id}
                type="button"
                className={`yt-opt${extra}`}
                disabled={!!picked}
                onClick={() => onPick(opt.id)}
              >
                <span className="yt-letter" style={{ background: LETTER_COLORS[i % 4] }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="yt-opt-text">{opt.label.toUpperCase()}</span>
              </button>
            )
          })}
        </div>
        <p className="yt-score">
          ⭐ {correctCount} / {totalQ}
        </p>
      </div>
    </div>
  )
}
