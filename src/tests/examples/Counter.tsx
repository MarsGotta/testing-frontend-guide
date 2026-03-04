import { useState } from 'react'

interface CounterProps {
  initialValue?: number
  step?: number
  min?: number
  max?: number
}

export function Counter({ initialValue = 0, step = 1, min, max }: CounterProps) {
  const [count, setCount] = useState(initialValue)

  const decrement = () => {
    setCount((c) => (min !== undefined ? Math.max(min, c - step) : c - step))
  }

  const increment = () => {
    setCount((c) => (max !== undefined ? Math.min(max, c + step) : c + step))
  }

  const reset = () => setCount(initialValue)

  const isAtMin = min !== undefined && count <= min
  const isAtMax = max !== undefined && count >= max

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <span
        data-testid="count-display"
        className="text-4xl font-bold tabular-nums"
        aria-live="polite"
        aria-label={`Contador: ${count}`}
      >
        {count}
      </span>

      <div className="flex gap-3">
        <button
          onClick={decrement}
          disabled={isAtMin}
          aria-label="Decrementar"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          −
        </button>
        <button
          onClick={reset}
          aria-label="Reiniciar"
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
        >
          ↺
        </button>
        <button
          onClick={increment}
          disabled={isAtMax}
          aria-label="Incrementar"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {(min !== undefined || max !== undefined) && (
        <p className="text-xs text-gray-500">
          Rango: {min ?? '−∞'} … {max ?? '+∞'}
        </p>
      )}
    </div>
  )
}
