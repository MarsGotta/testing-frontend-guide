import { useProgress } from '../../context/ProgressContext'

export default function TopBar() {
  const { progressPercent, completed } = useProgress()
  const total = 9

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-white shrink-0">
        <span className="text-xl">🧪</span>
        <span className="hidden sm:inline text-sm">Guía de Testing Frontend</span>
      </div>

      {/* Progress bar area */}
      <div className="flex-1 flex items-center gap-3 ml-4">
        <div className="flex-1 max-w-xs h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {completed.size}/{total} secciones
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {progressPercent === 100 && (
          <span className="text-xs text-yellow-400 font-semibold animate-pulse">
            🏆 ¡Completado!
          </span>
        )}
      </div>
    </header>
  )
}
