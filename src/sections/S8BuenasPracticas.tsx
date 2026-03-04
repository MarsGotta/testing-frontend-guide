import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s8CoverageTestCode,
  s8GoldenRule,
  s8AntiPatterns,
  s8CoverageExample,
  s8WhatNotToTest,
  s8Quiz,
  s8SimulatedOutput,
} from '../data/s8-buenas-practicas.data'

export default function S8BuenasPracticas() {
  const { markComplete, progressPercent, completed } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s8"
        icon="✅"
        title="Buenas Prácticas y Cobertura"
        description="La regla de oro, antipatrones comunes, cobertura de código y qué NO testear."
        sectionNumber={9}
      />

      {/* Golden rule */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. La Regla de Oro</h2>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
          <p className="text-yellow-200 text-lg font-medium leading-relaxed italic">
            "El código de los tests no es como el código de producción —
            diséñalo para que sea <strong>simple, corto y sin abstracciones innecesarias</strong>."
          </p>
          <p className="text-yellow-600 text-sm mt-3">— Yoni Goldberg, JavaScript Testing Best Practices</p>
        </div>

        <CodeBlock code={s8GoldenRule} language="ts" showLineNumbers={false} />
      </div>

      {/* Anti-patterns */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">2. Antipatrones comunes</h2>

        {s8AntiPatterns.map((pattern) => (
          <div key={pattern.title} className="space-y-3">
            <h3 className="text-base font-semibold text-red-400">{pattern.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Así no ❌</p>
                <CodeBlock code={pattern.bad} language="tsx" showLineNumbers={false} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Así sí ✅</p>
                <CodeBlock code={pattern.good} language="tsx" showLineNumbers={false} />
              </div>
            </div>

            <WhyBox variant="why" title="¿Por qué importa?">
              <p>{pattern.explanation}</p>
            </WhyBox>
          </div>
        ))}
      </div>

      {/* Coverage */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Cobertura de código</h2>
        <p className="text-gray-400">
          La cobertura mide qué porcentaje del código se ejecuta durante los tests.
          <strong className="text-white"> ~80% es un objetivo realista y saludable</strong>.
          El 100% puede ser contraproducente.
        </p>

        <CodeBlock
          code={s8CoverageExample}
          language="bash"
          filename="npm run coverage"
          showLineNumbers={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { metric: 'Statements', value: '91.30', color: 'text-green-400', bar: 91 },
            { metric: 'Branches', value: '83.33', color: 'text-green-400', bar: 83 },
            { metric: 'Functions', value: '88.88', color: 'text-green-400', bar: 89 },
            { metric: 'Lines', value: '91.30', color: 'text-green-400', bar: 91 },
          ].map((item) => (
            <div key={item.metric} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="text-xs text-gray-500 mb-1">{item.metric}</div>
              <div className={`text-xl font-bold ${item.color}`}>{item.value}%</div>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${item.bar}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What NOT to test */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. ¿Qué NO testear?</h2>

        <CodeBlock
          code={s8WhatNotToTest}
          language="ts"
          showLineNumbers={false}
          filename="Qué testear y qué no"
        />
      </div>

      {/* Full test example */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. Ejemplo: Buenas prácticas en acción</h2>
        <CodeBlock
          code={s8CoverageTestCode}
          language="ts"
          filename="tests/s8-buenas-practicas/coverage-demo.test.ts"
        />
      </div>

      <SimulatedTestOutput lines={s8SimulatedOutput} title="vitest run --coverage" />

      {/* Completion banner */}
      {progressPercent === 100 && (
        <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-yellow-300 mb-2">¡Guía completada!</h3>
          <p className="text-yellow-200/70">
            Has completado las {completed.size} secciones de la guía. Ahora tienes las herramientas
            para escribir tests de calidad con Testing Library y Vitest.
          </p>
        </div>
      )}

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s8Quiz} sectionId="s8" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s8')
        }} />
      </div>
    </div>
  )
}
