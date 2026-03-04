import { useState, useCallback, useRef, useEffect } from 'react'
import type { OutputLine } from '../../types/guide.types'

interface SimulatedTestOutputProps {
  lines: OutputLine[]
  title?: string
  testFile?: string
}

const lineColors: Record<OutputLine['type'], string> = {
  title: 'text-gray-300 font-semibold',
  pass: 'text-green-400',
  fail: 'text-red-400',
  info: 'text-yellow-400',
  summary: 'text-gray-400',
}

const linePrefix: Record<OutputLine['type'], string> = {
  title: '',
  pass: '  ✓ ',
  fail: '  ✗ ',
  info: '  ○ ',
  summary: '',
}

export default function SimulatedTestOutput({
  lines,
  title = 'Terminal',
  testFile,
}: SimulatedTestOutputProps) {
  const [revealed, setRevealed] = useState<OutputLine[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Limpiar el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [])

  const runTest = useCallback(() => {
    if (running) return
    setRevealed([])
    setDone(false)
    setRunning(true)

    let i = 0
    intervalRef.current = setInterval(() => {
      // Verificar bounds antes de acceder a lines[i]
      if (i < lines.length) {
        setRevealed((prev) => [...prev, lines[i]])
      }
      i++
      if (i >= lines.length) {
        if (intervalRef.current !== null) clearInterval(intervalRef.current)
        setRunning(false)
        setDone(true)
      }
    }, 120)
  }, [lines, running])

  const reset = () => {
    setRevealed([])
    setDone(false)
  }

  const passCount = lines.filter((l) => l.type === 'pass').length
  const failCount = lines.filter((l) => l.type === 'fail').length

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm font-mono">$ {title}</span>
          {testFile && (
            <span className="text-xs text-gray-500 font-mono">{testFile}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {done && (
            <span className="text-xs text-gray-500">
              {failCount === 0 ? (
                <span className="text-green-400">{passCount} passed</span>
              ) : (
                <span className="text-red-400">{failCount} failed</span>
              )}
            </span>
          )}
          {done && (
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={runTest}
            disabled={running}
            className={`
              text-xs px-3 py-1.5 rounded font-medium transition-colors
              ${running
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'}
            `}
          >
            {running ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">◌</span> Ejecutando…
              </span>
            ) : (
              '▶ Ejecutar Test'
            )}
          </button>
        </div>
      </div>

      {/* Output terminal */}
      <div className="bg-gray-950 p-4 min-h-[140px] font-mono text-xs leading-relaxed">
        {revealed.length === 0 && !running && (
          <p className="text-gray-600 italic">
            Haz clic en "Ejecutar Test" para ver la salida…
          </p>
        )}
        {revealed.map((line, idx) => line && (
          <div key={idx} className={lineColors[line.type]}>
            {linePrefix[line.type]}
            {line.text}
          </div>
        ))}
        {running && (
          <span className="text-gray-500 animate-pulse">▌</span>
        )}
      </div>
    </div>
  )
}
