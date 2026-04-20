import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import DragAndDropMatch from '../components/shared/DragAndDropMatch'
import { useProgress } from '../context/ProgressContext'
import {
  s9AngularConfigBefore,
  s9AngularConfigAfter,
  s9AnalogConfig,
  s9VueConfig,
  s9SpiesJasmine,
  s9SpiesVitest,
  s9MatchersJasmine,
  s9MatchersVitest,
  s9TimersJasmine,
  s9TimersVitest,
  s9CleanupScript,
  s9CreateSpyObjHelper,
  s9ScenarioAB,
  s9FullEquivalenceTable,
  s9TranslatorPairs,
  s9Quiz,
  s9TranslatorQuiz,
  s9SimulatedOutput,
} from '../data/s9-migracion.data'

type EquivFilter = 'all' | 'Spies' | 'Matchers' | 'Timers' | 'Lifecycle' | 'Async'

type ConfigTab = 'angular21' | 'angular17' | 'vue'
type SyntaxTab = 'spies' | 'matchers' | 'timers'

// Diagrama visual: Timeline de soporte de Karma
function KarmaTimeline() {
  const events = [
    { year: '2012', label: 'Karma nace', color: 'bg-green-500', desc: 'Creado por el equipo de Angular' },
    { year: '2023', label: 'Deprecado', color: 'bg-red-500', desc: 'Solo parches de seguridad' },
    { year: '2024', label: 'Angular 17-19', color: 'bg-yellow-500', desc: 'Vitest via AnalogJS' },
    { year: '2025', label: 'Angular 21', color: 'bg-blue-500', desc: 'Vitest es el default' },
  ]

  return (
    <div className="relative py-6">
      {/* Línea horizontal */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2" />
      <div className="flex justify-between relative">
        {events.map((ev) => (
          <div key={ev.year} className="flex flex-col items-center gap-2 relative">
            <div className={`w-4 h-4 rounded-full ${ev.color} ring-4 ring-gray-900 z-10`} />
            <div className="text-center">
              <div className="text-sm font-bold text-white">{ev.year}</div>
              <div className="text-xs font-medium text-gray-300">{ev.label}</div>
              <div className="text-xs text-gray-500 max-w-[120px]">{ev.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Diagrama visual: Barras de rendimiento comparativas
function PerformanceBars() {
  const metrics = [
    {
      label: 'Arranque en frío',
      bars: [
        { name: 'Karma', value: 100, time: '30s+', color: 'bg-red-500' },
        { name: 'Jest', value: 70, time: '~8s', color: 'bg-yellow-500' },
        { name: 'Vitest', value: 3, time: '<100ms', color: 'bg-green-500' },
      ],
    },
    {
      label: 'Re-ejecución (watch)',
      bars: [
        { name: 'Karma', value: 100, time: 'suite completa', color: 'bg-red-500' },
        { name: 'Jest', value: 56, time: '~8.4s', color: 'bg-yellow-500' },
        { name: 'Vitest', value: 2, time: '~0.3s', color: 'bg-green-500' },
      ],
    },
    {
      label: 'Uso de memoria',
      bars: [
        { name: 'Karma', value: 100, time: 'Alto (browser)', color: 'bg-red-500' },
        { name: 'Jest', value: 70, time: 'Medio', color: 'bg-yellow-500' },
        { name: 'Vitest', value: 49, time: '~30% menos', color: 'bg-green-500' },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="text-sm font-medium text-gray-300 mb-2">{metric.label}</p>
          <div className="space-y-1.5">
            {metric.bars.map((bar) => (
              <div key={bar.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-14 text-right shrink-0">{bar.name}</span>
                <div className="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(bar.value, 8)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{bar.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function S9Migracion() {
  const { markComplete } = useProgress()
  const [configTab, setConfigTab] = useState<ConfigTab>('angular21')
  const [syntaxTab, setSyntaxTab] = useState<SyntaxTab>('spies')
  const [equivFilter, setEquivFilter] = useState<EquivFilter>('all')

  const filteredEquivRows = equivFilter === 'all'
    ? s9FullEquivalenceTable
    : s9FullEquivalenceTable.filter((r) => r.category === equivFilter)

  const equivFilters: EquivFilter[] = ['all', 'Spies', 'Matchers', 'Timers', 'Lifecycle', 'Async']

  const allQuizQuestions = [...s9Quiz, ...s9TranslatorQuiz]

  const configTabs: { id: ConfigTab; label: string }[] = [
    { id: 'angular21', label: 'Angular 21+' },
    { id: 'angular17', label: 'Angular 17-20' },
    { id: 'vue', label: 'Vue 3' },
  ]

  const syntaxTabs: { id: SyntaxTab; label: string }[] = [
    { id: 'spies', label: 'Spies / Mocks' },
    { id: 'matchers', label: 'Matchers' },
    { id: 'timers', label: 'Timers' },
  ]

  const syntaxLeft: Record<SyntaxTab, string> = {
    spies: s9SpiesJasmine,
    matchers: s9MatchersJasmine,
    timers: s9TimersJasmine,
  }

  const syntaxRight: Record<SyntaxTab, string> = {
    spies: s9SpiesVitest,
    matchers: s9MatchersVitest,
    timers: s9TimersVitest,
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s9"
        icon="🚀"
        title="Migración Karma/Jasmine a Vitest"
        description="Por qué migrar, configuración paso a paso y equivalencias de sintaxis para Angular y Vue."
        sectionNumber={10}
      />

      <div className="prose-guide space-y-3">
        <p className="text-gray-400">
          Karma fue el estándar de testing en Angular durante más de 10 años.
          Pero el ecosistema ha cambiado: <strong className="text-white">Karma fue deprecado en 2023</strong> y
          Angular 21 adoptó <strong className="text-white">Vitest como runner por defecto</strong>.
          Esta sección te guía paso a paso en la migración.
        </p>
      </div>

      {/* 1. Por qué migrar */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Por qué migrar de Karma/Jasmine</h2>

        <h3 className="text-base font-semibold text-gray-300">Timeline de Karma</h3>
        <KarmaTimeline />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '⚰️',
              title: 'Karma deprecado',
              color: 'border-red-500/30 bg-red-500/5',
              desc: 'Deprecado en abril 2023. Solo parches de seguridad críticos. No más features ni bug fixes.',
            },
            {
              icon: '⚡',
              title: '10x más rápido',
              color: 'border-green-500/30 bg-green-500/5',
              desc: 'Vitest arranca en <100ms vs 30s+ de Karma. Watch mode re-ejecuta en 0.3s vs la suite completa.',
            },
            {
              icon: '🔗',
              title: 'Alineado con Vite',
              color: 'border-blue-500/30 bg-blue-500/5',
              desc: 'Comparte config con tu app. ESM nativo. Angular 21+ y Vue 3 usan Vite por defecto.',
            },
          ].map((item) => (
            <div key={item.title} className={`rounded-lg border p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-white">{item.title}</span>
              </div>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-base font-semibold text-gray-300 pt-2">Comparativa de rendimiento</h3>
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-5">
          <PerformanceBars />
        </div>

        <WhyBox variant="why" title="¿Por qué no Jest como reemplazo?">
          <p>
            Jest fue la primera alternativa considerada por el equipo de Angular, pero <strong>Vitest ganó</strong> porque:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Reutiliza la misma config de Vite (sin duplicar configuración)</li>
            <li>ESM nativo sin flags experimentales</li>
            <li>Watch mode inteligente basado en el grafo de importaciones (como HMR)</li>
            <li>API 100% compatible con Jest (migración trivial si ya usas Jest)</li>
          </ul>
        </WhyBox>
      </div>

      {/* Tabla de decisión */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. ¿Qué camino seguir?</h2>
        <p className="text-gray-400">
          El camino depende de tu versión de Angular (o si usas Vue).
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300">Escenario</th>
                <th className="text-left px-4 py-3 text-gray-300">Camino</th>
                <th className="text-left px-4 py-3 text-gray-300">Dificultad</th>
              </tr>
            </thead>
            <tbody>
              {[
                { scenario: 'Angular 21+ (nuevo proyecto)', path: 'Vitest por defecto, no hay que migrar', difficulty: 'Ninguna', color: 'text-green-400' },
                { scenario: 'Angular 21+ (proyecto existente)', path: 'Schematic automático + ajustes manuales', difficulty: 'Baja', color: 'text-green-400' },
                { scenario: 'Angular 17-20', path: '@analogjs/vitest-angular', difficulty: 'Media', color: 'text-yellow-400' },
                { scenario: 'Angular < 17', path: 'Primero actualizar Angular, luego migrar', difficulty: 'Alta', color: 'text-red-400' },
                { scenario: 'Vue 3 + Vite', path: 'Vitest directo (natural)', difficulty: 'Baja', color: 'text-green-400' },
                { scenario: 'Muchos fakeAsync/tick', path: 'Requiere refactoring manual de async', difficulty: 'Media-Alta', color: 'text-yellow-400' },
              ].map((row, idx) => (
                <tr key={row.scenario} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                  <td className="px-4 py-3 text-gray-300">{row.scenario}</td>
                  <td className="px-4 py-3 text-gray-400">{row.path}</td>
                  <td className={`px-4 py-3 font-medium ${row.color}`}>{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Configuración por framework */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Configuración paso a paso</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {configTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setConfigTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  configTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {configTab === 'angular21' && (
              <>
                <WhyBox variant="info" title="Angular 21+: Soporte oficial">
                  <p>
                    Vitest es el runner por defecto en <code className="text-yellow-400">ng new</code>.
                    La migración usa un schematic automático que convierte la mayoría de sintaxis.
                  </p>
                </WhyBox>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Antes (Karma)</p>
                    <CodeBlock code={s9AngularConfigBefore} language="json" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Después (Vitest)</p>
                    <CodeBlock code={s9AngularConfigAfter} language="ts" />
                  </div>
                </div>
              </>
            )}
            {configTab === 'angular17' && (
              <>
                <WhyBox variant="info" title="Angular 17-20: Via AnalogJS">
                  <p>
                    Para versiones anteriores a Angular 21, se usa{' '}
                    <code className="text-yellow-400">@analogjs/vitest-angular</code> como puente.
                    Compatible con Angular 17 hasta 20.
                  </p>
                </WhyBox>
                <CodeBlock code={s9AnalogConfig} language="ts" filename="vite.config.ts + test-setup.ts" />
              </>
            )}
            {configTab === 'vue' && (
              <>
                <WhyBox variant="info" title="Vue 3: El camino más directo">
                  <p>
                    Vue 3 usa Vite por defecto, así que Vitest es la elección natural.
                    Usa <code className="text-yellow-400">happy-dom</code> para máxima velocidad.
                  </p>
                </WhyBox>
                <CodeBlock code={s9VueConfig} language="ts" filename="vite.config.ts" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Equivalencias de sintaxis */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Equivalencias de sintaxis</h2>
        <p className="text-gray-400">
          Selecciona la categoría para ver la comparativa Jasmine → Vitest lado a lado.
        </p>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {syntaxTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSyntaxTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  syntaxTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-gray-700">
            <div>
              <p className="text-xs text-red-400 font-semibold px-4 py-2 bg-red-500/5 border-b border-gray-700">
                JASMINE (antes)
              </p>
              <CodeBlock code={syntaxLeft[syntaxTab]} language="ts" showLineNumbers={false} />
            </div>
            <div>
              <p className="text-xs text-green-400 font-semibold px-4 py-2 bg-green-500/5 border-b border-gray-700">
                VITEST (después)
              </p>
              <CodeBlock code={syntaxRight[syntaxTab]} language="ts" showLineNumbers={false} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabla exhaustiva de equivalencias */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Tabla exhaustiva Jasmine ↔ Vitest</h2>
        <p className="text-gray-400">
          La referencia completa. Filtra por categoría y úsala como chuleta durante la migración.
        </p>

        <div className="flex flex-wrap gap-2">
          {equivFilters.map((f) => (
            <button
              key={f}
              onClick={() => setEquivFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                equivFilter === f
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
              }`}
            >
              {f === 'all' ? 'Todas' : f} {equivFilter === f && `(${filteredEquivRows.length})`}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-3 py-2.5 text-gray-400 text-xs uppercase tracking-wider">Cat.</th>
                <th className="text-left px-3 py-2.5 text-red-400 text-xs uppercase tracking-wider">Jasmine</th>
                <th className="text-left px-3 py-2.5 text-green-400 text-xs uppercase tracking-wider">Vitest</th>
                <th className="text-left px-3 py-2.5 text-gray-400 text-xs uppercase tracking-wider">Nota</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquivRows.map((row, idx) => (
                <tr key={`${row.jasmine}-${idx}`} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                  <td className="px-3 py-2 text-xs">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] uppercase tracking-wider">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <code className="text-red-300 text-xs whitespace-pre-wrap">{row.jasmine}</code>
                  </td>
                  <td className="px-3 py-2">
                    <code className="text-green-300 text-xs whitespace-pre-wrap">{row.vitest}</code>
                  </td>
                  <td className="px-3 py-2 text-gray-500 text-xs">{row.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Helper createSpyObj */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. Helper reutilizable para `createSpyObj`</h2>
        <p className="text-gray-400">
          Este es el patrón que el schematic <strong>no migra</strong> y que más aparece en proyectos
          Angular maduros. Un helper tipado lo resuelve para toda la suite.
        </p>
        <CodeBlock code={s9CreateSpyObjHelper} language="ts" filename="src/testing/create-spy-obj.ts" />
      </div>

      {/* 6. Escenario A vs B */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">6. Zone.js vs zoneless — Escenario A vs B</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🅰️</span>
              <p className="font-bold text-blue-300 text-sm">Escenario A — Zone.js testing cargado</p>
            </div>
            <p className="text-xs text-gray-300 mb-2">
              Tu <code>test-setup.ts</code> importa <code>zone.js/testing</code>.
              <strong> `fakeAsync`, `tick`, `flush` siguen funcionando</strong> en Vitest porque vienen de
              <code> @angular/core/testing</code>, no de Jasmine.
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-green-400 font-semibold">No hay que migrar esos tests.</span>{' '}
              Es el caso mayoritario en Angular 17-20.
            </p>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🅱️</span>
              <p className="font-bold text-purple-300 text-sm">Escenario B — Zoneless (Angular 18+)</p>
            </div>
            <p className="text-xs text-gray-300 mb-2">
              Sin <code>zone.js</code> en el setup. <strong>`fakeAsync` no existe.</strong>{' '}
              Se sustituye por <code>vi.useFakeTimers()</code> + <code>await TestBed.tick()</code>{' '}
              para drenar effects y signals.
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-yellow-400 font-semibold">Dirección a futuro</span>, pero ir a
              zoneless es un ejercicio separado — no lo mezcles con la migración del runner.
            </p>
          </div>
        </div>

        <CodeBlock code={s9ScenarioAB} language="ts" />
      </div>

      {/* 7. Ejercicio traductor */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Ejercicio · Traductor Jasmine → Vitest</h2>
        <p className="text-gray-400">
          Empareja cada fragmento de Jasmine con su traducción Vitest correcta. Son los ocho patrones
          que más aparecen en un repo Angular de tamaño medio.
        </p>
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-5">
          <DragAndDropMatch
            title="Traduce de Jasmine a Vitest"
            promptHeader="Jasmine"
            answerHeader="Vitest"
            pairs={s9TranslatorPairs}
          />
        </div>
      </div>

      {/* 8. Desafíos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">8. ¿Qué se migra automáticamente y qué no?</h2>
        <p className="text-gray-400">
          El schematic de Angular convierte muchos patrones automáticamente, pero algunos requieren
          intervención manual. Aquí está el mapa completo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="font-bold text-green-400 mb-3 flex items-center gap-2">
              <span>Migración automática</span>
            </p>
            <ul className="space-y-2">
              {[
                'spyOn(obj, "m") → vi.spyOn(obj, "m")',
                'fdescribe / fit → describe.only / it.only',
                'xdescribe / xit → describe.skip / it.skip',
                'jasmine.objectContaining → expect.objectContaining',
                'jasmine.any() → expect.any()',
                'jasmine.arrayContaining → expect.arrayContaining',
                'Spy .and.returnValue → .mockReturnValue',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                  <code className="text-xs">{item}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-bold text-red-400 mb-3 flex items-center gap-2">
              <span>Migración manual</span>
            </p>
            <ul className="space-y-2">
              {[
                'jasmine.createSpyObj() → objeto con vi.fn()',
                'fakeAsync() / tick() → vi.useFakeTimers()',
                'flush() → vi.runAllTimers()',
                'waitForAsync() → async/await',
                'jasmine.clock() → vi.useFakeTimers()',
                'Spies anidados complejos',
                'Custom matchers (jasmine.addMatchers)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-red-500 mt-0.5 shrink-0">&#10007;</span>
                  <code className="text-xs">{item}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <WhyBox variant="warning" title="Zone.js: El mayor reto en Angular">
          <p>
            Los patches de Zone.js <strong>no se aplican</strong> en Vitest.{' '}
            <code className="text-yellow-400">fakeAsync()</code>,{' '}
            <code className="text-yellow-400">tick()</code>,{' '}
            <code className="text-yellow-400">flush()</code> y{' '}
            <code className="text-yellow-400">waitForAsync()</code>{' '}
            <strong>no funcionan</strong>. Deben migrarse manualmente a{' '}
            <code className="text-yellow-400">vi.useFakeTimers()</code> y{' '}
            <code className="text-yellow-400">vi.advanceTimersByTime()</code>.
          </p>
          <p className="mt-2">
            Angular 21+ usa <strong>zoneless por defecto</strong>, eliminando esta dependencia.
            Veremos esto en detalle en la sección de Asincronía.
          </p>
        </WhyBox>

        <WhyBox variant="tip" title="Lo que SÍ funciona igual en Vitest">
          <p className="mb-2">Estas APIs de Angular vienen de <code className="text-yellow-400">@angular/core/testing</code> y son agnósticas del runner:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { api: 'TestBed', status: 'Idéntico' },
              { api: 'ComponentFixture', status: 'Idéntico' },
              { api: 'HttpTestingController', status: 'Sin cambios' },
              { api: 'fixture.detectChanges()', status: 'Igual' },
              { api: 'fixture.whenStable()', status: 'Igual' },
              { api: 'La mayoría de matchers', status: 'Equivalente directo' },
            ].map((item) => (
              <div key={item.api} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">&#10003;</span>
                <code className="text-yellow-400 text-xs">{item.api}</code>
                <span className="text-gray-500 text-xs">— {item.status}</span>
              </div>
            ))}
          </div>
        </WhyBox>
      </div>

      {/* 6. Cleanup y checklist */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">6. Limpieza y checklist</h2>
        <CodeBlock code={s9CleanupScript} language="bash" />

        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-5">
          <p className="font-bold text-blue-300 mb-3">Checklist de migración</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pre-migración</p>
              <ul className="space-y-1.5">
                {['Verificar versión de Angular', 'Commit/backup de tests actuales', 'Listar tests con fakeAsync'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-4 h-4 rounded border border-gray-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Migración</p>
              <ul className="space-y-1.5">
                {['Instalar dependencias Vitest', 'Actualizar angular.json/vite.config', 'Ejecutar schematic automático', 'Migrar fakeAsync manualmente', 'Migrar createSpyObj'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-4 h-4 rounded border border-gray-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Post-migración</p>
              <ul className="space-y-1.5">
                {['Eliminar karma.conf.js', 'Desinstalar paquetes Karma', 'Verificar todos los tests', 'Actualizar CI/CD pipeline'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-4 h-4 rounded border border-gray-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SimulatedTestOutput lines={s9SimulatedOutput} title="Schematic de migración automática" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz
          questions={allQuizQuestions}
          sectionId="s9"
          onComplete={(score, total) => {
            if (score / total >= 0.7) markComplete('s9')
          }}
        />
      </div>
    </div>
  )
}
