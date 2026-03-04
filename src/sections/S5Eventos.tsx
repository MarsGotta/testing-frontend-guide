import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import ComponentTestTabs from '../components/shared/ComponentTestTabs'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s5LoginFormCode,
  s5LoginFormTestCode,
  s5UserEventTestCode,
  s5UserEventExample,
  s5FireEventExample,
  s5UserVsFireComparison,
  s5Quiz,
  s5SimulatedOutput,
} from '../data/s5-eventos.data'

export default function S5Eventos() {
  const { markComplete } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s5"
        icon="🖱️"
        title="Eventos de Usuario"
        description="Simula interacciones reales con userEvent y entiende la diferencia con fireEvent."
        sectionNumber={6}
      />

      {/* userEvent */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. userEvent — simula el usuario real</h2>
        <p className="text-gray-400">
          <code className="text-emerald-400">@testing-library/user-event</code> simula la secuencia
          completa de eventos que ocurren cuando un usuario interactúa con la app en un navegador real.
        </p>

        <CodeBlock
          code={s5UserEventExample}
          language="tsx"
          showLineNumbers={false}
          filename="userEvent API"
        />

        <WhyBox variant="tip" title="Usa siempre userEvent.setup()">
          <p>
            En userEvent v14, inicializa con <code className="text-emerald-400">const user = userEvent.setup()</code>
            antes de tu test. Esto crea un contexto que simula el mismo usuario a través de todas las acciones del test
            (mantiene el foco, el historial de eventos, etc.).
          </p>
        </WhyBox>
      </div>

      {/* fireEvent comparison */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Comparativa: userEvent vs fireEvent</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-medium">
              ⚠️ fireEvent — básico
            </div>
            <CodeBlock code={s5FireEventExample} language="tsx" showLineNumbers={false} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm font-medium">
              ✅ userEvent — recomendado
            </div>
            <CodeBlock code={s5UserEventExample} language="tsx" showLineNumbers={false} />
          </div>
        </div>

        <CodeBlock
          code={s5UserVsFireComparison}
          language="tsx"
          showLineNumbers={false}
          filename="Diferencia en eventos disparados"
        />
      </div>

      {/* LoginForm example */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Ejemplo: LoginForm con validaciones</h2>
        <p className="text-gray-400">
          Un formulario realista con validación de campos, estados de carga y manejo de errores del servidor.
          Observa cómo testeamos cada escenario de forma independiente.
        </p>

        <ComponentTestTabs
          componentCode={s5LoginFormCode}
          testCode={s5LoginFormTestCode}
          componentFilename="tests/examples/LoginForm.tsx"
          testFilename="tests/s5-eventos/LoginForm.test.tsx"
        />
      </div>

      {/* userEvent test */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Tests de userEvent en detalle</h2>
        <CodeBlock
          code={s5UserEventTestCode}
          language="tsx"
          filename="tests/s5-eventos/userEvent.test.tsx"
        />
      </div>

      <SimulatedTestOutput lines={s5SimulatedOutput} title="vitest run s5-eventos/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s5Quiz} sectionId="s5" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s5')
        }} />
      </div>
    </div>
  )
}
