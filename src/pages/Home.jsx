import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import { useProgressContext } from '../context/ProgressContext'
import { speakUi, unlockAudio } from '../lib/audio'
import Shell from '../components/Shell'

const MENU = [
  {
    path: '/play',
    emoji: '🎮',
    titleKey: 'play',
    descKey: 'modes',
    color: '#39e75f',
    big: true,
    voice: 'play',
  },
  {
    path: '/play/flag',
    emoji: '🏳️',
    titleKey: 'modeGuessFlag',
    descKey: 'modeGuessFlagDesc',
    color: '#3dbbff',
    voice: 'modeGuessFlag',
  },
  {
    path: '/play/capital',
    emoji: '🏛️',
    titleKey: 'modeGuessCapital',
    descKey: 'modeGuessCapitalDesc',
    color: '#ff8c00',
    voice: 'modeGuessCapital',
  },
  {
    path: '/play/pairs',
    emoji: '🧩',
    titleKey: 'modePairs',
    descKey: 'modePairsDesc',
    color: '#ff2d95',
    voice: 'modePairs',
  },
  {
    path: '/play/puzzle',
    emoji: '✂️',
    titleKey: 'modePuzzle',
    descKey: 'modePuzzleDesc',
    color: '#b44dff',
    voice: 'modePuzzle',
  },
  {
    path: '/play/journey',
    emoji: '✈️',
    titleKey: 'modeJourney',
    descKey: 'modeJourneyDesc',
    color: '#ffe600',
    voice: 'modeJourney',
  },
  {
    path: '/collection',
    emoji: '🗂️',
    titleKey: 'collection',
    descKey: 'flags',
    color: '#14b8a6',
  },
  {
    path: '/achievements',
    emoji: '🏅',
    titleKey: 'achievements',
    descKey: 'stars',
    color: '#f59e0b',
  },
  {
    path: '/settings',
    emoji: '⚙️',
    titleKey: 'settings',
    descKey: 'difficulty',
    color: '#94a3b8',
  },
]

export default function Home() {
  const { progress } = useProgressContext()
  const voiceOn = progress.voiceEnabled !== false

  const diffLabel =
    progress.difficulty === 'hard'
      ? t('hard')
      : progress.difficulty === 'medium'
        ? t('medium')
        : t('easy')

  return (
    <Shell className="home-shell">
      <div className="home-hero-yt">
        <div className="home-flags-bounce" aria-hidden>
          <span>🇷🇴</span>
          <span>🌍</span>
          <span>🇫🇷</span>
          <span>🇯🇵</span>
        </div>
        <h1 className="yt-title home-main-title">{t('appName').toUpperCase()}</h1>
        <p className="home-sub-yt">{t('appSubtitle')}</p>
        <div className="home-stats-yt">
          <span className="yt-stat-pill">⭐ {progress.starsTotal}</span>
          <span className="yt-stat-pill">🏳️ {progress.collectedFlags.length}</span>
          <span className={`yt-stat-pill yt-stat-pill--diff yt-diff--${progress.difficulty || 'easy'}`}>
            {diffLabel.toUpperCase()}
          </span>
        </div>
      </div>

      <nav className="yt-menu">
        {MENU.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`yt-menu-item ${item.big ? 'yt-menu-item--big' : ''}`}
            onClick={() => {
              unlockAudio()
              if (voiceOn && item.voice) speakUi(item.voice, true)
            }}
          >
            <span className="yt-menu-letter" style={{ background: item.color }}>
              {item.emoji}
            </span>
            <span className="yt-menu-body">
              <strong>{t(item.titleKey)}</strong>
              <span>{t(item.descKey)}</span>
            </span>
            <span className="yt-menu-chevron">›</span>
          </Link>
        ))}
      </nav>
    </Shell>
  )
}
