import { t } from '../data/i18n'
import { ACHIEVEMENTS } from '../lib/gameUtils'
import { useProgressContext } from '../context/ProgressContext'
import Shell from '../components/Shell'

const COLORS = ['#39e75f', '#ff8c00', '#ff2d95', '#3dbbff', '#ffe600', '#b44dff', '#14b8a6', '#f59e0b']

export default function Achievements() {
  const { progress } = useProgressContext()
  const unlocked = new Set(progress.achievements)

  return (
    <Shell title={t('achievements').toUpperCase()} backTo="/">
      <nav className="yt-menu">
        {ACHIEVEMENTS.map((a, i) => {
          const ok = unlocked.has(a.id)
          return (
            <div
              key={a.id}
              className={`yt-menu-item ${ok ? '' : 'yt-menu-item--locked'}`}
            >
              <span
                className="yt-menu-letter"
                style={{ background: ok ? COLORS[i % COLORS.length] : '#64748b' }}
              >
                {ok ? a.emoji : '🔒'}
              </span>
              <span className="yt-menu-body">
                <strong>{t(a.titleKey)}</strong>
                <span>{t(a.descKey)}</span>
              </span>
              {ok && <span className="yt-check">✓</span>}
            </div>
          )
        })}
      </nav>
    </Shell>
  )
}
