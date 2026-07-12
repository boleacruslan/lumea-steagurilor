import { codeToFlag } from '../data/countries'

/**
 * Steag animat: flutură, confetti la corect, „se dezumflă” la greșit.
 * state: 'idle' | 'correct' | 'wrong' | 'raise'
 */
export default function Flag({
  code,
  size = 'lg',
  state = 'idle',
  className = '',
  onClick,
}) {
  const emoji = codeToFlag(code)
  const sizeClass = size === 'sm' ? 'flag--sm' : size === 'md' ? 'flag--md' : size === 'xl' ? 'flag--xl' : 'flag--lg'

  return (
    <div
      className={`flag-pole-wrap ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {(state === 'raise' || state === 'correct') && (
        <div className="flag-pole" aria-hidden>
          <div className="flag-pole-stick" />
          <div className="flag-pole-ball" />
        </div>
      )}
      <div
        className={`flag ${sizeClass} flag--${state} ${state === 'raise' ? 'flag--raising' : ''}`}
        aria-label={`Steag ${code}`}
      >
        <span className="flag-emoji" aria-hidden>
          {emoji}
        </span>
        {state === 'correct' && <div className="confetti" aria-hidden />}
      </div>
    </div>
  )
}
