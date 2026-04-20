import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import DragAndDropMatch from '../components/shared/DragAndDropMatch'
import { useProgress } from '../context/ProgressContext'
import {
  s10HoistingProblem,
  s10HttpAngular,
  s10HttpVue,
  s10MswV2,
  s10NgRxStore,
  s10PiniaStore,
  s10PiniaGotcha,
  s10ReduxToolkit,
  s10Zustand,
  s10TanStackQuery,
  s10RouterAngular,
  s10RouterVue,
  s10AntiOverMocking,
  s10AntiNoRestore,
  s10ClearResetRestore,
  s10HoistingBugOptions,
  s10WhatToMockPairs,
  s10Quiz,
  s10ExtraQuiz,
  s10SimulatedOutput,
} from '../data/s10-mocking-avanzado.data'

type HttpTab = 'angular' | 'vue' | 'msw'
type StoreTab = 'ngrx' | 'pinia' | 'redux' | 'zustand' | 'tanstack'
type RouterTab = 'angular' | 'vue'

export default function S10MockingAvanzado() {
  const { markComplete } = useProgress()
  const [httpTab, setHttpTab] = useState<HttpTab>('angular')
  const [storeTab, setStoreTab] = useState<StoreTab>('ngrx')
  const [routerTab, setRouterTab] = useState<RouterTab>('angular')
  const [hoistingPick, setHoistingPick] = useState<string | null>(null)
  const [hoistingReveal, setHoistingReveal] = useState(false)

  function TabBar<T extends string>({
    tabs,
    active,
    onChange,
  }: {
    tabs: { id: T; label: string }[]
    active: T
    onChange: (id: T) => void
  }) {
    return (
      <div className="flex flex-wrap bg-gray-800 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              active === tab.id
                ? 'text-white border-blue-500 bg-gray-900'
                : 'text-gray-400 hover:text-gray-200 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  const httpCode: Record<HttpTab, string> = {
    angular: s10HttpAngular,
    vue: s10HttpVue,
    msw: s10MswV2,
  }

  const storeCode: Record<StoreTab, string> = {
    ngrx: s10NgRxStore,
    pinia: s10PiniaStore,
    redux: s10ReduxToolkit,
    zustand: s10Zustand,
    tanstack: s10TanStackQuery,
  }

  const allQuizQuestions = [...s10Quiz, ...s10ExtraQuiz]

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s10"
        icon="🎯"
        title="Mocking Avanzado"
        description="Mocking de servicios HTTP, stores (NgRx/Pinia/Redux/Zustand/TanStack Query), router y patrones avanzados de aislamiento."
        sectionNumber={11}
      />

      <div className="prose-guide space-y-3">
        <p className="text-gray-400">
          En el taller anterior vimos <code className="text-emerald-400">vi.fn()</code> y{' '}
          <code className="text-emerald-400">vi.spyOn()</code> para mocking básico.
          Ahora vamos a aplicar mocking a las dependencias más comunes en apps reales:{' '}
          <strong className="text-white">servicios HTTP</strong>,{' '}
          <strong className="text-white">stores de estado</strong> (multi-stack) y{' '}
          <strong className="text-white">router</strong>.
        </p>
      </div>

      {/* Mapa visual: qué mockear */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Mapa de dependencias a mockear</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🌐', name: 'HTTP / API', desc: 'fetch, axios, HttpClient, MSW', color: 'border-blue-500/30 bg-blue-500/5' },
            { icon: '🗄️', name: 'Store / Estado', desc: 'NgRx, Pinia, Redux, Zustand', color: 'border-purple-500/30 bg-purple-500/5' },
            { icon: '🧭', name: 'Router', desc: 'Angular Router, Vue Router, React Router', color: 'border-green-500/30 bg-green-500/5' },
            { icon: '📦', name: 'Módulos', desc: 'vi.mock() con hoisting', color: 'border-yellow-500/30 bg-yellow-500/5' },
          ].map((item) => (
            <div key={item.name} className={`rounded-lg border p-3 text-center ${item.color}`}>
              <span className="text-2xl">{item.icon}</span>
              <p className="font-bold text-white text-sm mt-1">{item.name}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Hoisting */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. vi.mock() y el hoisting</h2>
        <p className="text-gray-400">
          <code className="text-emerald-400">vi.mock()</code> se mueve automáticamente al inicio del
          archivo mediante transformación AST. Esto significa que <strong className="text-white">no puede acceder a variables</strong> definidas
          en el scope del test. Es el error más común al empezar con mocking de módulos.
        </p>

        {/* Diagrama visual del hoisting */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase mb-3">Orden de ejecución real</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { step: '1', label: 'vi.mock()', color: 'bg-red-500', desc: 'Se hoistea primero' },
              { step: '2', label: 'imports', color: 'bg-yellow-500', desc: 'Se ejecutan después' },
              { step: '3', label: 'describe/it', color: 'bg-blue-500', desc: 'Código del test' },
              { step: '4', label: 'vi.fn() dentro', color: 'bg-green-500', desc: 'Variables del test' },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-600">→</span>}
                <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5">
                  <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center`}>
                    <span className="text-[10px] font-bold text-white">{item.step}</span>
                  </div>
                  <div>
                    <code className="text-xs text-white">{item.label}</code>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock code={s10HoistingProblem} language="ts" />
      </div>

      {/* 1.5 Ejercicio: Spot the hoisting bug */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Ejercicio · Spot the hoisting bug</h2>
        <p className="text-gray-400">
          Tres intentos distintos de mockear `./api` compartiendo un `fakeUser` con el test.{' '}
          <strong className="text-white">Solo uno funciona.</strong> Piénsalo antes de comprobar.
        </p>

        <div className="space-y-3">
          {s10HoistingBugOptions.map((opt) => {
            const isPicked = hoistingPick === opt.id
            const showRight = hoistingReveal && isPicked && opt.correct
            const showWrong = hoistingReveal && isPicked && !opt.correct
            return (
              <div
                key={opt.id}
                className={`rounded-lg border transition-colors ${
                  showRight
                    ? 'border-green-500/50 bg-green-500/5'
                    : showWrong
                      ? 'border-red-500/50 bg-red-500/5'
                      : isPicked
                        ? 'border-blue-500/50 bg-blue-500/5'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <button
                  onClick={() => {
                    setHoistingPick(opt.id)
                    setHoistingReveal(false)
                  }}
                  disabled={hoistingReveal}
                  className="w-full text-left px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                      isPicked ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {showRight ? '✓' : showWrong ? '✗' : '◯'}
                  </span>
                  <span className="text-sm text-gray-200">{opt.label}</span>
                </button>
                <div className="border-t border-gray-800">
                  <CodeBlock code={opt.code} language="ts" showLineNumbers={false} />
                </div>
                {hoistingReveal && isPicked && (
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
            onClick={() => setHoistingReveal(true)}
            disabled={!hoistingPick || hoistingReveal}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              hoistingPick && !hoistingReveal
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Comprobar respuesta
          </button>
          {hoistingReveal && (
            <button
              onClick={() => {
                setHoistingPick(null)
                setHoistingReveal(false)
              }}
              className="px-5 py-2.5 rounded-lg font-medium text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              Intentar de nuevo
            </button>
          )}
          {!hoistingPick && (
            <span className="self-center text-xs text-gray-500">Elige una opción para comprobar</span>
          )}
        </div>
      </div>

      {/* 3. HTTP Services — con MSW */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Mocking de servicios HTTP</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <TabBar
            tabs={[
              { id: 'angular' as HttpTab, label: 'Angular · HttpTestingController' },
              { id: 'vue' as HttpTab, label: 'Vue · vi.mock(axios)' },
              { id: 'msw' as HttpTab, label: 'MSW v2 · agnóstico (React/Vue/Angular)' },
            ]}
            active={httpTab}
            onChange={setHttpTab}
          />
          <CodeBlock code={httpCode[httpTab]} language="ts" />
        </div>

        <WhyBox variant="tip" title="¿Cuándo usar cada enfoque?">
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>HttpTestingController</strong> — Angular. Integrado en DI, verifica método/URL/body.
            </li>
            <li>
              <strong>vi.mock(axios / ky / fetch)</strong> — Simple, rápido, acoplado al cliente HTTP.
            </li>
            <li>
              <strong>MSW v2</strong> — <em>recomendado para React/Vue modernos</em>. Intercepta a nivel
              de red, funciona con cualquier cliente HTTP, mismos handlers en dev y tests.
            </li>
          </ul>
        </WhyBox>

        <WhyBox variant="warning" title="MSW v2: no olvidar el reset">
          <p>
            <code>server.resetHandlers()</code> en <code>afterEach</code> es obligatorio. Si un test hace
            un <code>server.use(...)</code> puntual, sin reset el override persiste al siguiente test y
            los fallos son totalmente contra-intuitivos.
          </p>
        </WhyBox>
      </div>

      {/* 4. Store Mocking — multi-stack */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Mocking de stores · multi-stack</h2>
        <p className="text-gray-400">
          Cinco pestañas para los stores más comunes. El patrón general es el mismo (aislar el componente
          del store real) pero cada ecosistema tiene su API específica.
        </p>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <TabBar
            tabs={[
              { id: 'ngrx' as StoreTab, label: 'NgRx (Angular)' },
              { id: 'pinia' as StoreTab, label: 'Pinia (Vue)' },
              { id: 'redux' as StoreTab, label: 'Redux Toolkit (React)' },
              { id: 'zustand' as StoreTab, label: 'Zustand (React)' },
              { id: 'tanstack' as StoreTab, label: 'TanStack Query (React)' },
            ]}
            active={storeTab}
            onChange={setStoreTab}
          />
          <CodeBlock code={storeCode[storeTab]} language="ts" />
        </div>

        {storeTab === 'pinia' && (
          <>
            <WhyBox variant="warning" title="⚠ Gotcha Pinia + Vitest: `createSpy: vi.fn` obligatorio" defaultOpen>
              <p>
                Este error sale silencioso. Sin <code>createSpy: vi.fn</code>, el test casca con{' '}
                <code>ReferenceError: jest is not defined</code>. Es uno de los clásicos del stack.
              </p>
            </WhyBox>
            <CodeBlock code={s10PiniaGotcha} language="ts" />
          </>
        )}

        {storeTab === 'tanstack' && (
          <WhyBox variant="warning" title="TanStack Query: `retry: false` es crítico en tests">
            <p>
              Por defecto, TanStack Query reintenta 3 veces con backoff exponencial. Un test de error
              puede tardar varios segundos sin que veas nada en la consola. Siempre configurar{' '}
              <code>defaultOptions: &#123; queries: &#123; retry: false &#125; &#125;</code> en el{' '}
              <code>QueryClient</code> de test.
            </p>
          </WhyBox>
        )}
      </div>

      {/* 5. Router Mocking */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. Mocking de router</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <TabBar
            tabs={[
              { id: 'angular' as RouterTab, label: 'Angular Router' },
              { id: 'vue' as RouterTab, label: 'Vue Router' },
            ]}
            active={routerTab}
            onChange={setRouterTab}
          />
          <CodeBlock
            code={routerTab === 'angular' ? s10RouterAngular : s10RouterVue}
            language="ts"
          />
        </div>
      </div>

      {/* 6. Ejercicio matching: qué mockear con qué API */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">6. Ejercicio · Elige la API correcta</h2>
        <p className="text-gray-400">
          Ocho escenarios reales. Empareja cada uno con la API de mocking más adecuada. Después del
          check verás en qué casos la solución más elegante depende del stack.
        </p>
        <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-5">
          <DragAndDropMatch
            title="Empareja escenario con la API de mocking"
            promptHeader="Situación real"
            answerHeader="Cómo mockearlo"
            promptLanguage="text"
            answerLanguage="text"
            pairs={s10WhatToMockPairs}
          />
        </div>
      </div>

      {/* 7. Anti-patrones */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Anti-patrones de mocking</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-red-400 font-semibold mb-2">Over-mocking</p>
            <CodeBlock code={s10AntiOverMocking} language="ts" showLineNumbers={false} />
          </div>
          <div>
            <p className="text-sm text-red-400 font-semibold mb-2">No restaurar mocks</p>
            <CodeBlock code={s10AntiNoRestore} language="ts" showLineNumbers={false} />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mt-4">Clear vs Reset vs Restore</h3>
        <CodeBlock code={s10ClearResetRestore} language="ts" />
      </div>

      <SimulatedTestOutput lines={s10SimulatedOutput} title="vitest run s10-mocking-avanzado/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz
          questions={allQuizQuestions}
          sectionId="s10"
          onComplete={(score, total) => {
            if (score / total >= 0.7) markComplete('s10')
          }}
        />
      </div>
    </div>
  )
}
