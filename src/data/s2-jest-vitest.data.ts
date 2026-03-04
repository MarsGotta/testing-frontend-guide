import type { QuizQuestion, OutputLine } from '../types/guide.types'

import matchersTestRaw from '../tests/s2-jest-vitest/matchers.test.ts?raw'
import lifecycleTestRaw from '../tests/s2-jest-vitest/lifecycle.test.ts?raw'

export const s2MatchersTestCode = matchersTestRaw
export const s2LifecycleTestCode = lifecycleTestRaw

export const s2VitestConfig = `// vitest.config.ts (Vitest 4 + Vite 7)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,        // describe, it, expect disponibles sin import
    environment: 'jsdom', // DOM simulado para React
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',     // Vitest 4 usa AST-based remapping (más preciso)
      reporter: ['text', 'html'],
      thresholds: { statements: 80, branches: 70 },
    },
  },
})`

export const s2JestConfig = `// jest.config.js (para proyectos legacy con Webpack)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./src/tests/setup.ts'],
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest',
  },
  // Nota: CRA (Create React App) está deprecado desde 2023.
  // Para proyectos nuevos se recomienda Vite, Next.js o Remix.
}`

export const s2SetupFile = `// src/tests/setup.ts
import '@testing-library/jest-dom'

// Silencia warnings de React act() en tests asíncronos
const originalError = console.error.bind(console.error)
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    if (
      msg.includes('Warning: An update to') ||
      msg.includes('Warning: act(') ||
      msg.includes('not wrapped in act')
    ) return
    originalError(...args)
  }
})
afterAll(() => { console.error = originalError })`

export const s2PackageScripts = `{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}`

export const s2Quiz: QuizQuestion[] = [
  {
    id: 's2-q1',
    question: '¿Cuál es la principal ventaja de Vitest frente a Jest en proyectos con Vite?',
    options: [
      'Vitest tiene más matchers que Jest',
      'Vitest reutiliza la configuración de Vite (más rápido, sin configuración extra)',
      'Vitest soporta TypeScript y Jest no',
      'Vitest no necesita jsdom',
    ],
    correctIndex: 1,
    explanation:
      'Vitest está diseñado para funcionar con Vite: reutiliza el mismo bundler y configuración, lo que lo hace más rápido de arrancar y de ejecutar que Jest en proyectos Vite.',
  },
  {
    id: 's2-q2',
    question: '¿Qué matcher usarías para comparar dos OBJETOS por su valor (no por referencia)?',
    options: ['toBe()', 'toEqual()', 'toMatch()', 'toBeTruthy()'],
    correctIndex: 1,
    explanation:
      'toBe() compara con === (referencia). toEqual() hace comparación profunda por valor, ideal para objetos y arrays donde lo que importa es el contenido, no la instancia.',
  },
  {
    id: 's2-q3',
    question: '¿Cuándo se ejecuta el beforeEach en un describe anidado?',
    options: [
      'Solo se ejecuta el beforeEach del bloque anidado',
      'Solo se ejecuta el beforeEach del bloque padre',
      'Primero el padre, luego el del bloque anidado',
      'En orden aleatorio',
    ],
    correctIndex: 2,
    explanation:
      'Los hooks de ciclo de vida se ejecutan en orden de dentro a fuera para afterEach/afterAll, y de fuera a dentro para beforeEach/beforeAll. El padre siempre va primero en beforeEach.',
  },
]

export const s2SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s2-jest-vitest/' },
  { type: 'info', text: 'matchers.test.ts' },
  { type: 'pass', text: 'Matchers de igualdad > toBe — compara primitivos con ===' },
  { type: 'pass', text: 'Matchers de igualdad > toEqual — compara objetos por valor' },
  { type: 'pass', text: 'Matchers de veracidad > toBeTruthy — cualquier valor truthy' },
  { type: 'pass', text: 'Matchers numéricos > toBeGreaterThan / toBeLessThan' },
  { type: 'pass', text: 'Matchers de errores > toThrow con mensaje' },
  { type: 'info', text: 'lifecycle.test.ts' },
  { type: 'pass', text: 'Ciclo de vida > debería tener 2 usuarios después del beforeEach' },
  { type: 'pass', text: 'filtrado > debería tener 3 usuarios (2 del padre + 1 del hijo)' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)  |  Tests  25 passed' },
]
