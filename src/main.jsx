import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { installAudioUnlock, preloadVoices } from './lib/audio'
import './index.css'
import './styles/yt-quiz.css'
import App from './App.jsx'

preloadVoices()
installAudioUnlock()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
