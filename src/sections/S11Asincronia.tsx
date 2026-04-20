import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import DragAndDropMatch from '../components/shared/DragAndDropMatch'
import { useProgress } from '../context/ProgressContext'
import {
  s11FakeAsyncBefore,
  s11FakeAsyncAfter,
  s11SyncVsAsync,
  s11DebounceTest,
  s11ObservablesPromise,
  s11MarbleTesting,
  s11VueAsync,
  s11ReactAsync,
  s11UserEventTimers,
  s11TestingLibraryAsync,
  s11PassingButNotAssertingBuggy,
  s11PassingButNotAssertingOptions,
  s11AsyncChecklistPairs,
  s11AntiPatternPairs,
  s11Quiz,
  s11ReactQuiz,
  s11SimulatedOutput,
} from '../data/s11-asincronia.data'

type AsyncTab = 'observables' | 'marbles' | 'vue' | 'react' | 'testinglib'

export default function S11Asincronia() {
  const { markComplete } = useProgress()
  const [asyncTab, setAsyncTab] = useState<AsyncTab>('observables')
  const [pickedOption, setPickedOption] = useState<string | null>(null)
  const [revealOption, setRevealOption] = useState(false)

  const asyncTabs: { id: AsyncTab; label: string }[] = [
    { id: 'observables', label: 'Observables' },
    { id: 'marbles', label: 'Marble Testing' },
    { id: 'vue', label: 'Vue Async' },
    { id: 'react', label: 'React Async' },
    { id: 'testinglib', label: 'Testing Library' },
  ]

  const asyncCode: Record<AsyncTab, string> = {
    observables: s11ObservablesPromise,
    marbles: s11MarbleTesting,
    vue: s11VueAsync,
    react: s11ReactAsync,
    testinglib: s11TestingLibraryAsync,
  }

  const allQuizQuestions = [...s11Quiz, ...s11ReactQuiz]

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s11"
        icon="⏱️"
        title="Dominio de la Asincronía"
        description="Fake timers, Observables, Promises y control total del tiempo en tus tests."
        sectionNumber={12}
      />

      <div className="prose-guide space-y-3">
        <p className="text-gray-400">
          La asincronía es la <strong className="text-white">fuente #1 de tests flaky</strong>. Esta sección enseña a controlarla
          completamente: desde la migración de <code className="text-emerald-400">fakeAsync</code> hasta
          marble testing de Observables.
        </p>
      </div>

      {/* Diagrama visual: Event Loop */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">El Event Loop y por qué importa en testing</h2>
        <p className="text-gray-400">
          JavaScript tiene una cola de <strong className="text-white">macrotasks</strong> (setTimeout, setInterval) y una de{' '}
          <strong className="text-white">microtasks</strong> (Promises, queueMicrotask). Los fake timers solo controlan macrotasks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <p className="font-bold text-blue-400 text-sm mb-2">Macrotasks</p>
            <p className="text-xs text-gray-400 mb-2">Controlados por fake timers</p>
            <ul className="space-y-1">
              {['setTimeout', 'setInterval', 'setImmediate', 'requestAnimationFrame'].map((item) => (
                <li key={item} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <code>{item}</code>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
            <p className="font-bold text-purple-400 text-sm mb-2">Microtasks</p>
            <p className="text-xs text-gray-400 mb-2">NO controlados por fake timers sync</p>
            <ul className="space-y-1">
              {['Promise.then()', 'async/await', 'queueMicrotask', 'MutationObserver'].map((item) => (
                <li key={item} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <code>{item}</code>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="font-bold text-green-400 text-sm mb-2">Variantes Async de Vitest</p>
            <p className="text-xs text-gray-400 mb-2">Controlan ambos tipos</p>
            <ul className="space-y-1">
              {['advanceTimersByTimeAsync', 'runAllTimersAsync', 'runOnlyPendingTimersAsync', 'advanceTimersToNextTimerAsync'].map((item) => (
                <li key={item} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <code>vi.{item}()</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabla de migración Zone.js → Vitest */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Migración: fakeAsync/tick → vi.useFakeTimers</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-4 py-3 text-red-400">Zone.js (antes)</th>
                <th className="text-left px-4 py-3 text-green-400">Vitest (después)</th>
                <th className="text-left px-4 py-3 text-gray-400">Notas</th>
              </tr>
            </thead>
            <tbody>
              {[
                { before: 'fakeAsync(() => { ... })', after: 'vi.useFakeTimers()', note: 'En beforeEach' },
                { before: 'tick(ms)', after: 'vi.advanceTimersByTime(ms)', note: 'Avanza el reloj' },
                { before: 'tick() sin args', after: 'vi.advanceTimersByTime(0)', note: 'Flush sync' },
                { before: 'flush()', after: 'vi.runAllTimers()', note: 'Drena toda la cola' },
                { before: 'flushMicrotasks()', after: 'await vi.advanceTimersByTimeAsync(0)', note: 'Solo Promises' },
                { before: 'waitForAsync(() => { })', after: 'async () => { await ... }', note: 'async/await nativo' },
              ].map((row, idx) => (
                <tr key={row.before} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                  <td className="px-4 py-2.5"><code className="text-red-300 text-xs">{row.before}</code></td>
                  <td className="px-4 py-2.5"><code className="text-green-300 text-xs">{row.after}</code></td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WhyBox variant="warning" title="fakeAsync NO funciona en Vitest">
          <p>
            Los patches de Zone.js no se aplican en Vitest.{' '}
            <code className="text-yellow-400">fakeAsync()</code>,{' '}
            <code className="text-yellow-400">tick()</code>,{' '}
            <code className="text-yellow-400">flush()</code> y{' '}
            <code className="text-yellow-400">flushMicrotasks()</code>{' '}
            deben migrarse manualmente. El schematic automático <strong>no los convierte</strong>.
          </p>
        </WhyBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-gray-700">
          <div>
            <p className="text-xs text-red-400 font-semibold px-4 py-2 bg-red-500/5 border-b border-gray-700">
              ANTES (Zone.js)
            </p>
            <CodeBlock code={s11FakeAsyncBefore} language="ts" showLineNumbers={false} />
          </div>
          <div className="border-l border-gray-700">
            <p className="text-xs text-green-400 font-semibold px-4 py-2 bg-green-500/5 border-b border-gray-700">
              DESPUÉS (Vitest)
            </p>
            <CodeBlock code={s11FakeAsyncAfter} language="ts" showLineNumbers={false} />
          </div>
        </div>
      </div>

      {/* 2. La trampa sync vs async */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. La trampa: sync vs async en fake timers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-bold text-white mb-1">advanceTimersByTime() — sync</p>
            <p className="text-sm text-gray-400">
              Solo ejecuta macrotasks (setTimeout/setInterval).{' '}
              <strong className="text-red-400">NO flushea Promises.</strong>
            </p>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="font-bold text-white mb-1">advanceTimersByTimeAsync() — async</p>
            <p className="text-sm text-gray-400">
              Ejecuta macrotasks <strong className="text-green-400">Y flushea Promises</strong>{' '}
              entre cada ejecución de timer.
            </p>
          </div>
        </div>

        <CodeBlock code={s11SyncVsAsync} language="ts" />

        <WhyBox variant="why" title="Regla simple">
          <p>
            Si hay <strong>Promises involucradas</strong> (fetch, async/await, .then()), usar{' '}
            <strong>SIEMPRE</strong> las variantes{' '}
            <code className="text-yellow-400">*Async()</code>:{' '}
            <code className="text-yellow-400">advanceTimersByTimeAsync()</code>,{' '}
            <code className="text-yellow-400">runAllTimersAsync()</code>,{' '}
            <code className="text-yellow-400">runOnlyPendingTimersAsync()</code>.
          </p>
        </WhyBox>
      </div>

      {/* 3. Debounce */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Testing de debounce/throttle</h2>
        <CodeBlock code={s11DebounceTest} language="ts" />
      </div>

      {/* 4. Patrones async por framework */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Patrones async por contexto</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex flex-wrap bg-gray-800 border-b border-gray-700">
            {asyncTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAsyncTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  asyncTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CodeBlock code={asyncCode[asyncTab]} language="ts" />
        </div>
      </div>

      {/* 5. userEvent 14 + fake timers */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. userEvent 14 + fake timers</h2>
        <p className="text-gray-400">
          Mezclar userEvent con fake timers sin avisar al setup provoca timeouts silenciosos.
          Es uno de los errores más difíciles de diagnosticar.
        </p>
        <CodeBlock code={s11UserEventTimers} language="ts" />
        <WhyBox variant="warning" title="Síntoma típico del olvido">
          <p>
            Tests que pasaban empiezan a hacer timeout (5 s por defecto) tras introducir{' '}
            <code>vi.useFakeTimers()</code>. La Promise interna de <code>user.type()</code> se queda
            esperando un delay de 0 ms que nunca se resuelve porque el reloj está congelado.
          </p>
        </WhyBox>
      </div>

      {/* 6. Checklist interactivo: 7 escenarios */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">6. Checklist · escenario → herramienta</h2>
        <p className="text-gray-400">
          Siete escenarios cubren el 95 % de los casos async que verás. Empareja cada uno con la
          herramienta correcta antes de seguir.
        </p>
        <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-5">
          <DragAndDropMatch
            title="Empareja escenario con la herramienta async"
            promptHeader="Escenario"
            answerHeader="Herramienta correcta"
            promptLanguage="text"
            pairs={s11AsyncChecklistPairs}
          />
        </div>
      </div>

      {/* 7. Ejercicio: el test que pasa pero no asserta */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Ejercicio · el test que pasa pero no asserta</h2>

        <WhyBox variant="warning" title="El bug invisible" defaultOpen>
          <p>
            El siguiente test pasa <strong>siempre</strong>, incluso si el servicio devuelve basura.{' '}
            ¿Cuál de los tres arreglos es el correcto? Piénsalo antes de comprobar.
          </p>
        </WhyBox>

        <CodeBlock code={s11PassingButNotAssertingBuggy} language="ts" />

        <div className="space-y-3">
          {s11PassingButNotAssertingOptions.map((opt) => {
            const isPicked = pickedOption === opt.id
            const showFeedback = revealOption && isPicked
            const showAsWrong = revealOption && isPicked && !opt.correct
            const showAsRight = revealOption && isPicked && opt.correct
            return (
              <div
                key={opt.id}
                className={`rounded-lg border transition-colors ${
                  showAsRight
                    ? 'border-green-500/50 bg-green-500/5'
                    : showAsWrong
                      ? 'border-red-500/50 bg-red-500/5'
                      : isPicked
                        ? 'border-blue-500/50 bg-blue-500/5'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <button
                  onClick={() => {
                    setPickedOption(opt.id)
                    setRevealOption(false)
                  }}
                  disabled={revealOption}
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                      isPicked
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {showAsRight ? '✓' : showAsWrong ? '✗' : '◯'}
                  </span>
                  <span className="text-sm text-gray-200">{opt.label}</span>
                </button>
                <div className="border-t border-gray-800">
                  <CodeBlock code={opt.code} language="ts" showLineNumbers={false} />
                </div>
                {showFeedback && (
                  <div
                    className={`px-4 py-3 text-xs border-t ${
                      opt.correct
                        ? 'bg-green-500/10 border-green-500/30 text-green-200'
                        : 'bg-red-500/10 border-red-500/30 text-red-200'
                    }`}
                  >
                    {opt.feedback}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setRevealOption(true)}
            disabled={!pickedOption || revealOption}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              pickedOption && !revealOption
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Comprobar respuesta
          </button>
          {revealOption && (
            <button
              onClick={() => {
                setPickedOption(null)
                setRevealOption(false)
              }}
              className="px-5 py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              Intentar de nuevo
            </button>
          )}
          {!pickedOption && (
            <span className="self-center text-xs text-gray-500">Selecciona una opción para continuar</span>
          )}
        </div>
      </div>

      {/* 8. Ejercicio antipatrones */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">8. Ejercicio · identifica el antipatrón</h2>
        <p className="text-gray-400">
          Cada snippet tiene un bug async común. Empareja cada uno con su causa raíz.
        </p>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-5">
          <DragAndDropMatch
            title="Snippet con bug → causa raíz"
            promptHeader="Snippet"
            answerHeader="Causa raíz"
            answerLanguage="text"
            pairs={s11AntiPatternPairs}
          />
        </div>
      </div>

      {/* 9. Árbol de decisiones */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">9. Guía de decisión</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Timer (setTimeout/setInterval)',
              color: 'border-blue-500/30 bg-blue-500/5',
              solution: 'vi.useFakeTimers() + advanceTimersByTime()',
              note: '¿Promises dentro? → usar variante *Async()',
            },
            {
              title: 'Promise / fetch / HTTP',
              color: 'border-green-500/30 bg-green-500/5',
              solution: 'async/await + mock del servicio',
              note: 'Angular: HttpTestingController | Vue: flushPromises()',
            },
            {
              title: 'Observable (RxJS)',
              color: 'border-purple-500/30 bg-purple-500/5',
              solution: 'firstValueFrom() o marble testing',
              note: 'Simple → Promise | Complejo → TestScheduler',
            },
            {
              title: 'Debounce / Throttle',
              color: 'border-yellow-500/30 bg-yellow-500/5',
              solution: 'vi.useFakeTimers() + advanceTimersByTimeAsync()',
              note: 'Siempre async por las Promises internas',
            },
          ].map((item) => (
            <div key={item.title} className={`rounded-lg border p-4 ${item.color}`}>
              <p className="font-bold text-white mb-1">{item.title}</p>
              <code className="text-xs text-emerald-400 block mb-1">{item.solution}</code>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <SimulatedTestOutput lines={s11SimulatedOutput} title="vitest run s11-asincronia/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz
          questions={allQuizQuestions}
          sectionId="s11"
          onComplete={(score, total) => {
            if (score / total >= 0.7) markComplete('s11')
          }}
        />
      </div>
    </div>
  )
}
