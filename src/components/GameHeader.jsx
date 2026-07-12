import { Link } from 'react-router-dom'
import { t } from '../data/i18n'

export default function GameHeader({ title, progressLabel, onSpeak }) {
  return (
    <header className="game-header">
      <Link to="/play" className="back-link" aria-label={t('back')}>
        ← {t('back')}
      </Link>
      <div className="game-header-center">
        <h1 className="game-title">{title}</h1>
        {progressLabel && <p className="game-progress">{progressLabel}</p>}
      </div>
      {onSpeak ? (
        <button type="button" className="icon-btn" onClick={onSpeak} aria-label={t('listen')}>
          🔊
        </button>
      ) : (
        <span className="icon-btn icon-btn--ghost" />
      )}
    </header>
  )
}
