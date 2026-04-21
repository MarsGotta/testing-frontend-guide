import SectionHeader from '../components/shared/SectionHeader'
import CodeBlock from '../components/shared/CodeBlock'
import WhyBox from '../components/shared/WhyBox'
import Quiz from '../components/shared/Quiz'
import PracticeMore from '../components/shared/PracticeMore'
import { useProgress } from '../context/ProgressContext'
import {
  s13AAAReminder,
  s13UserEventReminder,
  s13MocksReminder,
  s13FourLevers,
  s13RunnerComparison,
  s13Quiz,
} from '../data/s13-warmup.data'

export default function S13WarmUp() {
  const { markComplete } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s13"
        icon="🗺️"
        title="Bienvenida al Taller Avanzado"
        description="Lo que vas a aprender, un recordatorio rápido del Taller 1 y un primer vistazo a por qué Vitest."
        sectionNumber={10}
      />

      <div className="prose-guide space-y-3">
        <p className="text-gray-400">
          En el Taller 1 aprendiste a escribir tests: anatomía AAA, queries semánticas,
          interacciones de usuario, mocking básico. Ya sabes lo esencial.
        </p>
        <p className="text-gray-400">
          En el Taller 2 entramos en los <strong className="text-white">casos que aparecen en producción</strong>:
          tests que fallan intermitentemente, componentes con servicios que hay que aislar,
          código legacy en Karma que hay que migrar, y cómo medir si tus tests realmente cazan bugs.
        </p>
      </div>

      {/* 1. Mapa del taller · las 4 palancas */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. El mapa · 4 palancas, 1 hora</h2>
        <p className="text-gray-400">
          La sesión se estructura en cuatro bloques. Cada uno resuelve un dolor concreto del
          testing frontend moderno.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {s13FourLevers.map((lever) => (
            <div
              key={lever.id}
              className={`rounded-lg border p-5 ${lever.color}`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900/80 border border-gray-700 flex items-center justify-center text-xl">
                  {lever.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-gray-500">
                      Palanca {lever.number}
                    </span>
                  </div>
                  <p className="font-bold text-white text-base">{lever.title}</p>
                  <p className="text-xs text-gray-400 italic">{lever.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mt-2">
                {lever.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recordatorio del Taller 1 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Lo que traes del Taller 1</h2>
        <p className="text-gray-400">
          Antes de entrar en temas avanzados, tres recordatorios breves de lo fundamental.
          Todo el Taller 2 los asume.
        </p>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              El patrón AAA (Arrange · Act · Assert)
            </h3>
            <CodeBlock code={s13AAAReminder} language="tsx" showLineNumbers={false} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              userEvent 14 · setup() + await
            </h3>
            <CodeBlock code={s13UserEventReminder} language="tsx" showLineNumbers={false} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              vi.fn() y vi.spyOn() · los dos tipos de espía
            </h3>
            <CodeBlock code={s13MocksReminder} language="ts" showLineNumbers={false} />
          </div>
        </div>

        <WhyBox variant="tip" title="Si alguno de estos tres no te suena">
          <p>
            Repasa las secciones <strong>1, 5 y 6</strong> del Taller 1. El resto del taller
            asumirá que el patrón AAA, el uso de <code>userEvent.setup()</code> con
            <code>await</code>, y la diferencia entre <code>vi.fn()</code> y
            <code>vi.spyOn()</code> son automáticos para ti.
          </p>
        </WhyBox>
      </div>

      {/* 3. Primer vistazo · Vitest vs Karma */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Por qué Vitest · primer vistazo</h2>
        <p className="text-gray-400">
          Karma/Jasmine fue el estándar durante más de una década. Vitest es el runner
          moderno que lo ha sustituido en Angular 21, y que Vue 3 + React Vite usan por
          defecto. Lo veremos en detalle más adelante, pero esta tabla resume la diferencia
          en seis líneas.
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300 font-semibold">Aspecto</th>
                <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                  Karma · legacy
                </th>
                <th className="text-left px-4 py-3 text-emerald-400 font-semibold">
                  Vitest · moderno
                </th>
              </tr>
            </thead>
            <tbody>
              {s13RunnerComparison.map((row, idx) => (
                <tr
                  key={row.metric}
                  className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}
                >
                  <td className="px-4 py-2.5 text-gray-300 text-xs font-medium">
                    {row.metric}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <code
                      className={
                        row.winner === 'vitest' ? 'text-yellow-300' : 'text-gray-400'
                      }
                    >
                      {row.karma}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <code
                      className={
                        row.winner === 'vitest' ? 'text-emerald-300' : 'text-gray-400'
                      }
                    >
                      {row.vitest}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WhyBox variant="info" title="No es solo velocidad">
          <p>
            8 segundos vs 2 segundos no cambia tu vida. Lo que cambia es que el arranque del
            navegador te saca del flow. Con Vitest el watch mode responde en menos de 100 ms
            tras guardar un archivo: sigues programando, el test se ejecuta solo en segundo
            plano.
          </p>
          <p className="mt-2">
            Y hay cosas que en Karma <strong>directamente no puedes hacer</strong>: mockear un
            módulo con <code className="text-yellow-400">vi.mock</code>, o drenar microtasks
            tras un fake timer con una sola línea. Eso es lo que vamos a ver en los siguientes
            bloques.
          </p>
        </WhyBox>
      </div>

      {/* CTA hacia el repo */}
      <PracticeMore
        title="El proyecto que acompaña el taller"
        intro="Todo lo que veas en las próximas secciones está implementado en un repo React 18 + Vite que mantiene dos suites de tests en paralelo — Karma legacy y Vitest moderna, espejadas 1:1. Úsalo como referencia: cuando tengas un caso en tu proyecto, busca su gemelo aquí."
        repoFiles={[
          {
            path: 'taller-testing-frontend-avanzado/',
            description: 'App de El Tiempo · 237 tests Karma + 240 tests Vitest + 2 Strykers',
          },
          {
            path: 'package.json',
            description: 'Scripts: test:run · test:karma · test:mutation:vitest · test:mutation:karma',
          },
        ]}
        materialReference="material/00-temario.md · índice completo del taller"
      />

      <div className="border-t border-gray-800 pt-8">
        <Quiz
          questions={s13Quiz}
          sectionId="s13"
          onComplete={(score, total) => {
            if (score / total >= 0.7) markComplete('s13')
          }}
        />
      </div>
    </div>
  )
}
