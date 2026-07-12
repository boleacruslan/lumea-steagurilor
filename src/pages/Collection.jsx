import { t } from '../data/i18n'
import { BASE_COUNTRIES, codeToFlag, CONTINENTS } from '../data/countries'
import { useProgressContext } from '../context/ProgressContext'
import { speakCapital, speakName, unlockAudio } from '../lib/audio'
import Shell from '../components/Shell'

export default function Collection() {
  const { progress } = useProgressContext()
  const collected = new Set(progress.collectedFlags)

  return (
    <Shell title={t('collection').toUpperCase()} backTo="/" wide>
      <p className="shell-lead">
        {t('collected')}: {progress.collectedFlags.length} / {BASE_COUNTRIES.length}
      </p>

      {Object.values(CONTINENTS).map((cont) => {
        const list = BASE_COUNTRIES.filter((c) => c.continent === cont.id)
        return (
          <section key={cont.id} className="yt-card">
            <h2 className="yt-card-title">
              {cont.emoji} {cont.name}
            </h2>
            <div className="yt-collect-grid">
              {list.map((c) => {
                const open = collected.has(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`yt-collect-card ${open ? 'yt-collect-card--open' : ''}`}
                    onClick={async () => {
                      if (open && progress.voiceEnabled !== false) {
                        unlockAudio()
                        await speakName(c.id, '', true)
                        await speakCapital(c.id, '', true)
                      }
                    }}
                  >
                    <span className="yt-collect-flag">{open ? codeToFlag(c.code) : '❔'}</span>
                    <span className="yt-collect-name">{open ? c.name : '???'}</span>
                    {open && <span className="yt-collect-cap">{c.capital}</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </Shell>
  )
}
