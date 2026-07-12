import { createContext, useContext } from 'react'
import { useProgress } from '../hooks/useProgress'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const value = useProgress()
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgressContext outside provider')
  return ctx
}
