import { Link } from 'react-router-dom'
import { t } from '../data/i18n'
import Flag from './Flag'
import Stars from './Stars'

export default function LevelResult({
  stars,
  correct,
  total,
  sampleCode,
  onAgain,
  homeTo = '/',
}) {
  return (
    <div className="yt-card result-card card-pop" style={{ marginTop: 24, textAlign: 'center' }}>
      <h2 className="yt-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>
        {t('levelComplete').toUpperCase()}
      </h2>
      <p className="yt-card-text">
        {t('score')}: {correct} {t('of')} {total}
      </p>
      <Stars count={stars} size="lg" />
      <p className="yt-card-text" style={{ fontWeight: 800, color: '#0f172a' }}>
        {t('youEarned')} {stars} {t('stars').toLowerCase()}!
      </p>
      {sampleCode && (
        <div className="result-flag">
          <Flag code={sampleCode} state="raise" size="xl" />
          <p className="yt-card-text">{t('raiseFlag')}</p>
        </div>
      )}
      <div className="yt-btn-row" style={{ marginTop: 12 }}>
        <button type="button" className="yt-btn yt-btn--primary" onClick={onAgain}>
          {t('again')}
        </button>
        <Link to={homeTo} className="yt-btn">
          {t('menu')}
        </Link>
      </div>
    </div>
  )
}
