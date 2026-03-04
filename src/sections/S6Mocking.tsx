import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import ComponentTestTabs from '../components/shared/ComponentTestTabs'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s6FetchDataCode,
  s6FetchDataTestCode,
  s6StubsSpiesCode,
  s6HandlersCode,
  s6StubExample,
  s6SpyExample,
  s6MockExample,
  s6MSWExample,
  s6Quiz,
  s6SimulatedOutput,
} from '../data/s6-mocking.data'

type MockTab = 'stub' | 'spy' | 'mock' | 'msw'

export default function S6Mocking() {
  const { markComplete } = useProgress()
  const [activeTab, setActiveTab] = useState<MockTab>('stub')

  const tabs: { id: MockTab; label: string; description: string }[] = [
    { id: 'stub', label: 'Stub', description: 'Valor fijo de retorno' },
    { id: 'spy', label: 'Spy', description: 'Observa llamadas' },
    { id: 'mock', label: 'Mock de módulo', description: 'Reemplaza módulo entero' },
    { id: 'msw', label: 'MSW', description: 'Mock de APIs' },
  ]

  const tabCode: Record<MockTab, string> = {
    stub: s6StubExample,
    spy: s6SpyExample,
    mock: s6MockExample,
    msw: s6MSWExample,
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s6"
        icon="🎭"
        title="Mocking: Stubs, Spies y MSW"
        description="Controla dependencias externas en tus tests con dobles de prueba y mock de APIs."
        sectionNumber={7}
      />

      <div className="prose-guide space-y-2">
        <p>
          Los <strong>dobles de prueba</strong> reemplazan dependencias reales (APIs, servicios, bases de datos)
          por versiones controladas. Hacen los tests <strong>predecibles, rápidos y aislados</strong>.
        </p>
      </div>

      {/* Mock concepts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Tipos de dobles de prueba</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              type: 'Stub',
              icon: '📌',
              color: 'border-blue-500/30 bg-blue-500/5',
              desc: 'Devuelve un valor fijo. No tiene expectativas sobre cómo se llama.',
              api: 'vi.fn().mockReturnValue()',
              use: 'Cuando necesitas un valor controlado de retorno.',
            },
            {
              type: 'Spy',
              icon: '👁️',
              color: 'border-yellow-500/30 bg-yellow-500/5',
              desc: 'Observa las llamadas sin reemplazar la implementación real (o reemplazándola opcionalmente).',
              api: 'vi.spyOn(obj, "method")',
              use: 'Cuando quieres verificar que una función fue llamada con ciertos argumentos.',
            },
            {
              type: 'Mock',
              icon: '🎭',
              color: 'border-purple-500/30 bg-purple-500/5',
              desc: 'Reemplaza completamente un módulo con versiones controladas de todas sus funciones.',
              api: 'vi.mock("./modulo")',
              use: 'Para reemplazar dependencias completas (servicios, SDKs, etc.).',
            },
          ].map((item) => (
            <div key={item.type} className={`rounded-lg border p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-white">{item.type}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
              <code className="text-xs text-emerald-400 block mb-1">{item.api}</code>
              <p className="text-xs text-gray-500">{item.use}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex flex-wrap bg-gray-800 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CodeBlock code={tabCode[activeTab]} language="ts" showLineNumbers={false} />
        </div>
      </div>

      {/* mockReset vs mockRestore */}
      <WhyBox variant="warning" title="Cambio en Vitest 3+: mockReset() ahora restaura la implementación original">
        <p>
          En versiones anteriores, <code className="text-yellow-400">mockReset()</code> reemplazaba el mock con una función vacía (noop).
          <strong> Desde Vitest 3</strong>, <code className="text-yellow-400">mockReset()</code> restaura la implementación original,
          igual que <code className="text-yellow-400">mockRestore()</code>.
        </p>
        <p className="mt-2">
          La mejor práctica es usar <code className="text-yellow-400">vi.restoreAllMocks()</code> en el{' '}
          <code className="text-yellow-400">afterEach</code> para garantizar que cada test empiece con el estado limpio.
        </p>
      </WhyBox>

      {/* MSW */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. MSW — Mock Service Worker</h2>
        <p className="text-gray-400">
          MSW intercepta las peticiones HTTP a nivel de red, sin modificar el código de producción.
          Es la forma más realista de mockear APIs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">handlers.ts — Definición de respuestas</p>
            <CodeBlock code={s6HandlersCode} language="ts" filename="tests/s6-mocking/handlers.ts" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Ciclo de vida del servidor MSW</p>
            <CodeBlock
              code={`// En cada archivo de test que use el servidor
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers()) // Limpia overrides
afterAll(() => server.close())

// Override por test — simula error 500
server.use(
  http.get('/api/users', () =>
    new HttpResponse(null, { status: 500 })
  )
)`}
              language="ts"
              showLineNumbers={false}
            />
          </div>
        </div>

        <WhyBox variant="why" title="¿Por qué MSW es mejor que mockear fetch directamente?">
          <ul className="space-y-2 list-disc list-inside">
            <li>Tu código de producción usa <code className="text-yellow-400">fetch</code> normalmente.</li>
            <li>MSW intercepta a nivel de red, sin cambiar ninguna implementación.</li>
            <li>Puedes reusar los mismos handlers en tests y en desarrollo (HMR).</li>
            <li>Override por test con <code className="text-yellow-400">server.use()</code>: cada test puede tener su propio escenario.</li>
          </ul>
        </WhyBox>
      </div>

      {/* FetchData example */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Ejemplo: FetchData con MSW</h2>

        <ComponentTestTabs
          componentCode={s6FetchDataCode}
          testCode={s6FetchDataTestCode}
          componentFilename="tests/examples/FetchData.tsx"
          testFilename="tests/s6-mocking/FetchData.test.tsx"
        />
      </div>

      {/* stubs/spies full test */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Tests de stubs y spies completos</h2>
        <CodeBlock
          code={s6StubsSpiesCode}
          language="ts"
          filename="tests/s6-mocking/stubs-spies.test.ts"
        />
      </div>

      <SimulatedTestOutput lines={s6SimulatedOutput} title="vitest run s6-mocking/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s6Quiz} sectionId="s6" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s6')
        }} />
      </div>
    </div>
  )
}
