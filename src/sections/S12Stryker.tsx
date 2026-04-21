import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import DragAndDropMatch from '../components/shared/DragAndDropMatch'
import PracticeMore from '../components/shared/PracticeMore'
import { useProgress } from '../context/ProgressContext'
import {
  s12CoverageLie,
  s12MutationTypes,
  s12ConfigVitest,
  s12ConfigAngular,
  s12ConfigVue,
  s12Optimization,
  s12PerTestConfig,
  s12SurvivedExample,
  s12DisableMutants,
  s12CIPipeline,
  s12Quiz,
  s12RoadmapQuiz,
  s12RoadmapPhases,
  s12GalleryMutants,
  s12MutantMatchPairs,
  s12MutantStatusPairs,
  s12SimulatedOutput,
} from '../data/s12-stryker.data'

type ConfigTab = 'vitest' | 'angular' | 'vue'

export default function S12Stryker() {
  const { markComplete } = useProgress()
  const [configTab, setConfigTab] = useState<ConfigTab>('vitest')
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [galleryView, setGalleryView] = useState<'survives' | 'kills'>('survives')

  const configCode: Record<ConfigTab, string> = {
    vitest: s12ConfigVitest,
    angular: s12ConfigAngular,
    vue: s12ConfigVue,
  }

  const currentMutant = s12GalleryMutants[galleryIdx]

  const allQuizQuestions = [...s12Quiz, ...s12RoadmapQuiz]

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s12"
        icon="🧬"
        title="Mutation Testing con Stryker"
        description="No pruebes que funciona — intenta romperlo. Mutation testing para blindar tu código."
        sectionNumber={14}
      />

      <div className="prose-guide">
        <p className="text-gray-400">
          El mutation testing cambia el enfoque: en vez de probar que tu código funciona,{' '}
          <strong>intenta romperlo</strong> para verificar que tus tests realmente detectan errores.
        </p>
      </div>

      {/* 1. Por qué el coverage miente */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Por qué el coverage miente</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📊</span>
              <p className="font-bold text-white">Code Coverage</p>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Mide si el código fue <strong>ejecutado</strong>. No verifica si las assertions son
              correctas. Puedes tener 100% con tests que no verifican nada.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Statements</span>
                <span className="text-green-400 font-bold">100%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-yellow-400 italic">
                Parece perfecto... pero el test no verifica nada
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧬</span>
              <p className="font-bold text-white">Mutation Score</p>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Mide si los tests <strong>detectan cambios</strong> en el código.
              Si un cambio pasa desapercibido, el test es débil.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Mutantes detectados</span>
                <span className="text-red-400 font-bold">0%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-red-400 italic">
                La verdad: tus tests no detectan errores
              </p>
            </div>
          </div>
        </div>

        <WhyBox variant="why" title="El gap entre coverage y calidad real">
          <p>
            Equipos con <strong>80-90% de coverage</strong> han descubierto mutation scores de{' '}
            <strong>solo 30%</strong> al ejecutar Stryker por primera vez.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'Coverage reportado', value: '90%', color: 'text-green-400', barColor: 'bg-green-500', barWidth: 90 },
              { label: 'Mutation score real', value: '30%', color: 'text-red-400', barColor: 'bg-red-500', barWidth: 30 },
              { label: 'Gap de confianza', value: '60%', color: 'text-yellow-400', barColor: 'bg-yellow-500', barWidth: 60 },
            ].map((item) => (
              <div key={item.label} className="bg-gray-800/50 rounded p-2">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${item.barWidth}%` }} />
                </div>
              </div>
            ))}
          </div>
        </WhyBox>

        <CodeBlock code={s12CoverageLie} language="ts" />
      </div>

      {/* 2. Cómo funciona */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Cómo funciona Stryker</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              step: '1',
              title: 'Genera mutantes',
              desc: 'Cambia operadores, condicionales, strings, bloques...',
              color: 'border-blue-500/30',
            },
            {
              step: '2',
              title: 'Ejecuta tests',
              desc: 'Por cada mutante, ejecuta los tests que cubren ese código',
              color: 'border-purple-500/30',
            },
            {
              step: '3',
              title: 'Evalúa resultado',
              desc: 'Test falla → killed (bien). Test pasa → survived (mal).',
              color: 'border-yellow-500/30',
            },
            {
              step: '4',
              title: 'Genera reporte',
              desc: 'HTML con mutation score, mutantes sobrevivientes y detalles.',
              color: 'border-green-500/30',
            },
          ].map((item) => (
            <div key={item.step} className={`rounded-lg border ${item.color} bg-gray-900 p-4`}>
              <div className="text-2xl font-bold text-gray-600 mb-1">{item.step}</div>
              <p className="font-bold text-white text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <CodeBlock code={s12MutationTypes} language="text" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { state: 'Killed', icon: '💀', color: 'text-green-400', desc: 'Test falló — detectado' },
            { state: 'Survived', icon: '🧟', color: 'text-red-400', desc: 'Tests pasaron — no detectado' },
            { state: 'Timeout', icon: '⏰', color: 'text-green-400', desc: 'Loop infinito — detectado' },
            { state: 'No Coverage', icon: '🚫', color: 'text-red-400', desc: 'Sin tests — no detectado' },
          ].map((item) => (
            <div key={item.state} className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className={`font-bold text-sm ${item.color}`}>{item.state}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Ejercicio: empareja estado ↔ interpretación */}
        <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-5 mt-4">
          <DragAndDropMatch
            title="Ejercicio · Interpreta los estados del reporte"
            promptHeader="Estado del mutante"
            answerHeader="Qué significa en el reporte"
            promptLanguage="text"
            answerLanguage="text"
            pairs={s12MutantStatusPairs}
          />
        </div>
      </div>

      {/* 3. Configuración */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Configuración</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {[
              { id: 'vitest' as ConfigTab, label: 'Vitest (genérico)' },
              { id: 'angular' as ConfigTab, label: 'Angular' },
              { id: 'vue' as ConfigTab, label: 'Vue' },
            ].map((tab) => (
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
          <CodeBlock code={configCode[configTab]} language="json" />
        </div>
      </div>

      {/* 4. Ejemplo de mutante sobreviviente */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Matar mutantes sobrevivientes</h2>
        <p className="text-gray-400">
          Cuando un mutante sobrevive, significa que tu test no verifica ese caso. Así se mejora:
        </p>
        <CodeBlock code={s12SurvivedExample} language="ts" />
      </div>

      {/* 5. Galería de mutantes de libro + ejercicio de matching */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. Los 5 mutantes de libro</h2>
        <p className="text-gray-400">
          Estos cinco aparecen una y otra vez en reportes reales. Si los reconoces de un vistazo,
          aceleras toda la Fase 2 del roadmap.
        </p>

        <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
          {/* Selector de mutante */}
          <div className="flex flex-wrap gap-1 border-b border-gray-700 bg-gray-800 p-2">
            {s12GalleryMutants.map((m, i) => (
              <button
                key={m.id}
                onClick={() => {
                  setGalleryIdx(i)
                  setGalleryView('survives')
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  galleryIdx === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {m.icon} {m.category}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* Diff visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-gray-700 bg-gray-950 overflow-hidden">
                <div className="px-3 py-1.5 bg-gray-800 text-xs text-gray-400 border-b border-gray-700">
                  Código original
                </div>
                <pre className="p-3 text-xs text-gray-200 font-mono whitespace-pre-wrap">
                  {currentMutant.original}
                </pre>
              </div>
              <div className="rounded border border-red-500/40 bg-red-500/5 overflow-hidden">
                <div className="px-3 py-1.5 bg-red-500/20 text-xs text-red-300 border-b border-red-500/30">
                  Mutante generado por Stryker
                </div>
                <pre className="p-3 text-xs text-red-200 font-mono whitespace-pre-wrap">
                  {currentMutant.mutated}
                </pre>
              </div>
            </div>

            {/* Toggle test débil / test que mata */}
            <div className="flex gap-2 border-b border-gray-700 pb-2">
              <button
                onClick={() => setGalleryView('survives')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  galleryView === 'survives'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
                }`}
              >
                🧟 Test que lo deja sobrevivir
              </button>
              <button
                onClick={() => setGalleryView('kills')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  galleryView === 'kills'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
                }`}
              >
                💀 Test que lo mata
              </button>
            </div>

            <CodeBlock
              code={
                galleryView === 'survives'
                  ? currentMutant.survivesWith
                  : currentMutant.killsWith
              }
              language="ts"
            />

            <div className="rounded-lg bg-gray-800/70 border border-gray-700 p-3">
              <p className="text-xs text-gray-400">
                <span className="text-yellow-400 font-semibold">¿Por qué? </span>
                {currentMutant.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Ejercicio: empareja mutante ↔ test que lo mata */}
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-5 mt-4">
          <DragAndDropMatch
            title="Ejercicio · Mata al mutante"
            promptHeader="Mutante superviviente"
            answerHeader="Test que lo mata"
            pairs={s12MutantMatchPairs}
          />
        </div>
      </div>

      {/* 6. Roadmap por fases — el KPI del cliente */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">6. Roadmap · subir el mutation score por fases</h2>
        <p className="text-gray-400">
          Subir de golpe un mutation score bajo es irreal. El camino probado es por fases, atacando
          primero los mutantes con mejor ratio esfuerzo/resultado.
        </p>

        <div className="space-y-3">
          {s12RoadmapPhases.map((phase, idx) => {
            const colors = [
              { border: 'border-gray-600', accent: 'text-gray-400', bar: 'bg-gray-600', barW: 22 },
              { border: 'border-blue-500/50', accent: 'text-blue-300', bar: 'bg-blue-500', barW: 35 },
              { border: 'border-purple-500/50', accent: 'text-purple-300', bar: 'bg-purple-500', barW: 50 },
              { border: 'border-green-500/50', accent: 'text-green-300', bar: 'bg-green-500', barW: 62 },
            ][idx]
            return (
              <div key={phase.id} className={`rounded-lg border ${colors.border} bg-gray-900 p-4`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className={`text-xs uppercase tracking-wider font-semibold ${colors.accent}`}>
                      {phase.range}
                    </p>
                    <p className="text-white font-bold text-sm mt-0.5">{phase.focus}</p>
                  </div>
                  <div className="flex-1 max-w-[200px] pt-1">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${colors.barW}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{phase.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider font-semibold mb-1">Técnicas</p>
                    <ul className="space-y-0.5 list-disc list-inside text-gray-300">
                      {phase.techniques.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider font-semibold mb-1">Mutadores a priorizar</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.mutatorCategories.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-[11px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <WhyBox variant="info" title="Métricas del cliente (contexto interno)">
          <p>
            Los rangos <code>~22 %</code>, <code>35 %</code>, <code>50 %</code> y <code>60 %+</code> provienen de
            métricas internas del proyecto con 20+ squads. Cuando los uses en tu equipo, preséntalos como{' '}
            "nuestro baseline" / "nuestro objetivo", no como benchmark público de la industria.
          </p>
        </WhyBox>
      </div>

      {/* 7. Optimización */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">7. Optimización de rendimiento</h2>

        <WhyBox variant="warning" title="Stryker puede ser lento">
          <p>
            Un proyecto con 2,000 mutantes y suite de 5 segundos podría tardar{' '}
            <strong>2.8+ horas</strong>. Estas estrategias son esenciales.
          </p>
        </WhyBox>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span>
            <p className="font-bold text-emerald-300 text-sm">La palanca nº 1: <code>coverageAnalysis: "perTest"</code></p>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Con Vitest runner, activar <code>perTest</code> es típicamente un <strong>10× – 50×</strong> de
            speedup. Es lo primero que se toca antes que nada.
          </p>
          <CodeBlock code={s12PerTestConfig} language="json" />
        </div>

        <CodeBlock code={s12Optimization} language="text" />
      </div>

      {/* 8. Desactivar mutantes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">8. Desactivar mutantes equivalentes</h2>
        <p className="text-gray-400">
          Algunos mutantes no cambian el comportamiento del programa (equivalentes). Se pueden ignorar:
        </p>
        <CodeBlock code={s12DisableMutants} language="ts" />
      </div>

      {/* 9. CI Pipeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">9. Integración en CI/CD</h2>
        <CodeBlock code={s12CIPipeline} language="bash" filename=".github/workflows/mutation.yml" />

        <WhyBox variant="tip" title="Adopción progresiva">
          <ol className="space-y-1 list-decimal list-inside">
            <li>Empezar con <strong>un módulo crítico</strong> (auth, pagos, validación)</li>
            <li>Poner <code className="text-yellow-400">"break": null</code> al inicio — solo observar</li>
            <li>Identificar los mutantes sobrevivientes más impactantes</li>
            <li>Mejorar los tests más débiles</li>
            <li>Poner el threshold al score actual - 5%</li>
            <li>Expandir gradualmente a más módulos</li>
          </ol>
        </WhyBox>
      </div>

      <SimulatedTestOutput lines={s12SimulatedOutput} title="Stryker mutation testing" />

      {/* 10. Stryker con Vitest vs Stryker con Karma (highlight del bloque 4) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">10. Stryker con Vitest vs Stryker con Karma</h2>
        <p className="text-gray-400">
          El repo del taller tiene <strong className="text-white">dos Strykers configurados</strong>:
          uno con el runner de Vitest, otro con el runner de Karma. Ejecutar ambos sobre el mismo
          archivo revela cifras que cuentan toda la historia del taller en una tabla.
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400">Métrica</th>
                <th className="text-left px-4 py-3 text-emerald-400">Stryker · Vitest</th>
                <th className="text-left px-4 py-3 text-yellow-400">Stryker · Karma</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tiempo (sobre src/utils)', '75 s', '9 s'],
                ['Mutation score', '83.84 %', '83.84 % ✓ idéntico'],
                ['Killed / Survived', '166 / 32', '166 / 32 ✓ idéntico'],
                ['Tests promedio por mutante', '25.5 (perTest)', '53.2 (suite entera)'],
                ['coverageAnalysis: "perTest"', '✓ soportado', '✗ no disponible'],
                ['Suite cargable por Stryker', '240 tests (completa)', '118 tests (reducida)'],
              ].map((row, idx) => (
                <tr key={row[0]} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                  <td className="px-4 py-2.5 text-gray-300 font-medium">{row[0]}</td>
                  <td className="px-4 py-2.5"><code className="text-emerald-300 text-xs">{row[1]}</code></td>
                  <td className="px-4 py-2.5"><code className="text-yellow-300 text-xs">{row[2]}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WhyBox variant="warning" title="⚠ El matiz del 9 s de Karma" defaultOpen>
          <p>
            A primera vista, Karma tardó <strong>9 s</strong> y Vitest <strong>75 s</strong> sobre los
            mismos mutantes — Karma parece ganar. <strong className="text-white">No es así.</strong>
          </p>
          <p className="mt-2">
            Para que Stryker-Karma arrancara hubo que crear un{' '}
            <code className="text-yellow-400">karma.stryker.conf.cjs</code> que{' '}
            <strong>carga solo los tests de <code>src/utils/</code></strong> (118 tests, sin componentes).
            ¿Por qué? Porque cuando Stryker intenta cargar la suite completa (237 tests), el
            instrumenter + webpack se atraganta con los módulos ESM de{' '}
            <code className="text-yellow-400">@testing-library/user-event 14</code> y el{' '}
            <em>dry-run</em> falla.
          </p>
          <p className="mt-2">
            Karma parece rápido porque lo limitamos. En un proyecto real con 20+ squads y componentes
            modernos, Stryker-Karma <strong>simplemente no arranca</strong>. Migrar a Vitest desbloquea
            el mutation testing para tu proyecto entero.
          </p>
        </WhyBox>

        <WhyBox variant="tip" title="La paridad de mutation score valida los tests">
          <p>
            Los dos runners dan <strong>exactamente el mismo score</strong> (83.84 %, 166 killed, 32
            survived). Eso significa que tus tests espejados (Karma ↔ Vitest) cubren lo mismo — el
            runner no altera la calidad, solo el tiempo y la ergonomía.
          </p>
          <p className="mt-2">
            Si el score difiere entre ambos, la paridad funcional se rompió: algún{' '}
            <code className="text-emerald-400">.old.test.*</code> no cubre lo que su gemelo{' '}
            <code className="text-emerald-400">.test.*</code> sí cubre.
          </p>
        </WhyBox>
      </div>

      <PracticeMore
        intro="Stryker se entiende mejor rompiendo código en vivo. En el repo tienes un archivo con 5 mutantes intencionales y dos suites que los cubren (una débil, una fuerte): ejecuta cada una y mira el reporte HTML para interiorizar qué tipo de test mata qué mutante."
        repoFiles={[
          { path: 'src/utils/temperatureConverter.js', description: 'Los 5 MUTANT_DEMO_* marcados en los comentarios' },
          { path: 'src/utils/temperatureConverter.test.js', description: 'Dos suites · débil (mutantes vivos) y fuerte (mutantes muertos)' },
          { path: 'stryker.vitest.config.json', description: 'Config con coverageAnalysis: perTest' },
          { path: 'stryker.karma.config.json', description: 'Config equivalente con Karma runner (para comparar)' },
          { path: 'reports/mutation/vitest/mutation.html', description: 'Reporte HTML tras ejecutar Stryker' },
        ]}
        materialReference="material/14-mutation-testing-stryker.md · roadmap por fases, operadores, CI"
      />

      <div className="border-t border-gray-800 pt-8">
        <Quiz
          questions={allQuizQuestions}
          sectionId="s12"
          onComplete={(score, total) => {
            if (score / total >= 0.7) markComplete('s12')
          }}
        />
      </div>
    </div>
  )
}
