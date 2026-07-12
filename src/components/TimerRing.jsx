/** Circular countdown — stil quiz YouTube (5 secunde) */
export default function TimerRing({ seconds, total, urgent }) {
  const r = 36
  const c = 2 * Math.PI * r
  const ratio = Math.max(0, Math.min(1, seconds / total))
  const offset = c * (1 - ratio)

  return (
    <div className={`timer-ring ${urgent ? 'timer-ring--urgent' : ''}`} aria-label={`${Math.ceil(seconds)} secunde`}>
      <svg viewBox="0 0 88 88" className="timer-ring-svg">
        <circle className="timer-ring-bg" cx="44" cy="44" r={r} />
        <circle
          className="timer-ring-fg"
          cx="44"
          cy="44"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="timer-ring-num">{Math.max(0, Math.ceil(seconds))}</span>
    </div>
  )
}
