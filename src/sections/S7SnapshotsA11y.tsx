import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import ComponentTestTabs from '../components/shared/ComponentTestTabs'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s7AccessibleFormCode,
  s7InlineSnapshotCode,
  s7A11yTestCode,
  s7InlineSnapshotExample,
  s7FileSnapshotWarning,
  s7A11yAxeExample,
  s7A11yBadGood,
  s7Quiz,
  s7SimulatedOutput,
} from '../data/s7-snapshots-a11y.data'

type A11yTab = 'good' | 'bad'

export default function S7SnapshotsA11y() {
  const { markComplete } = useProgress()
  const [a11yTab, setA11yTab] = useState<A11yTab>('bad')

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s7"
        icon="📸"
        title="Snapshots y Accesibilidad"
        description="Snapshot testing inline y cómo detectar violaciones de accesibilidad con jest-axe."
        sectionNumber={8}
      />

      {/* Snapshots */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Snapshot Testing</h2>
        <p className="text-gray-400">
          Los snapshots capturan el output de un componente y lo comparan en futuras ejecuciones.
          Los <strong className="text-white">inline snapshots</strong> viven en el mismo archivo del test.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm font-medium">
              ✅ Inline Snapshot (recomendado)
            </div>
            <CodeBlock code={s7InlineSnapshotExample} language="tsx" showLineNumbers={false} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-medium">
              ⚠️ Snapshot de archivo (evitar)
            </div>
            <CodeBlock code={s7FileSnapshotWarning} language="tsx" showLineNumbers={false} />
          </div>
        </div>

        <WhyBox variant="warning" title="Cuándo NO usar snapshots">
          <ul className="space-y-1 list-disc list-inside">
            <li>No uses snapshots de DOM completo — se rompen con cualquier cambio de spacing.</li>
            <li>No actualices snapshots sin revisar qué cambió (<code className="text-red-400">vitest -u</code>).</li>
            <li>Los snapshots no reemplazan assertions de comportamiento.</li>
          </ul>
        </WhyBox>
      </div>

      {/* Snapshots tests */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Tests de snapshot en acción</h2>
        <CodeBlock
          code={s7InlineSnapshotCode}
          language="tsx"
          filename="tests/s7-snapshots/inline-snapshot.test.tsx"
        />
      </div>

      {/* A11y */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Accesibilidad con jest-axe</h2>
        <p className="text-gray-400">
          <code className="text-emerald-400">jest-axe</code> usa axe-core para detectar automáticamente
          violaciones de las guías WCAG en tus componentes.
        </p>

        <CodeBlock code={s7A11yAxeExample} language="tsx" showLineNumbers={false} filename="Uso básico de jest-axe" />

        <WhyBox variant="info" title="¿Qué detecta axe automáticamente?">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
            {[
              ['image-alt', 'Imágenes sin alt'],
              ['label', 'Inputs sin label'],
              ['color-contrast', 'Contraste insuficiente'],
              ['heading-order', 'Headings mal ordenados'],
              ['button-name', 'Botones sin nombre'],
              ['link-name', 'Links sin texto'],
              ['aria-roles', 'Roles ARIA inválidos'],
              ['form-field-multiple-labels', 'Múltiples labels'],
            ].map(([rule, desc]) => (
              <div key={rule} className="text-sm">
                <code className="text-blue-400">{rule}</code>
                <span className="text-gray-500 ml-2">{desc}</span>
              </div>
            ))}
          </div>
        </WhyBox>
      </div>

      {/* Bad vs Good a11y */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Componente accesible vs no accesible</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {([
              { id: 'bad' as A11yTab, label: '❌ Sin accesibilidad' },
              { id: 'good' as A11yTab, label: '✅ Con accesibilidad' },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setA11yTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  a11yTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CodeBlock
            code={a11yTab === 'bad' ? s7A11yBadGood.bad : s7A11yBadGood.good}
            language="tsx"
            showLineNumbers={false}
          />
        </div>
      </div>

      {/* AccessibleForm + a11y test */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. Ejemplo completo: AccessibleForm</h2>

        <ComponentTestTabs
          componentCode={s7AccessibleFormCode}
          testCode={s7A11yTestCode}
          componentFilename="tests/examples/AccessibleForm.tsx"
          testFilename="tests/s7-snapshots/a11y.test.tsx"
        />
      </div>

      <SimulatedTestOutput lines={s7SimulatedOutput} title="vitest run s7-snapshots/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s7Quiz} sectionId="s7" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s7')
        }} />
      </div>
    </div>
  )
}
