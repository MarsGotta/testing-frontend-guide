import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import AAAAnnotated from '../components/shared/AAAAnnotated'
import ComponentTestTabs from '../components/shared/ComponentTestTabs'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s1ComponentCode,
  s1TestCode,
  s1AAAArrange,
  s1AAAct,
  s1AAAAssert,
  s1NamingExample,
  s1BDDExample,
  s1Quiz,
  s1SimulatedOutput,
} from '../data/s1-anatomy.data'

export default function S1Anatomy() {
  const { markComplete } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s1"
        icon="🔬"
        title="Anatomía de un Test"
        description="El patrón AAA, cómo nombrar tests descriptivamente y aserciones BDD."
        sectionNumber={2}
      />

      {/* Naming */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Nombres en 3 partes</h2>
        <p className="text-gray-400">
          Un buen nombre de test responde tres preguntas: <strong className="text-white">¿qué</strong> se prueba,
          bajo <strong className="text-white">qué escenario</strong> y cuál es el
          <strong className="text-white"> resultado esperado</strong>.
        </p>

        <CodeBlock
          code={s1NamingExample}
          language="tsx"
          filename="counter.test.tsx"
          showLineNumbers={false}
        />

        <WhyBox variant="tip" title="¿Por qué importa el nombre?">
          <p>Cuando un test falla a las 2am en producción, un nombre como
          <code className="mx-1 text-emerald-400">"debería incrementar"</code>
          no dice nada. Pero
          <code className="mx-1 text-emerald-400">"Counter &gt; cuando el usuario hace clic en Incrementar &gt; debería mostrar el valor incrementado en 1"</code>
          te dice exactamente qué falló sin abrir el archivo.</p>
        </WhyBox>
      </div>

      {/* AAA */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. El patrón AAA</h2>
        <p className="text-gray-400">
          Divide cada test en tres fases bien delimitadas. Facilita la lectura y detecta qué parte falló.
        </p>

        <AAAAnnotated
          arrangeCode={s1AAAArrange}
          actCode={s1AAAct}
          assertCode={s1AAAAssert}
          language="tsx"
          description="Ejemplo: test del Counter con el patrón AAA marcado por colores"
        />
      </div>

      {/* BDD */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Aserciones BDD con expect()</h2>
        <p className="text-gray-400">
          Las aserciones BDD (Behavior-Driven Development) producen mensajes de error legibles cuando fallan.
        </p>

        <CodeBlock code={s1BDDExample} language="tsx" showLineNumbers={false} />
      </div>

      {/* Component + test tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Ejemplo completo: Counter</h2>
        <p className="text-gray-400">
          El componente <code className="text-emerald-400">Counter</code> es nuestro primer sujeto de prueba.
          Observa cómo los tests siguen el patrón AAA y usan nombres descriptivos.
        </p>

        <ComponentTestTabs
          componentCode={s1ComponentCode}
          testCode={s1TestCode}
          componentFilename="tests/examples/Counter.tsx"
          testFilename="tests/s1-anatomy/counter.test.tsx"
        />
      </div>

      <SimulatedTestOutput lines={s1SimulatedOutput} title="vitest run s1-anatomy/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s1Quiz} sectionId="s1" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s1')
        }} />
      </div>
    </div>
  )
}
