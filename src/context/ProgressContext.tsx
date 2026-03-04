import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface ProgressContextValue {
  completed: Set<string>
  markComplete: (sectionId: string) => void
  isComplete: (sectionId: string) => boolean
  progressPercent: number
}

const STORAGE_KEY = 'guia-testing-progress'
const TOTAL_SECTIONS = 9

function loadFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return new Set(JSON.parse(stored) as string[])
    }
  } catch {
    // ignore
  }
  return new Set()
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(loadFromStorage)

  const markComplete = useCallback((sectionId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(sectionId)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const isComplete = useCallback(
    (sectionId: string) => completed.has(sectionId),
    [completed],
  )

  const progressPercent = Math.round((completed.size / TOTAL_SECTIONS) * 100)

  return (
    <ProgressContext.Provider value={{ completed, markComplete, isComplete, progressPercent }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
