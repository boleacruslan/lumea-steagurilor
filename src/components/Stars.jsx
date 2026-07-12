export default function Stars({ count = 0, max = 3, size = 'md' }) {
  return (
    <div className={`stars stars--${size}`} aria-label={`${count} stele din ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'star star--on' : 'star star--off'}>
          {i < count ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  )
}
