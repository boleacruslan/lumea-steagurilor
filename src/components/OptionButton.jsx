export default function OptionButton({
  label,
  onClick,
  disabled,
  state, // undefined | 'correct' | 'wrong' | 'dim'
}) {
  const cls = [
    'option-btn',
    state === 'correct' && 'option-btn--correct',
    state === 'wrong' && 'option-btn--wrong',
    state === 'dim' && 'option-btn--dim',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
