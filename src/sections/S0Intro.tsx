import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import { s0Quiz, s0SimulatedOutput } from '../data/s0-intro.data'

// Pirámide de testing construida con Tailwind
function TestingPyramid() {
  return (
    <div className="flex flex-col items-center gap-1 my-6 select-none">
      {/* E2E — cima */}
      <div className="flex flex-col items-center gap-1">
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-center py-3 rounded-lg flex flex-col justify-center"
          style={{ width: '180px' }}>
          <div className="text-sm font-bold">E2E</div>
          <div className="text-xs text-red-400/70">Pocos, lentos, costosos</div>
        </div>
        <div className="text-xs text-gray-500">Cypress, Playwright</div>
      </div>

      {/* Integración */}
      <div className="flex flex-col items-center gap-1">
        <div className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-center py-3 rounded-lg flex flex-col justify-center"
          style={{ width: '280px' }}>
          <div className="text-sm font-bold">Integración</div>
          <div className="text-xs text-yellow-400/70">Componentes + API + Store</div>
        </div>
        <div className="text-xs text-gray-500">Testing Library (componentes complejos)</div>
      </div>

      {/* Unitarios — base */}
      <div className="flex flex-col items-center gap-1">
        <div className="bg-green-500/20 border border-green-500/40 text-green-300 text-center py-4 rounded-lg flex flex-col justify-center"
          style={{ width: '380px' }}>
          <div className="text-sm font-bold">Unitarios</div>
          <div className="text-xs text-green-400/70">Muchos, rápidos, baratos</div>
        </div>
        <div className="text-xs text-gray-500">Jest / Vitest + Testing Library</div>
      </div>
    </div>
  )
}

export default function S0Intro() {
  const { markComplete } = useProgress()

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s0"
        icon="🧪"
        title="¿Por qué testear?"
        description="Introduce la pirámide de testing, el valor de los tests y los conceptos fundamentales."
        sectionNumber={1}
      />

      <div className="prose-guide space-y-4">
        <p>
          Los tests son el <strong>cinturón de seguridad</strong> del desarrollo de software.
          No evitan que escribas código, pero reducen el miedo a cambiar lo que ya funciona.
        </p>

        <h2>La pirámide de testing</h2>
        <p>
          La pirámide describe cuántos tests de cada tipo deberías tener y cuánto confiar en ellos.
          La base es ancha (muchos tests unitarios), la cima estrecha (pocos E2E).
        </p>
      </div>

      <TestingPyramid />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            type: 'Unitarios',
            icon: '⚡',
            color: 'border-green-500/30 bg-green-500/5',
            points: ['Prueban una función o componente aislado', 'Rápidos (ms)', 'Fáciles de escribir y mantener', 'Alta cobertura de lógica de negocio'],
          },
          {
            type: 'Integración',
            icon: '🔗',
            color: 'border-yellow-500/30 bg-yellow-500/5',
            points: ['Prueban la colaboración entre partes', 'Detectan problemas entre capas', 'Velocidad media', 'Testing Library es ideal aquí'],
          },
          {
            type: 'E2E',
            icon: '🌐',
            color: 'border-red-500/30 bg-red-500/5',
            points: ['Prueban el sistema completo', 'Alta confianza', 'Lentos y frágiles', 'Solo flujos críticos'],
          },
        ].map((item) => (
          <div key={item.type} className={`rounded-lg border p-4 ${item.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-white">{item.type}</span>
            </div>
            <ul className="space-y-1">
              {item.points.map((p) => (
                <li key={p} className="text-sm text-gray-400 flex items-start gap-1.5">
                  <span className="text-gray-600 mt-0.5">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <WhyBox variant="why" title="¿Por qué no solo hacer tests E2E?">
        <p>Los tests E2E son los más parecidos a cómo el usuario usa la app, pero son <strong>lentos</strong> (segundos por test), <strong>frágiles</strong> (se rompen con cambios de UI),
        y <strong>difíciles de debuggear</strong> cuando fallan. Una suite de 1000 tests E2E podría tardar horas.</p>
        <p className="mt-2">Los unitarios en cambio se ejecutan en milisegundos y son mucho más fáciles de mantener.</p>
      </WhyBox>

      <WhyBox variant="info" title="El Testing Trophy: una perspectiva moderna">
        <p>
          Kent C. Dodds (creador de Testing Library) propone el <strong>Testing Trophy</strong> como evolución de la pirámide.
          La diferencia clave: pone los <strong>tests de integración en el centro</strong>, porque son los que dan más confianza
          con un coste razonable.
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li><strong>Estáticos</strong> (base): TypeScript, ESLint — errores antes de ejecutar.</li>
          <li><strong>Unitarios</strong>: lógica de negocio pura, utilidades.</li>
          <li><strong>Integración</strong> (centro, mayoría): componentes con sus dependencias reales — aquí Testing Library brilla.</li>
          <li><strong>E2E</strong> (cima): solo flujos críticos del negocio.</li>
        </ul>
        <p className="mt-2 text-gray-400 text-sm">
          En esta guía usamos ambas perspectivas. Testing Library está diseñada para tests de integración que verifican el comportamiento desde la perspectiva del usuario.
        </p>
      </WhyBox>

      <WhyBox variant="tip" title="La regla de oro" defaultOpen={true}>
        <p>
          <strong>"El código de los tests no es como el código de producción — diséñalo para que sea simple, corto y sin abstracciones innecesarias."</strong>
        </p>
        <p className="mt-2 text-gray-400">— Yoni Goldberg, JavaScript Testing Best Practices</p>
      </WhyBox>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">¿Qué aportan los tests?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🛡️', title: 'Protección contra regresiones', desc: 'Detectan cuando un cambio rompe algo que funcionaba.' },
            { icon: '📚', title: 'Documentación viva', desc: 'Los tests describen cómo debe comportarse el código.' },
            { icon: '🔨', title: 'Confianza para refactorizar', desc: 'Puedes mejorar el código sin miedo a romper nada.' },
            { icon: '🚀', title: 'Feedback inmediato', desc: 'Sabes si algo falla antes de llegar a producción.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">¿Cómo se ve un test en ejecución?</h2>
        <SimulatedTestOutput lines={s0SimulatedOutput} title="vitest run" testFile="src/tests/" />
      </div>

      <div className="border-t border-gray-800 pt-8 space-y-4">
        <Quiz questions={s0Quiz} sectionId="s0" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s0')
        }} />
      </div>
    </div>
  )
}
