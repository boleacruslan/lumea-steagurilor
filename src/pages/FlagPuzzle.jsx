import { useEffect, useMemo, useState } from 'react'
import { t } from '../data/i18n'
import { codeToFlag, getCountriesForDifficulty } from '../data/countries'
import { useProgressContext } from '../context/ProgressContext'
import { pickRandom, shuffle } from '../lib/gameUtils'
import { playCorrect, playWin, speakName, unlockAudio } from '../lib/audio'
import { Link } from 'react-router-dom'
import SunburstBg from '../components/SunburstBg'
import Flag from '../components/Flag'
import LevelResult from '../components/LevelResult'

function gridSize(difficulty) {
  if (difficulty === 'hard') return 3
  return 2
}

export default function FlagPuzzle() {
  const { progress, recordLevel } = useProgressContext()
  const pool = useMemo(
    () => getCountriesForDifficulty(progress.difficulty),
    [progress.difficulty],
  )
  const size = gridSize(progress.difficulty)
  const cells = size * size

  const [seed, setSeed] = useState(0)
  const [board, setBoard] = useState([])
  const [slots, setSlots] = useState([])
  const [dragPiece, setDragPiece] = useState(null)
  const [done, setDone] = useState(false)
  const [moves, setMoves] = useState(0)
  const [wrongFlash, setWrongFlash] = useState(null)

  const country = useMemo(() => {
    void seed
    return pickRandom(pool, 1)[0]
  }, [pool, seed])

  const pieces = useMemo(() => {
    if (!country) return []
    const base = Array.from({ length: cells }, (_, i) => ({
      id: i,
      order: i,
    }))
    return shuffle(base)
  }, [country, cells, seed]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setBoard(pieces)
    setSlots(Array(cells).fill(null))
    setDone(false)
    setMoves(0)
    setWrongFlash(null)
  }, [pieces, cells])

  const place = (slotIndex, piece) => {
    if (slots[slotIndex] != null) return
    unlockAudio()
    setMoves((m) => m + 1)

    if (piece.order === slotIndex) {
      const nextSlots = [...slots]
      nextSlots[slotIndex] = piece
      setSlots(nextSlots)
      setBoard((b) => b.filter((p) => p.id !== piece.id))
      playCorrect(progress.soundEnabled)

      if (nextSlots.every((s) => s != null)) {
        recordLevel('puzzle', 3, [country.id])
        if (progress.voiceEnabled !== false) speakName(country.id, 'ok', true)
        playWin(progress.soundEnabled)
        setTimeout(() => setDone(true), 500)
      }
    } else {
      setWrongFlash(slotIndex)
      setTimeout(() => setWrongFlash(null), 400)
    }
    setDragPiece(null)
  }

  const onPieceClick = (piece) => {
    // auto-place to correct empty slot for kids (tap mode)
    const correctEmpty = piece.order
    if (slots[correctEmpty] == null) {
      place(correctEmpty, piece)
    }
  }

  const restart = () => {
    setSeed((s) => s + 1)
  }

  if (!country) return null

  if (done) {
    return (
      <div className="yt-quiz">
        <SunburstBg />
        <div className="yt-quiz-inner">
          <LevelResult
            stars={moves <= cells + 2 ? 3 : moves <= cells * 2 ? 2 : 1}
            correct={cells}
            total={cells}
            sampleCode={country.code}
            onAgain={restart}
            homeTo="/play"
          />
        </div>
      </div>
    )
  }

  const emoji = codeToFlag(country.code)

  return (
    <div className="yt-quiz" onPointerDown={() => unlockAudio()}>
      <SunburstBg />
      <div className="yt-quiz-inner">
        <div className="yt-top">
          <div className="yt-top-left">
            <Link to="/play" className="yt-back">
              ←
            </Link>
          </div>
          <button
            type="button"
            className="yt-speak"
            onClick={() => {
              unlockAudio()
              speakName(country.id, '', true)
            }}
          >
            🔊
          </button>
        </div>
        <h1 className="yt-title">{t('modePuzzle').toUpperCase()}</h1>
        <p className="shell-lead">{t('puzzleHint')}</p>

      <div className="puzzle-layout yt-puzzle">
        <div
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {slots.map((slot, i) => {
            const row = Math.floor(i / size)
            const col = i % size
            return (
              <div
                key={i}
                className={`puzzle-slot ${wrongFlash === i ? 'puzzle-slot--wrong' : ''} ${slot ? 'puzzle-slot--filled' : ''}`}
                onClick={() => dragPiece && place(i, dragPiece)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragPiece) place(i, dragPiece)
                }}
              >
                {slot && (
                  <div
                    className="puzzle-piece puzzle-piece--placed"
                    style={{
                      backgroundPosition: `${(col / (size - 1 || 1)) * 100}% ${(row / (size - 1 || 1)) * 100}%`,
                    }}
                  >
                    <span
                      className="puzzle-emoji-slice"
                      style={{
                        width: `${size * 100}%`,
                        height: `${size * 100}%`,
                        transform: `translate(-${col * (100 / size)}%, -${row * (100 / size)}%)`,
                        fontSize: `${size * 2.2}rem`,
                      }}
                    >
                      {emoji}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="puzzle-tray">
          {board.map((piece) => {
            const row = Math.floor(piece.order / size)
            const col = piece.order % size
            return (
              <button
                key={piece.id}
                type="button"
                className="puzzle-piece"
                draggable
                onDragStart={() => setDragPiece(piece)}
                onDragEnd={() => setDragPiece(null)}
                onClick={() => onPieceClick(piece)}
              >
                <span
                  className="puzzle-emoji-slice"
                  style={{
                    width: `${size * 100}%`,
                    height: `${size * 100}%`,
                    transform: `translate(-${col * (100 / size)}%, -${row * (100 / size)}%)`,
                    fontSize: `${size * 1.6}rem`,
                  }}
                >
                  {emoji}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {board.length === 0 && !done && (
        <div className="puzzle-preview">
          <Flag code={country.code} state="correct" size="lg" />
          <p className="yt-score">{t('puzzleDone')}</p>
        </div>
      )}
      </div>
    </div>
  )
}
