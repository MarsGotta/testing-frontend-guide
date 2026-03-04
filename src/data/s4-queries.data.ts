import type { QuizQuestion, OutputLine } from '../types/guide.types'

import todoListExampleRaw from '../tests/examples/TodoList.tsx?raw'
import todoListTestRaw from '../tests/s4-queries/TodoList.test.tsx?raw'
import getByTestRaw from '../tests/s4-queries/queries-getBy.test.tsx?raw'
import queryByTestRaw from '../tests/s4-queries/queries-queryBy.test.tsx?raw'
import findByTestRaw from '../tests/s4-queries/queries-findBy.test.tsx?raw'

export const s4TodoListCode = todoListExampleRaw
export const s4TodoListTestCode = todoListTestRaw
export const s4GetByCode = getByTestRaw
export const s4QueryByCode = queryByTestRaw
export const s4FindByCode = findByTestRaw

export const s4QueryTable = [
  {
    prefix: 'getBy*',
    sync: true,
    multiple: false,
    notFound: '❌ Lanza error',
    multiple2: '❌ Lanza error',
    useCase: 'El elemento DEBE existir ahora',
    example: 'getByRole, getByLabelText, getByText',
  },
  {
    prefix: 'queryBy*',
    sync: true,
    multiple: false,
    notFound: '→ null',
    multiple2: '❌ Lanza error',
    useCase: 'Verificar que algo NO está en el DOM',
    example: 'queryByRole, queryByText',
  },
  {
    prefix: 'findBy*',
    sync: false,
    multiple: false,
    notFound: '❌ Rechaza la Promise',
    multiple2: '❌ Rechaza la Promise',
    useCase: 'El elemento APARECERÁ de forma asíncrona',
    example: 'findByRole, findByText',
  },
  {
    prefix: 'getAllBy*',
    sync: true,
    multiple: true,
    notFound: '❌ Lanza error',
    multiple2: '→ Array',
    useCase: 'Múltiples elementos que DEBEN existir',
    example: 'getAllByRole, getAllByText',
  },
  {
    prefix: 'queryAllBy*',
    sync: true,
    multiple: true,
    notFound: '→ []',
    multiple2: '→ Array',
    useCase: 'Múltiples elementos que pueden no existir',
    example: 'queryAllByRole',
  },
]

export const s4QueryPriority = `// Jerarquía de queries (de más a menos preferida)
// 1. getByRole         → semántica HTML/ARIA
screen.getByRole('button', { name: /guardar/i })

// 2. getByLabelText    → inputs con label
screen.getByLabelText(/nombre/i)

// 3. getByPlaceholderText → evitar si hay label
screen.getByPlaceholderText(/escribe aquí/i)

// 4. getByText         → texto visible
screen.getByText(/iniciar sesión/i)

// 5. getByDisplayValue → valor actual de input/select
screen.getByDisplayValue('admin@empresa.com')

// 6. getByAltText      → imágenes
screen.getByAltText(/logo de la empresa/i)

// 7. getByTitle        → atributo title
screen.getByTitle(/cerrar ventana/i)

// 8. getByTestId       → ÚLTIMO RECURSO
screen.getByTestId('precio-total')`

export const s4WithinExample = `// within() acota la búsqueda a un nodo específico
import { within } from '@testing-library/react'

const lista = screen.getByRole('list', { name: /tareas/i })
const items = within(lista).getAllByRole('listitem')

// Busca dentro del primer item, no en todo el DOM
const primerItem = items[0]
within(primerItem).getByRole('button', { name: /eliminar/i })`

export const s4Quiz: QuizQuestion[] = [
  {
    id: 's4-q1',
    question: '¿Qué query usarías para verificar que un mensaje de error NO aparece después de una acción válida?',
    options: [
      'getByText(/error/i)',
      'queryByText(/error/i)',
      'findByText(/error/i)',
      'getAllByText(/error/i)',
    ],
    correctIndex: 1,
    explanation:
      'queryByText (y queryBy* en general) retorna null en lugar de lanzar un error cuando el elemento no existe. Es la correcta para verificar ausencia con not.toBeInTheDocument().',
  },
  {
    id: 's4-q2',
    question: '¿Cuál es la query con MAYOR prioridad según Testing Library?',
    options: ['getByTestId', 'getByText', 'getByRole', 'getByClassName'],
    correctIndex: 2,
    explanation:
      'getByRole es la query preferida porque usa la semántica HTML y los roles ARIA, reflejando cómo los usuarios y las tecnologías de asistencia perciben el DOM.',
  },
  {
    id: 's4-q3',
    question: '¿Cuándo deberías usar findBy* en lugar de getBy*?',
    options: [
      'Cuando el elemento tiene un data-testid',
      'Cuando el elemento es un formulario',
      'Cuando el elemento aparece después de una operación asíncrona',
      'Cuando hay múltiples elementos del mismo tipo',
    ],
    correctIndex: 2,
    explanation:
      'findBy* retorna una Promise que espera a que el elemento aparezca. Úsalo para elementos que se muestran después de peticiones HTTP, timers, o cualquier operación async.',
  },
]

export const s4SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s4-queries/' },
  { type: 'info', text: 'queries-getBy.test.tsx' },
  { type: 'pass', text: 'getByRole — la query PREFERIDA (semántica HTML/ARIA)' },
  { type: 'pass', text: 'getByLabelText — para inputs con label asociado' },
  { type: 'pass', text: 'getByTestId — ÚLTIMO RECURSO cuando nada más funciona' },
  { type: 'info', text: 'queries-queryBy.test.tsx' },
  { type: 'pass', text: 'queryBy* > retorna null cuando el elemento no está en el DOM' },
  { type: 'info', text: 'queries-findBy.test.tsx' },
  { type: 'pass', text: 'findBy* > espera a que el elemento aparezca (await es necesario)' },
  { type: 'info', text: 'TodoList.test.tsx' },
  { type: 'pass', text: 'TodoList > debería mostrar todas las tareas iniciales' },
  { type: 'pass', text: 'TodoList > Agregar tareas > debería agregar una nueva tarea' },
  { type: 'pass', text: 'TodoList > Filtros > debería mostrar solo las pendientes' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  4 passed (4)  |  Tests  29 passed' },
]
