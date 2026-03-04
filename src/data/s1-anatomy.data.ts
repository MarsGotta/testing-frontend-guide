import type { QuizQuestion, OutputLine } from '../types/guide.types'

// ?raw imports: el código mostrado en la guía ES el código real de los tests
import counterExampleRaw from '../tests/examples/Counter.tsx?raw'
import counterTestRaw from '../tests/s1-anatomy/counter.test.tsx?raw'
import utilsTestRaw from '../tests/s1-anatomy/utils.test.ts?raw'

export const s1ComponentCode = counterExampleRaw
export const s1TestCode = counterTestRaw
export const s1UtilsTestCode = utilsTestRaw

export const s1AAAArrange = `// ── Ajustar (Arrange) ──────────────────────────────────────
const user = userEvent.setup()
render(<Counter initialValue={3} />)`

export const s1AAAct = `// ── Actuar (Act) ─────────────────────────────────────────
await user.click(screen.getByRole('button', { name: /incrementar/i }))`

export const s1AAAAssert = `// ── Afirmar (Assert) ─────────────────────────────────────
expect(screen.getByTestId('count-display')).toHaveTextContent('4')`

export const s1NamingExample = `describe('Counter', () => {
  describe('cuando el usuario hace clic en Incrementar', () => {
    //      ↑ escenario (contexto)
    it('debería mostrar el valor incrementado en 1', () => {
    //  ↑ resultado esperado
      // ...
    })
  })
})
// Nombre completo del test:
// "Counter > cuando el usuario hace clic en Incrementar
//           > debería mostrar el valor incrementado en 1"`

export const s1BDDExample = `// ❌ MAL: aserción con operadores === sin mensaje claro
assert(screen.getByTestId('count-display').textContent === '4')

// ✅ BIEN: aserción BDD con expect — error mensaje legible
expect(screen.getByTestId('count-display')).toHaveTextContent('4')
// → Error: Expected element to have text content: 4 but received: 3`

export const s1Quiz: QuizQuestion[] = [
  {
    id: 's1-q1',
    question: '¿Cuáles son las 3 partes que debe incluir el nombre de un test bien estructurado?',
    options: [
      'Autor, fecha y versión',
      'Qué se prueba, bajo qué escenario y cuál es el resultado esperado',
      'Componente, función y parámetros',
      'Módulo, clase y método',
    ],
    correctIndex: 1,
    explanation:
      'Un nombre de test bien estructurado responde: ¿Qué estoy probando? ¿Bajo qué condición/escenario? ¿Cuál es el resultado esperado? Esto lo hace legible como documentación.',
  },
  {
    id: 's1-q2',
    question: '¿Qué significa el patrón AAA en testing?',
    options: [
      'Asíncrono, Aceptación, Automatización',
      'API, Arquitectura, Aserciones',
      'Ajustar (Arrange), Actuar (Act), Afirmar (Assert)',
      'Asegurar, Auditar, Aprobar',
    ],
    correctIndex: 2,
    explanation:
      'AAA estructura los tests en 3 fases: Arrange (preparar el estado inicial), Act (ejecutar la acción), Assert (verificar el resultado). Hace los tests más legibles y mantenibles.',
  },
  {
    id: 's1-q3',
    question: '¿Cuántas "aserciones lógicas" debería tener un test bien escrito?',
    options: [
      'Exactamente una llamada a expect()',
      'Una aserción lógica (pueden ser varios expect sobre el mismo concepto)',
      'Tantas como sea posible para máxima cobertura',
      'Mínimo 5 para ser exhaustivo',
    ],
    correctIndex: 1,
    explanation:
      'Un test debe verificar UN concepto lógico. Pueden existir varios expect() si todos comprueban el mismo comportamiento. Pero si necesitas probar dos conceptos distintos, crea dos tests.',
  },
]

export const s1SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s1-anatomy/' },
  { type: 'info', text: 'counter.test.tsx' },
  { type: 'pass', text: 'Counter > cuando se renderiza sin props > debería mostrar el valor inicial 0' },
  { type: 'pass', text: 'Counter > cuando el usuario hace clic en Incrementar > debería mostrar el valor incrementado en 1' },
  { type: 'pass', text: 'Counter > cuando el usuario hace clic en Decrementar > debería mostrar el valor decrementado en 1' },
  { type: 'pass', text: 'Counter > cuando el usuario hace clic en Reiniciar > debería volver al valor inicial' },
  { type: 'info', text: 'utils.test.ts' },
  { type: 'pass', text: 'sumar > debería retornar la suma de dos números positivos' },
  { type: 'pass', text: 'capitalizar > debería poner en mayúscula la primera letra' },
  { type: 'pass', text: 'dividir > debería lanzar un error cuando el divisor es cero' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)  |  Tests  18 passed' },
]
