import { useState } from 'react'
import type { QuizQuestion } from '../../types/guide.types'

interface QuizProps {
  questions: QuizQuestion[]
  sectionId: string
  onComplete: (score: number, total: number) => void
}

export default function Quiz({ questions, sectionId: _sectionId, onComplete }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  const handleSelect = (questionId: string, optionIdx: number) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }))
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++
    })
    setScore(correct)
    setSubmitted(true)
    onComplete(correct, questions.length)
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const percentage = submitted ? Math.round((score / questions.length) * 100) : 0
  const passed = percentage >= 70

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="text-xl">🧠</span>
        <h3 className="text-lg font-semibold text-white">Quiz de la Sección</h3>
        {submitted && (
          <span
            className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${
              passed
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {score}/{questions.length} ({percentage}%) {passed ? '✓ Aprobado' : '✗ Inténtalo de nuevo'}
          </span>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, qIdx) => {
        const selected = answers[q.id]
        const isCorrect = submitted && selected === q.correctIndex
        const isWrong = submitted && selected !== undefined && selected !== q.correctIndex

        return (
          <div key={q.id} className="space-y-3">
            <p className="text-gray-200 font-medium">
              <span className="text-gray-500 mr-2">{qIdx + 1}.</span>
              {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((option, optIdx) => {
                const isSelected = selected === optIdx
                const isThisCorrect = submitted && optIdx === q.correctIndex

                let classes =
                  'w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors '

                if (submitted) {
                  if (isThisCorrect) {
                    classes += 'bg-green-500/10 border-green-500/40 text-green-300'
                  } else if (isSelected && !isThisCorrect) {
                    classes += 'bg-red-500/10 border-red-500/40 text-red-300'
                  } else {
                    classes += 'bg-gray-800/40 border-gray-700 text-gray-500'
                  }
                } else {
                  if (isSelected) {
                    classes +=
                      'bg-blue-500/15 border-blue-500/50 text-blue-200'
                  } else {
                    classes +=
                      'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    disabled={submitted}
                    className={classes}
                  >
                    <span className="text-gray-500 mr-2">
                      {String.fromCharCode(65 + optIdx)})
                    </span>
                    {option}
                    {submitted && isThisCorrect && (
                      <span className="ml-2 text-green-400">✓</span>
                    )}
                    {submitted && isSelected && !isThisCorrect && (
                      <span className="ml-2 text-red-400">✗</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {submitted && (
              <div
                className={`rounded-lg px-4 py-3 text-sm border ${
                  isCorrect
                    ? 'bg-green-500/5 border-green-500/20 text-green-300'
                    : isWrong
                    ? 'bg-red-500/5 border-red-500/20 text-red-300'
                    : 'bg-gray-800 border-gray-700 text-gray-300'
                }`}
              >
                <span className="font-semibold">
                  {isCorrect ? '¡Correcto! ' : 'Explicación: '}
                </span>
                {q.explanation}
              </div>
            )}
          </div>
        )
      })}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`
              px-5 py-2.5 rounded-lg font-medium text-sm transition-colors
              ${allAnswered
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
            `}
          >
            Comprobar respuestas
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Intentar de nuevo
          </button>
        )}

        {!allAnswered && !submitted && (
          <span className="self-center text-xs text-gray-500">
            Responde todas las preguntas para continuar
          </span>
        )}
      </div>
    </div>
  )
}
