import { useState } from 'react'
import { t } from '../data/i18n'
import { useProgressContext } from '../context/ProgressContext'
import { playClick, playCorrect, speakUi, unlockAudio } from '../lib/audio'
import Shell from '../components/Shell'

export default function Settings() {
  const { progress, setDifficulty, setVoice, setSound, resetAll } = useProgressContext()
  const [confirm, setConfirm] = useState(false)
  const [status, setStatus] = useState('')

  const testVoice = () => {
    unlockAudio()
    playClick(true)
    speakUi('voiceTest', true)
    setStatus('Voce veselă pentru copii — trebuie să auzi acum!')
  }

  const testSound = () => {
    unlockAudio()
    playCorrect(true)
    setStatus('Bip-uri UI ✓')
  }

  return (
    <Shell title={t('settingsTitle').toUpperCase()} backTo="/">
      <section className="yt-card">
        <h2 className="yt-card-title">{t('difficulty')}</h2>
        <div className="yt-diff-list">
          {[
            { id: 'easy', label: t('easy'), desc: t('easyDesc'), color: '#39e75f' },
            { id: 'medium', label: t('medium'), desc: t('mediumDesc'), color: '#ffc107' },
            { id: 'hard', label: t('hard'), desc: t('hardDesc'), color: '#ff3b5c' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              className={`yt-menu-item ${progress.difficulty === d.id ? 'yt-menu-item--active' : ''}`}
              onClick={() => {
                playClick(true)
                setDifficulty(d.id)
              }}
            >
              <span className="yt-menu-letter" style={{ background: d.color }}>
                {d.id === 'easy' ? '1' : d.id === 'medium' ? '2' : '3'}
              </span>
              <span className="yt-menu-body">
                <strong>{d.label.toUpperCase()}</strong>
                <span>{d.desc}</span>
              </span>
              {progress.difficulty === d.id && <span className="yt-check">✓</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="yt-card">
        <h2 className="yt-card-title">Audio</h2>
        <label className="yt-toggle">
          <span>{progress.voiceEnabled !== false ? t('speakOn') : t('speakOff')}</span>
          <input
            type="checkbox"
            checked={progress.voiceEnabled !== false}
            onChange={(e) => {
              setVoice(e.target.checked)
              if (e.target.checked) {
                unlockAudio()
                speakUi('voiceTest', true)
              }
            }}
          />
        </label>
        <label className="yt-toggle">
          <span>{progress.soundEnabled !== false ? t('soundOn') : t('soundOff')}</span>
          <input
            type="checkbox"
            checked={progress.soundEnabled !== false}
            onChange={(e) => {
              setSound(e.target.checked)
              if (e.target.checked) {
                unlockAudio()
                playCorrect(true)
              }
            }}
          />
        </label>
        <button type="button" className="yt-btn yt-btn--primary" onClick={testVoice}>
          🔊 {t('voiceTest')}
        </button>
        <button type="button" className="yt-btn" onClick={testSound}>
          🔔 Test sunet
        </button>
        {status && <p className="yt-status">{status}</p>}
      </section>

      <section className="yt-card">
        <h2 className="yt-card-title">{t('about')}</h2>
        <p className="yt-card-text">{t('aboutText')}</p>
        <p className="yt-card-text">
          {t('version')} 1.0 · {t('languageNote')}
        </p>
      </section>

      <section className="yt-card">
        {!confirm ? (
          <button type="button" className="yt-btn yt-btn--danger" onClick={() => setConfirm(true)}>
            {t('resetProgress')}
          </button>
        ) : (
          <div className="yt-confirm">
            <p>{t('resetConfirm')}</p>
            <div className="yt-btn-row">
              <button
                type="button"
                className="yt-btn yt-btn--danger"
                onClick={() => {
                  resetAll()
                  setConfirm(false)
                }}
              >
                {t('yes')}
              </button>
              <button type="button" className="yt-btn" onClick={() => setConfirm(false)}>
                {t('no')}
              </button>
            </div>
          </div>
        )}
      </section>
    </Shell>
  )
}
