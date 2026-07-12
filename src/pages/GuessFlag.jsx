import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import { codeToFlag, getCountriesForDifficulty } from '../data/countries'
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
  speakUiLater,
  unlockAudio,
} from '../lib/audio'
import SunburstBg from '../components/SunburstBg'
import LevelResult from '../components/LevelResult'

const LETTER_COLORS = ['#39e75f', '#ff8c00', '#ff2d95', '#3dbbff', '#ffe600', '#b44dff']

function timerForDifficulty(diff) {
  if (diff === 'hard') return 4
  if (diff === 'medium') return 5
  return 7
}

function diffLabel(diff) {
  if (diff === 'hard') return t('hard')
  if (diff === 'medium') return t('medium')
  return t('easy')
}

export default function GuessFlag() {
  const { progress, recordLevel } = useProgressContext()
  const voiceOn = progress.voiceEnabled !== false
  const soundOn = progress.soundEnabled !== false
  const diff = progress.difficulty || 'easy'

  const pool = useMemo(() => getCountriesForDifficulty(diff), [diff])
  const totalQ = questionsForDifficulty(diff)
  const optN = Math.min(3, optionsCount(diff)) // ca în video: A B C
  const roundTime = timerForDifficulty(diff)

  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const [session, setSession] = useState([])
  const [seed, setSeed] = useState(0)
  const [timeLeft, setTimeLeft] = useState(roundTime)
  const [feedback, setFeedback] = useState(null)
  const lockedRef = useRef(false)
  const tickRef = useRef(null)

  const questions = useMemo(() => {
    void seed
    return pickRandom(pool, totalQ)
  }, [pool, totalQ, seed])

  const current = questions[index]
  const options = useMemo(() => {
    if (!current) return []
    return buildOptions(current, pool, 'name', optN)
  }, [current, pool, optN])

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }

  const goNext = useCallback(
    (finalCorrect, ids) => {
      if (index + 1 >= totalQ) {
        recordLevel('flag', starsFromScore(finalCorrect, totalQ), ids)
        playWin(soundOn)
        if (voiceOn) setTimeout(() => speakUi('levelComplete', true), 400)
        setDone(true)
      } else {
        setIndex((i) => i + 1)
        setPicked(null)
        setFeedback(null)
        lockedRef.current = false
        setTimeLeft(roundTime)
      }
    },
    [index, totalQ, recordLevel, soundOn, voiceOn, roundTime],
  )

  const resolveAnswer = useCallback(
    (optId, reason) => {
      if (lockedRef.current || !current) return
      lockedRef.current = true
      clearTick()
      unlockAudio()

      const ok = optId != null && optId === current.id
      setPicked(optId ?? current.id)

      if (ok) {
        setCorrectCount((c) => c + 1)
        setFeedback('ok')
        playCorrect(soundOn)
        if (voiceOn) speakName(current.id, 'ok', true)
      } else {
        setFeedback(reason === 'timeout' ? 'timeout' : 'bad')
        playWrong(soundOn)
        if (voiceOn) speakName(current.id, 'wrong', true)
      }

      const nextSession = [...session, current.id]
      setSession(nextSession)
      const nextCorrect = ok ? correctCount + 1 : correctCount

      setTimeout(() => goNext(nextCorrect, nextSession), 2000)
    },
    [current, session, correctCount, soundOn, voiceOn, goNext],
  )

  useEffect(() => {
    if (!current || done || picked != null) return
    lockedRef.current = false
    setTimeLeft(roundTime)
    clearTick()
    const started = Date.now()
    tickRef.current = setInterval(() => {
      const left = Math.max(0, roundTime - (Date.now() - started) / 1000)
      setTimeLeft(left)
      if (left <= 0) {
        clearTick()
        resolveAnswer(null, 'timeout')
      }
    }, 40)
    return clearTick
  }, [index, seed, current, done, roundTime]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!current || done || !voiceOn) return
    speakUiLater('whichCountry', true, 250)
  }, [index, seed, current, done, voiceOn])

  useEffect(() => {
    unlockAudio()
  }, [])

  const restart = () => {
    unlockAudio()
    setIndex(0)
    setCorrectCount(0)
    setPicked(null)
    setFeedback(null)
    setDone(false)
    setSession([])
    setSeed((s) => s + 1)
    setTimeLeft(roundTime)
    lockedRef.current = false
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

  const timerPct = (timeLeft / roundTime) * 100
  const timerUrgent = timeLeft <= 2 && !picked
  const flagSrc = `https://flagcdn.com/w640/${current.code}.png`
  const emoji = codeToFlag(current.code)

  return (
    <div
      className="yt-quiz"
      onPointerDown={() => unlockAudio()}
    >
      <SunburstBg />

      <div className="yt-quiz-inner">
        {/* Top: round + difficulty + back */}
        <div className="yt-top">
          <div className="yt-top-left">
            <Link to="/play" className="yt-back" aria-label={t('back')}>
              ←
            </Link>
            <div className="yt-round-block">
              <div className="yt-round-circle">{index + 1}</div>
              <div className={`yt-diff yt-diff--${diff}`}>{diffLabel(diff).toUpperCase()}</div>
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

        <h1 className="yt-title">GHICEȘTE STEAGUL</h1>

        {/* Flag + options layout */}
        <div className="yt-main">
          <div className={`yt-flag-wrap ${feedback === 'ok' ? 'yt-flag-wrap--ok' : ''} ${feedback === 'bad' || feedback === 'timeout' ? 'yt-flag-wrap--bad' : ''}`}>
            <img
              className="yt-flag-img"
              src={flagSrc}
              alt=""
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const el = e.currentTarget.parentElement?.querySelector('.yt-flag-emoji')
                if (el) el.style.display = 'flex'
              }}
            />
            <span className="yt-flag-emoji" style={{ display: 'none' }}>
              {emoji}
            </span>
          </div>

          {/* After answer: show only correct like in video */}
          {picked && (
            <div className="yt-answer-reveal">
              <span
                className="yt-letter"
                style={{
                  background:
                    LETTER_COLORS[
                      Math.max(
                        0,
                        options.findIndex((o) => o.id === current.id),
                      )
                    ] || LETTER_COLORS[2],
                }}
              >
                {String.fromCharCode(
                  65 + Math.max(0, options.findIndex((o) => o.id === current.id)),
                )}
              </span>
              <span className="yt-answer-text">{current.name.toUpperCase()}</span>
            </div>
          )}

          {!picked && (
            <div className="yt-options">
              {options.map((opt, i) => (
                <button
                  key={opt.id}
                  type="button"
                  className="yt-opt"
                  onClick={() => resolveAnswer(opt.id, 'pick')}
                >
                  <span
                    className="yt-letter"
                    style={{ background: LETTER_COLORS[i % LETTER_COLORS.length] }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="yt-opt-text">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal timer bar — ca în video */}
        {!picked && (
          <div className="yt-timer-track">
            <div
              className={`yt-timer-fill ${timerUrgent ? 'yt-timer-fill--urgent' : ''}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
        )}

        {feedback === 'ok' && <p className="yt-feedback yt-feedback--ok">🎉 {t('correct')}</p>}
        {feedback === 'bad' && <p className="yt-feedback yt-feedback--bad">😅 {t('wrong')}</p>}
        {feedback === 'timeout' && (
          <p className="yt-feedback yt-feedback--bad">⏰ Timpul a expirat!</p>
        )}

        <p className="yt-score">⭐ {correctCount} / {totalQ}</p>
      </div>
    </div>
  )
}
