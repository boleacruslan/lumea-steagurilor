import { codeToFlag } from '../data/countries'

/**
 * Steag mare pe scenă (stil quiz video):
 * imagine flagcdn + fallback emoji
 */
export default function FlagStage({ code, state = 'idle' }) {
  const emoji = codeToFlag(code)
  const src = `https://flagcdn.com/w320/${code.toLowerCase()}.png`
  const src2x = `https://flagcdn.com/w640/${code.toLowerCase()}.png`

  return (
    <div className={`flag-stage flag-stage--${state}`}>
      <div className="flag-stage-glow" aria-hidden />
      <div className="flag-stage-frame">
        <img
          className="flag-stage-img"
          src={src}
          srcSet={`${src} 1x, ${src2x} 2x`}
          alt=""
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const fb = e.currentTarget.parentElement?.querySelector('.flag-stage-emoji')
            if (fb) fb.style.display = 'block'
          }}
        />
        <span className="flag-stage-emoji" style={{ display: 'none' }} aria-hidden>
          {emoji}
        </span>
        {state === 'correct' && <div className="flag-stage-burst" aria-hidden />}
      </div>
      {state === 'correct' && <div className="flag-stage-badge flag-stage-badge--ok">✓</div>}
      {state === 'wrong' && <div className="flag-stage-badge flag-stage-badge--no">✗</div>}
    </div>
  )
}
