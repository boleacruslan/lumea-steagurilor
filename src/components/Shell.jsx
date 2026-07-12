import { Link } from 'react-router-dom'
import SunburstBg from './SunburstBg'

/**
 * Layout global: fundal sunburst + conținut (stil quiz YouTube)
 */
export default function Shell({
  children,
  title,
  backTo,
  backLabel = '←',
  wide = false,
  className = '',
}) {
  return (
    <div className={`yt-quiz ${className}`}>
      <SunburstBg />
      <div className={`yt-quiz-inner ${wide ? 'yt-quiz-inner--wide' : ''}`}>
        {(backTo || title) && (
          <header className="shell-header">
            {backTo ? (
              <Link to={backTo} className="yt-back" aria-label="Înapoi">
                {backLabel}
              </Link>
            ) : (
              <span className="shell-header-spacer" />
            )}
            {title ? <h1 className="yt-title shell-title">{title}</h1> : <span />}
            <span className="shell-header-spacer" />
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
