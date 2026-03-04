import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import ComponentTestTabs from '../components/shared/ComponentTestTabs'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s3ComponentCode,
  s3TestCode,
  s3RenderExample,
  s3ScreenQueries,
  s3Quiz,
  s3SimulatedOutput,
} from '../data/s3-primer-componente.data'

export default function S3PrimerComponente() {
  const { markComplete } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s3"
        icon="🧩"
        title="Tu Primer Componente con Testing Library"
        description="Aprende el flujo básico de RTL: render(), screen y aserciones con jest-dom."
        sectionNumber={4}
      />

      <div className="prose-guide space-y-4">
        <p>
          <strong>Testing Library</strong> es una familia de utilidades que te ayuda a testear
          componentes de la misma forma en que <strong>el usuario los usa</strong>: interactuando
          con el DOM visible, no con los detalles de implementación internos.
        </p>

        <WhyBox variant="tip" title="La filosofía de Testing Library" defaultOpen={true}>
          <p className="italic">
            "Cuanto más se parezcan tus tests a cómo el software es usado, más confianza te darán."
          </p>
          <p className="mt-2 text-gray-500">— Kent C. Dodds, creador de Testing Library</p>
        </WhyBox>
      </div>

      {/* render + screen */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. render() y screen</h2>
        <p className="text-gray-400">
          <code className="text-emerald-400">render()</code> monta el componente en un DOM virtual.
          <code className="text-emerald-400 ml-1">screen</code> expone todas las queries sobre el documento actual.
        </p>

        <CodeBlock
          code={s3RenderExample}
          language="tsx"
          showLineNumbers={false}
          filename="Flujo básico"
        />
      </div>

      {/* screen queries overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Queries disponibles en screen</h2>
        <CodeBlock
          code={s3ScreenQueries}
          language="tsx"
          showLineNumbers={false}
        />

        <WhyBox variant="info" title="Cleanup automático">
          <p>
            Testing Library ejecuta <code className="text-blue-400">cleanup()</code> automáticamente
            después de cada test, desmontando el componente y limpiando el DOM.
            No necesitas llamarlo manualmente.
          </p>
        </WhyBox>
      </div>

      {/* Component + test */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Ejemplo completo: Counter</h2>
        <p className="text-gray-400">
          El mismo <code className="text-emerald-400">Counter</code> de la sección anterior,
          ahora con un test completo que cubre renderizado inicial, interacciones y límites.
        </p>

        <ComponentTestTabs
          componentCode={s3ComponentCode}
          testCode={s3TestCode}
          componentFilename="tests/examples/Counter.tsx"
          testFilename="tests/s3-primer-componente/Counter.test.tsx"
        />
      </div>

      <SimulatedTestOutput lines={s3SimulatedOutput} title="vitest run s3-primer-componente/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s3Quiz} sectionId="s3" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s3')
        }} />
      </div>
    </div>
  )
}
