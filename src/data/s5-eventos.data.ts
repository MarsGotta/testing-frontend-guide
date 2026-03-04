import type { QuizQuestion, OutputLine } from '../types/guide.types'

import loginFormExampleRaw from '../tests/examples/LoginForm.tsx?raw'
import loginFormTestRaw from '../tests/s5-eventos/LoginForm.test.tsx?raw'
import userEventTestRaw from '../tests/s5-eventos/userEvent.test.tsx?raw'

export const s5LoginFormCode = loginFormExampleRaw
export const s5LoginFormTestCode = loginFormTestRaw
export const s5UserEventTestCode = userEventTestRaw

export const s5UserEventExample = `// userEvent — simula el flujo REAL del usuario
import userEvent from '@testing-library/user-event'

// Siempre inicializar con setup() (v14+)
const user = userEvent.setup()

// type() simula: focus → keydown → keypress → change → keyup
await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')

// click() simula: mouseenter → mouseover → mousedown → focus → mouseup → click
await user.click(screen.getByRole('button', { name: /guardar/i }))

// keyboard() para teclas especiales
await user.keyboard('{Tab}{Enter}')

// selectOptions() para selects
await user.selectOptions(screen.getByRole('combobox'), 'opcion-2')`

export const s5FireEventExample = `// fireEvent — despacha UN solo evento DOM (comparativa)
import { fireEvent } from '@testing-library/react'

// Solo dispara el evento 'change', NO simula focus/blur/keydown
fireEvent.change(input, { target: { value: 'ana@ejemplo.com' } })

// fireEvent.click solo dispara el click event
fireEvent.click(button)

// ¿Cuándo usar fireEvent?
// - Para eventos que userEvent no soporta (ej: events personalizados)
// - Para simular condiciones de borde muy específicas
// - En general: PREFIERE userEvent sobre fireEvent`

export const s5UserVsFireComparison = `// ── Con userEvent (recomendado) ──────────────────────────────
const user = userEvent.setup()
await user.type(screen.getByLabelText(/nombre/i), 'Ana')
// Simula: focus, keydown×3, keypress×3, input×3, keyup×3, change×3

// ── Con fireEvent (básico) ────────────────────────────────────
fireEvent.change(screen.getByLabelText(/nombre/i), {
  target: { value: 'Ana' }
})
// Solo dispara: change`

export const s5Quiz: QuizQuestion[] = [
  {
    id: 's5-q1',
    question: '¿Por qué se recomienda userEvent sobre fireEvent para la mayoría de tests?',
    options: [
      'Porque userEvent es más rápido',
      'Porque userEvent simula la secuencia completa de eventos del navegador',
      'Porque fireEvent no funciona con React',
      'Porque userEvent tiene más matchers',
    ],
    correctIndex: 1,
    explanation:
      'userEvent simula cómo un usuario real interactúa: type() dispara focus, keydown, keypress, change, keyup en el orden correcto. fireEvent solo dispara un evento aislado, lo que puede dar falsos positivos.',
  },
  {
    id: 's5-q2',
    question: '¿Cómo se inicializa correctamente userEvent en su versión 14?',
    options: [
      'import userEvent from "@testing-library/user-event"',
      'const user = userEvent.setup(); y luego await user.click()',
      'userEvent.click(element)',
      'new UserEvent()',
    ],
    correctIndex: 1,
    explanation:
      'En userEvent v14, debes llamar a userEvent.setup() para obtener una instancia con el contexto del test. Luego usas await user.click(), await user.type(), etc.',
  },
  {
    id: 's5-q3',
    question: 'Si una función onSubmit es un mock que rechaza con error, ¿qué query usarías para esperar el mensaje de error?',
    options: [
      'getByRole("alert")',
      'queryByRole("alert")',
      'findByRole("alert")',
      'getAllByRole("alert")',
    ],
    correctIndex: 2,
    explanation:
      'El mensaje de error aparece después de que la Promise rechace (operación asíncrona), por lo que necesitas findByRole que espera a que el elemento aparezca. getByRole fallaría porque busca de forma síncrona.',
  },
]

export const s5SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s5-eventos/' },
  { type: 'info', text: 'userEvent.test.tsx' },
  { type: 'pass', text: 'userEvent > type dispara focus, keydown, keyup, change en el orden correcto' },
  { type: 'pass', text: 'userEvent > click en checkbox lo marca y desmarca correctamente' },
  { type: 'pass', text: 'userEvent > tab navega entre elementos enfocables' },
  { type: 'info', text: 'LoginForm.test.tsx' },
  { type: 'pass', text: 'LoginForm > debería llamar a onSubmit con email y contraseña' },
  { type: 'pass', text: 'LoginForm > debería mostrar mensaje de éxito tras iniciar sesión' },
  { type: 'pass', text: 'LoginForm > debería mostrar error si el email está vacío' },
  { type: 'pass', text: 'LoginForm > debería mostrar el mensaje de error del servidor' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)  |  Tests  12 passed' },
]
