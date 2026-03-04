import type { QuizQuestion, OutputLine } from '../types/guide.types'

export const s0Quiz: QuizQuestion[] = [
  {
    id: 's0-q1',
    question: '¿Qué tipo de tests debería haber en mayor cantidad según la pirámide de testing?',
    options: [
      'Tests End-to-End (E2E)',
      'Tests de integración',
      'Tests unitarios',
      'Tests manuales',
    ],
    correctIndex: 2,
    explanation:
      'Los tests unitarios forman la BASE de la pirámide: son los más baratos de escribir y ejecutar, los más rápidos y deben ser los más numerosos.',
  },
  {
    id: 's0-q2',
    question: '¿Por qué los tests End-to-End (E2E) están en la CIMA de la pirámide?',
    options: [
      'Porque son los más importantes',
      'Porque son los más lentos, costosos y frágiles',
      'Porque prueban más código',
      'Porque son los más fáciles de escribir',
    ],
    correctIndex: 1,
    explanation:
      'Los tests E2E simulan el navegador completo, son lentos, caros de mantener y frágiles ante cambios de UI. Por eso deben ser pocos y solo cubrir los flujos críticos.',
  },
  {
    id: 's0-q3',
    question: '¿Qué ventaja aportan los tests de integración sobre los unitarios?',
    options: [
      'Son más rápidos',
      'Son más fáciles de escribir',
      'Detectan problemas entre capas del sistema',
      'No necesitan configuración',
    ],
    correctIndex: 2,
    explanation:
      'Los tests de integración prueban cómo colaboran varias partes del sistema (ej: componente + API + store). Detectan problemas que los unitarios no ven porque prueban cada pieza por separado.',
  },
]

export const s0SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run' },
  { type: 'info', text: 'src/tests/s1-anatomy/utils.test.ts' },
  { type: 'pass', text: 'sumar debería retornar la suma de dos números' },
  { type: 'pass', text: 'capitalizar debería poner en mayúscula la primera letra' },
  { type: 'pass', text: 'dividir debería retornar el cociente' },
  { type: 'info', text: 'src/tests/s3-primer-componente/Counter.test.tsx' },
  { type: 'pass', text: 'Counter renderiza el valor inicial' },
  { type: 'pass', text: 'Counter incrementa al hacer clic' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)' },
  { type: 'summary', text: 'Tests       5 passed (5)' },
  { type: 'summary', text: 'Duration    0.89s' },
]
