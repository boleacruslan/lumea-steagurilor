import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import { useProgressContext } from '../context/ProgressContext'
import { speakUi, unlockAudio } from '../lib/audio'
import Shell from '../components/Shell'

const MODES = [
  {
    path: '/play/flag',
    key: 'flag',
    title: 'modeGuessFlag',
    desc: 'modeGuessFlagDesc',
    emoji: '🏳️',
    color: '#39e75f',
    voice: 'modeGuessFlag',
  },
  {
    path: '/play/capital',
    key: 'capital',
    title: 'modeGuessCapital',
    desc: 'modeGuessCapitalDesc',
    emoji: '🏛️',
    color: '#ff8c00',
    voice: 'modeGuessCapital',
  },
  {
    path: '/play/pairs',
    key: 'pairs',
    title: 'modePairs',
    desc: 'modePairsDesc',
    emoji: '🧩',
    color: '#ff2d95',
    voice: 'modePairs',
  },
  {
    path: '/play/puzzle',
    key: 'puzzle',
    title: 'modePuzzle',
    desc: 'modePuzzleDesc',
    emoji: '✂️',
    color: '#3dbbff',
    voice: 'modePuzzle',
  },
  {
    path: '/play/journey',
    key: 'journey',
    title: 'modeJourney',
    desc: 'modeJourneyDesc',
    emoji: '✈️',
    color: '#b44dff',
    voice: 'modeJourney',
  },
]

export default function Play() {
  const { progress } = useProgressContext()

  useEffect(() => {
    unlockAudio()
  }, [])

  return (
    <Shell title={t('modes').toUpperCase()} backTo="/">
      <p className="shell-lead">{t('appSubtitle')}</p>
      <nav className="yt-menu">
        {MODES.map((m, i) => (
          <Link
            key={m.path}
            to={m.path}
            className="yt-menu-item"
            onClick={() => {
              unlockAudio()
              if (progress.voiceEnabled !== false) speakUi(m.voice, true)
            }}
          >
            <span className="yt-menu-letter" style={{ background: m.color }}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className="yt-menu-emoji-inline" aria-hidden>
              {m.emoji}
            </span>
            <span className="yt-menu-body">
              <strong>{t(m.title)}</strong>
              <span>{t(m.desc)}</span>
            </span>
            <span className="yt-menu-meta">⭐ {progress.modeStars[m.key] || 0}</span>
          </Link>
        ))}
      </nav>
    </Shell>
  )
}
