import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import Home from './pages/Home'
import Play from './pages/Play'
import GuessFlag from './pages/GuessFlag'
import GuessCapital from './pages/GuessCapital'
import MatchPairs from './pages/MatchPairs'
import FlagPuzzle from './pages/FlagPuzzle'
import Journey from './pages/Journey'
import Collection from './pages/Collection'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import './App.css'

function routerBasename() {
  const raw = import.meta.env.BASE_URL || '/'
  // Capacitor / relative build: "./" → no basename
  if (raw === './' || raw === '.' || raw === '') return undefined
  const b = raw.replace(/\/$/, '')
  return b || undefined
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/flag" element={<GuessFlag />} />
          <Route path="/play/capital" element={<GuessCapital />} />
          <Route path="/play/pairs" element={<MatchPairs />} />
          <Route path="/play/puzzle" element={<FlagPuzzle />} />
          <Route path="/play/journey" element={<Journey />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
