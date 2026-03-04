import type { QuizQuestion, OutputLine } from '../types/guide.types'

import counterExampleRaw from '../tests/examples/Counter.tsx?raw'
import counterTestRaw from '../tests/s3-primer-componente/Counter.test.tsx?raw'

export const s3ComponentCode = counterExampleRaw
export const s3TestCode = counterTestRaw

export const s3RenderExample = `import { render, screen } from '@testing-library/react'
import { Counter } from './Counter'

// render() monta el componente en un DOM virtual
const { container } = render(<Counter initialValue={5} />)

// screen expone todas las queries sobre el DOM actual
expect(screen.getByTestId('count-display')).toHaveTextContent('5')`

export const s3ScreenQueries = `// screen tiene acceso a todas las queries
screen.getByRole('button', { name: /incrementar/i })  // lanza error si no existe
screen.queryByText('Error')                            // retorna null si no existe
await screen.findByText('Cargado')                     // espera a que aparezca

// Queries múltiples
screen.getAllByRole('button')       // array de todos los botones
screen.queryAllByRole('listitem')   // array (vacío si no hay)`

export const s3Quiz: QuizQuestion[] = [
  {
    id: 's3-q1',
    question: '¿Para qué sirve el objeto `screen` de Testing Library?',
    options: [
      'Para hacer capturas de pantalla',
      'Para acceder a las queries del DOM renderizado actualmente',
      'Para controlar el viewport del navegador',
      'Para gestionar el estado del componente',
    ],
    correctIndex: 1,
    explanation:
      'screen es un objeto que contiene todas las queries (getBy, queryBy, findBy...) ya enlazadas al document.body actual. Es la forma recomendada de buscar elementos en el DOM.',
  },
  {
    id: 's3-q2',
    question: 'Testing Library recomienda testear los componentes de la misma forma en que...',
    options: [
      '...los desarrolladores los implementan',
      '...los usuarios los usan',
      '...el compilador los procesa',
      '...los diseñadores los mockuean',
    ],
    correctIndex: 1,
    explanation:
      'La filosofía de Testing Library: "Cuanto más se parezcan tus tests a cómo el software es usado, más confianza te darán." Los tests deben interactuar con la UI como lo haría un usuario real.',
  },
  {
    id: 's3-q3',
    question: '¿Qué hace Testing Library automáticamente después de cada test?',
    options: [
      'Guarda un snapshot',
      'Reinicia el estado de React',
      'Desmonta (cleanup) el DOM renderizado',
      'Corre el linter',
    ],
    correctIndex: 2,
    explanation:
      'Testing Library ejecuta cleanup() automáticamente después de cada test, desmontando el componente y limpiando el DOM. Esto evita contaminación entre tests.',
  },
]

export const s3SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s3-primer-componente/' },
  { type: 'info', text: 'Counter.test.tsx' },
  { type: 'pass', text: 'Renderizado inicial > debería renderizar el valor inicial por defecto (0)' },
  { type: 'pass', text: 'Renderizado inicial > debería renderizar el valor initial pasado como prop' },
  { type: 'pass', text: 'Renderizado inicial > debería renderizar los tres botones de acción' },
  { type: 'pass', text: 'Interacciones > debería incrementar el contador al hacer clic en +' },
  { type: 'pass', text: 'Interacciones > debería decrementar el contador al hacer clic en −' },
  { type: 'pass', text: 'Interacciones > debería reiniciar al valor inicial al hacer clic en ↺' },
  { type: 'pass', text: 'Con límites > no debería bajar del mínimo definido' },
  { type: 'pass', text: 'Con límites > no debería superar el máximo definido' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  1 passed (1)  |  Tests  10 passed' },
]
