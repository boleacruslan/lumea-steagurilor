import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import { getCountriesForDifficulty } from '../data/countries'
import { useProgressContext } from '../context/ProgressContext'
import {
  buildOptions,
  optionsCount,
  pickRandom,
  questionsForDifficulty,
  starsFromScore,
} from '../lib/gameUtils'
import {
  playCorrect,
  playWrong,
  playWin,
  speakName,
  speakUi,
  speakWhichCapital,
  unlockAudio,
} from '../lib/audio'
import SunburstBg from '../components/SunburstBg'
import Flag from '../components/Flag'
import LevelResult from '../components/LevelResult'

const LETTER_COLORS = ['#39e75f', '#ff8c00', '#ff2d95', '#3dbbff']

export default function GuessCapital() {
  const { progress, recordLevel } = useProgressContext()
  const voiceOn = progress.voiceEnabled !== false
  const soundOn = progress.soundEnabled !== false
  const pool = useMemo(
    () => getCountriesForDifficulty(progress.difficulty),
    [progress.difficulty],
  )
  const totalQ = questionsForDifficulty(progress.difficulty)
  const optN = Math.min(3, optionsCount(progress.difficulty))

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [flagState, setFlagState] = useState('idle')
  const [done, setDone] = useState(false)
  const [session, setSession] = useState([])
  const [seed, setSeed] = useState(0)

  const questions = useMemo(() => {
    void seed
    return pickRandom(pool, totalQ)
  }, [pool, totalQ, seed])

  const current = questions[index]
  const options = useMemo(() => {
    if (!current) return []
    return buildOptions(current, pool, 'name', optN)
  }, [current, pool, optN])

  useEffect(() => {
    unlockAudio()
  }, [])

  useEffect(() => {
    if (!current || done || !voiceOn) return
    const tmr = setTimeout(() => speakWhichCapital(current.id, true), 300)
    return () => clearTimeout(tmr)
  }, [index, seed, current, done, voiceOn])

  const finish = useCallback(
    (finalCorrect, ids) => {
      recordLevel('capital', starsFromScore(finalCorrect, totalQ), ids)
      playWin(soundOn)
      if (voiceOn) setTimeout(() => speakUi('levelComplete', true), 400)
      setDone(true)
    },
    [recordLevel, totalQ, soundOn, voiceOn],
  )

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
      if (index + 1 >= totalQ) finish(ok ? correctCount + 1 : correctCount, nextSession)
      else {
        setIndex((i) => i + 1)
        setPicked(null)
        setFlagState('idle')
      }
    }, 1800)
  }

  const restart = () => {
    unlockAudio()
    setIndex(0)
    setCorrectCount(0)
    setPicked(null)
    setFlagState('idle')
    setDone(false)
    setSession([])
    setSeed((s) => s + 1)
    if (voiceOn) speakUi('again', true)
  }

  if (!current && !done) return null

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
      <div className="yt-quiz-inner">
        <div className="yt-top">
          <div className="yt-top-left">
            <Link to="/play" className="yt-back">
              ←
            </Link>
            <div className="yt-round-block">
              <div className="yt-round-circle">{index + 1}</div>
            </div>
          </div>
          <button
            type="button"
            className="yt-speak"
            onClick={() => {
              unlockAudio()
              speakWhichCapital(current.id, true)
            }}
          >
            🔊
          </button>
        </div>

        <h1 className="yt-title">A CĂREI ȚĂRI?</h1>
        <p className="shell-lead" style={{ marginTop: -8 }}>
          {t('whichCapital')}
        </p>

        <div className="yt-capital-hero">
          <span className="yt-capital-icon">🏛️</span>
          <strong>{current.capital}</strong>
        </div>

        {picked && <Flag code={current.code} state={flagState} size="lg" />}

        <div className="yt-options" style={{ marginTop: 16 }}>
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
