import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { installAudioUnlock, preloadVoices } from './lib/audio'
import './index.css'
import './styles/yt-quiz.css'
import App from './App.jsx'

async function initNative() {
  if (!Capacitor.isNativePlatform()) return
  try {
    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#4f46e5' })
  } catch {
    /* web / unsupported */
  }
  try {
    await SplashScreen.hide()
  } catch {
    /* ignore */
  }
}

preloadVoices()
installAudioUnlock()
initNative()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
