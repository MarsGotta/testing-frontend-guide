import { useState, useMemo, useCallback } from 'react'

export interface MatchPair {
  id: string
  prompt: string
  answer: string
  explanation?: string
}

interface DragAndDropMatchProps {
  pairs: MatchPair[]
  title?: string
  promptHeader?: string
  answerHeader?: string
  promptLanguage?: 'code' | 'text'
  answerLanguage?: 'code' | 'text'
  onComplete?: (correct: number, total: number) => void
}

function shuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr]
  let s = 0
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function DragAndDropMatch({
  pairs,
  title = 'Empareja los conceptos',
  promptHeader = 'Origen',
  answerHeader = 'Destino',
  promptLanguage = 'code',
  answerLanguage = 'code',
  onComplete,
}: DragAndDropMatchProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const seed = pairs.map((p) => p.id).join('-')
  const shuffledAnswers = useMemo(() => shuffle(pairs, seed), [pairs, seed])

  const allMatched = Object.keys(matches).length === pairs.length

  const correctCount = useMemo(() => {
    return pairs.filter((p) => matches[p.id] === p.id).length
  }, [pairs, matches])

  const handlePromptClick = (promptId: string) => {
    if (submitted) return
    if (matches[promptId]) {
      const next = { ...matches }
      delete next[promptId]
      setMatches(next)
      setSelectedPrompt(null)
      return
    }
    setSelectedPrompt((prev) => (prev === promptId ? null : promptId))
  }

  const handleAnswerClick = (answerId: string) => {
    if (submitted) return
    const owner = Object.entries(matches).find(([, aId]) => aId === answerId)?.[0]
    if (owner) {
      const next = { ...matches }
      delete next[owner]
      setMatches(next)
      return
    }
    if (!selectedPrompt) return
    setMatches((prev) => ({ ...prev, [selectedPrompt]: answerId }))
    setSelectedPrompt(null)
  }

  const handleSubmit = useCallback(() => {
    if (!allMatched) return
    setSubmitted(true)
    onComplete?.(correctCount, pairs.length)
  }, [allMatched, correctCount, onComplete, pairs.length])

  const handleReset = () => {
    setMatches({})
    setSelectedPrompt(null)
    setSubmitted(false)
  }

  const allCorrect = submitted && correctCount === pairs.length

  const renderCell = (content: string, language: 'code' | 'text') => {
    if (language === 'code') {
      return (
        <pre className="whitespace-pre-wrap font-mono text-[11px] leading-snug">{content}</pre>
      )
    }
    return <span className="text-sm leading-snug">{content}</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">🔗</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {submitted && (
          <span
            className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full border ${
              allCorrect
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {correctCount}/{pairs.length} {allCorrect ? '✓ Perfecto' : '✗ Revisa los fallos'}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400">
        {submitted
          ? 'Los emparejamientos correctos se muestran en verde y los incorrectos en rojo.'
          : selectedPrompt
            ? 'Ahora haz clic en la opción de la columna derecha que le corresponde.'
            : 'Haz clic en un elemento de la izquierda y luego en su par de la derecha. Para deshacer, haz clic de nuevo sobre el emparejamiento.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna prompts */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            {promptHeader}
          </p>
          {pairs.map((pair) => {
            const isSelected = selectedPrompt === pair.id
            const matchedAnswerId = matches[pair.id]
            const isMatched = Boolean(matchedAnswerId)
            const isCorrect = submitted && matchedAnswerId === pair.id
            const isWrong = submitted && isMatched && matchedAnswerId !== pair.id

            let classes =
              'w-full text-left px-3 py-2.5 rounded-lg border transition-colors '
            if (submitted) {
              if (isCorrect) classes += 'bg-green-500/10 border-green-500/40 text-green-200'
              else if (isWrong) classes += 'bg-red-500/10 border-red-500/40 text-red-200'
              else classes += 'bg-gray-800/40 border-gray-700 text-gray-400'
            } else if (isSelected) {
              classes += 'bg-blue-500/15 border-blue-500/60 text-blue-100 ring-2 ring-blue-500/30'
            } else if (isMatched) {
              classes += 'bg-purple-500/10 border-purple-500/40 text-purple-200'
            } else {
              classes += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-700'
            }

            return (
              <button
                key={pair.id}
                onClick={() => handlePromptClick(pair.id)}
                disabled={submitted}
                className={classes}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">{renderCell(pair.prompt, promptLanguage)}</div>
                  {isMatched && !submitted && (
                    <span className="text-xs font-mono text-purple-300 mt-0.5 shrink-0">
                      #{shuffledAnswers.findIndex((a) => a.id === matchedAnswerId) + 1}
                    </span>
                  )}
                  {submitted && isCorrect && <span className="text-green-400 shrink-0">✓</span>}
                  {submitted && isWrong && <span className="text-red-400 shrink-0">✗</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Columna answers */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            {answerHeader}
          </p>
          {shuffledAnswers.map((pair, idx) => {
            const owner = Object.entries(matches).find(([, aId]) => aId === pair.id)?.[0]
            const isMatched = Boolean(owner)
            const isCorrect = submitted && owner === pair.id
            const isWrong = submitted && isMatched && owner !== pair.id
            const canSelect = !submitted && (selectedPrompt || isMatched)

            let classes =
              'w-full text-left px-3 py-2.5 rounded-lg border transition-colors '
            if (submitted) {
              if (isCorrect) classes += 'bg-green-500/10 border-green-500/40 text-green-200'
              else if (isWrong) classes += 'bg-red-500/10 border-red-500/40 text-red-200'
              else classes += 'bg-gray-800/40 border-gray-700 text-gray-400'
            } else if (isMatched) {
              classes += 'bg-purple-500/10 border-purple-500/40 text-purple-200'
            } else if (canSelect) {
              classes += 'bg-gray-800 border-gray-700 text-gray-200 hover:border-blue-500/60 hover:bg-gray-700 cursor-pointer'
            } else {
              classes += 'bg-gray-800/60 border-gray-700 text-gray-500 cursor-not-allowed'
            }

            return (
              <button
                key={pair.id}
                onClick={() => handleAnswerClick(pair.id)}
                disabled={submitted || (!selectedPrompt && !isMatched)}
                className={classes}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono text-gray-500 mt-0.5 shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">{renderCell(pair.answer, answerLanguage)}</div>
                  {submitted && isCorrect && <span className="text-green-400 shrink-0">✓</span>}
                  {submitted && isWrong && <span className="text-red-400 shrink-0">✗</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Explicaciones post-submit */}
      {submitted && (
        <div className="space-y-2 pt-2">
          {pairs.map((pair) => {
            if (!pair.explanation) return null
            const isCorrect = matches[pair.id] === pair.id
            return (
              <div
                key={pair.id}
                className={`rounded-lg px-3 py-2 text-xs border ${
                  isCorrect
                    ? 'bg-green-500/5 border-green-500/20 text-green-300'
                    : 'bg-red-500/5 border-red-500/20 text-red-300'
                }`}
              >
                <span className="font-mono text-gray-400 mr-2">
                  {pair.prompt.split('\n')[0].slice(0, 40)}
                  {pair.prompt.length > 40 ? '…' : ''}
                </span>
                {pair.explanation}
              </div>
            )
          })}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allMatched}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              allMatched
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Comprobar emparejamientos
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Intentar de nuevo
          </button>
        )}
        {!allMatched && !submitted && (
          <span className="self-center text-xs text-gray-500">
            Empareja todos los elementos para continuar ({Object.keys(matches).length}/{pairs.length})
          </span>
        )}
      </div>
    </div>
  )
}
