import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s2MatchersTestCode,
  s2LifecycleTestCode,
  s2VitestConfig,
  s2JestConfig,
  s2SetupFile,
  s2PackageScripts,
  s2Quiz,
  s2SimulatedOutput,
} from '../data/s2-jest-vitest.data'

type ConfigTab = 'vitest' | 'jest'
type TestTab = 'matchers' | 'lifecycle'

export default function S2JestVitest() {
  const { markComplete } = useProgress()
  const [configTab, setConfigTab] = useState<ConfigTab>('vitest')
  const [testTab, setTestTab] = useState<TestTab>('matchers')

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s2"
        icon="⚙️"
        title="Jest y Vitest"
        description="Configuración del entorno de testing, matchers fundamentales y ciclo de vida."
        sectionNumber={3}
      />

      {/* Config comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Configuración</h2>
        <p className="text-gray-400">
          Vitest es la opción natural para proyectos Vite (el estándar actual). Jest sigue siendo válido en proyectos legacy con Webpack, aunque cada vez más equipos migran a Vitest.
        </p>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {(['vitest', 'jest'] as ConfigTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setConfigTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  configTab === tab
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab === 'vitest' ? '⚡ Vitest (recomendado)' : '🃏 Jest (proyectos legacy/Webpack)'}
              </button>
            ))}
          </div>
          <CodeBlock
            code={configTab === 'vitest' ? s2VitestConfig : s2JestConfig}
            language="ts"
            filename={configTab === 'vitest' ? 'vitest.config.ts' : 'jest.config.js'}
            showLineNumbers={true}
          />
        </div>

        <WhyBox variant="tip" title="Diferencias clave: Vitest vs Jest">
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Vitest</strong> reutiliza la config de Vite: más rápido, sin duplicar configuración.</li>
            <li><strong>Vitest</strong> usa <code className="text-emerald-400">vi</code> en lugar de <code className="text-emerald-400">jest</code> para mocks y spies.</li>
            <li>Ambos comparten la misma API de matchers: <code className="text-emerald-400">describe</code>, <code className="text-emerald-400">it</code>, <code className="text-emerald-400">expect</code>.</li>
            <li>Los tests escritos para Jest son mayoritariamente compatibles con Vitest.</li>
          </ul>
        </WhyBox>

        <WhyBox variant="warning" title="CRA (Create React App) está deprecado">
          <p>
            Desde 2023, Create React App ya no se mantiene y <strong>React no lo recomienda</strong> para proyectos nuevos.
            Las alternativas actuales son <strong>Vite</strong> (SPA rápidas), <strong>Next.js</strong> (SSR/SSG) o <strong>Remix</strong> (full-stack).
            Si trabajas con un proyecto CRA existente, considera migrar a Vite.
          </p>
        </WhyBox>
      </div>

      {/* Setup file */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Archivo de Setup</h2>
        <p className="text-gray-400">
          El archivo <code className="text-emerald-400">setupFiles</code> se ejecuta antes de cada test,
          cargando los matchers de jest-dom y configurando el entorno.
        </p>
        <CodeBlock code={s2SetupFile} language="ts" filename="src/tests/setup.ts" />
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Scripts npm</h2>
        <CodeBlock code={s2PackageScripts} language="json" filename="package.json" />
      </div>

      {/* Matchers + lifecycle tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Tests de ejemplo</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {([
              { id: 'matchers', label: '🎯 Matchers fundamentales' },
              { id: 'lifecycle', label: '♻️ Ciclo de vida' },
            ] as { id: TestTab; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTestTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  testTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CodeBlock
            code={testTab === 'matchers' ? s2MatchersTestCode : s2LifecycleTestCode}
            language="ts"
            filename={testTab === 'matchers' ? 'tests/s2-jest-vitest/matchers.test.ts' : 'tests/s2-jest-vitest/lifecycle.test.ts'}
          />
        </div>
      </div>

      <SimulatedTestOutput lines={s2SimulatedOutput} title="vitest run s2-jest-vitest/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s2Quiz} sectionId="s2" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s2')
        }} />
      </div>
    </div>
  )
}
