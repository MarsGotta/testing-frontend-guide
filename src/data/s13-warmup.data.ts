import type { QuizQuestion } from '../types/guide.types'

/* ── Tres recordatorios del Taller 1 ─────────────────────── */

export const s13AAAReminder = `// El patrón AAA · la columna vertebral de cualquier test
it('incrementa el contador al hacer click', async () => {
  // ── Arrange · preparar el estado inicial ─────────────
  const user = userEvent.setup()
  render(<Counter initialValue={0} />)

  // ── Act · ejecutar la acción ─────────────────────────
  await user.click(screen.getByRole('button', { name: /incrementar/i }))

  // ── Assert · verificar el resultado ──────────────────
  expect(screen.getByTestId('count')).toHaveTextContent('1')
})`

export const s13UserEventReminder = `// userEvent 14 · siempre con setup() y siempre con await
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('envía el formulario', async () => {
  const user = userEvent.setup()   // ← UNA VEZ al principio
  render(<LoginForm />)

  // Cada interacción devuelve Promise. Olvidarse del await
  // hace que el test pase sin haber interactuado.
  await user.type(screen.getByLabelText(/email/i), 'ana@test.com')
  await user.click(screen.getByRole('button', { name: /entrar/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent(/bienvenida/i)
})`

export const s13MocksReminder = `// vi.fn y vi.spyOn · los dos bloques de construcción
import { vi, describe, it, expect } from 'vitest'

// vi.fn() · una función espía pura
const onSubmit = vi.fn()
render(<Form onSubmit={onSubmit} />)
// ... interacción ...
expect(onSubmit).toHaveBeenCalledWith({ email: 'ana@test.com' })

// vi.spyOn(obj, 'method') · espía preservando el original
const logger = { log: (msg) => console.log(msg) }
const spy = vi.spyOn(logger, 'log')
logger.log('hola')
expect(spy).toHaveBeenCalledWith('hola')
// El método original sigue ejecutándose (callThrough por defecto)

// Mock de retorno
spy.mockReturnValue('overridden')
// Mock de implementación
spy.mockImplementation((msg) => \`prefix: \${msg}\`)`

/* ── Las 4 palancas del Taller 2 ─────────────────────────── */

export interface LeverCard {
  id: string
  icon: string
  number: string
  title: string
  tagline: string
  description: string
  color: string
}

export const s13FourLevers: LeverCard[] = [
  {
    id: 'async',
    icon: '⏱️',
    number: '1',
    title: 'Dominar la asincronía',
    tagline: 'Fake timers, debounce y race conditions',
    description:
      'El dolor nº 1 en el día a día. Tests flaky, timeouts misteriosos, assertions que no corren. Hay cuatro herramientas y un patrón para cada situación.',
    color: 'border-purple-500/40 bg-purple-500/5',
  },
  {
    id: 'mocks',
    icon: '🎯',
    number: '2',
    title: 'Mocking avanzado',
    tagline: 'vi.mock, vi.hoisted y aislamiento real',
    description:
      'Aislar un componente o hook de sus dependencias (HTTP, stores, router) sin tests frágiles. El gotcha del hoisting, los anti-patrones de over-mocking y el reset automático.',
    color: 'border-blue-500/40 bg-blue-500/5',
  },
  {
    id: 'migration',
    icon: '🚀',
    number: '3',
    title: 'Migración Jasmine → Vitest',
    tagline: 'La chuleta de equivalencias y qué migra el schematic',
    description:
      'Karma deprecado, Vitest por defecto en Angular 21. Las equivalencias idiomáticas son mecánicas el 90 % del tiempo. Los patrones que el schematic NO migra son los que hay que conocer.',
    color: 'border-emerald-500/40 bg-emerald-500/5',
  },
  {
    id: 'stryker',
    icon: '🧬',
    number: '4',
    title: 'Mutation Testing con Stryker',
    tagline: 'Coverage miente, mutation score mide',
    description:
      'Tu suite puede tener 100 % de coverage y mutation score del 30 %. Stryker rompe tu código y verifica si los tests lo cazan. El roadmap por fases para pasar de 22 % a 60 %+ de forma sistemática.',
    color: 'border-yellow-500/40 bg-yellow-500/5',
  },
]

/* ── Comparativa visual Vitest vs Karma ──────────────────── */

export const s13RunnerComparison = [
  {
    metric: 'Arranque antes del primer test',
    karma: '~8 s (levanta ChromeHeadless)',
    vitest: '~0 s (proceso Node)',
    winner: 'vitest' as const,
  },
  {
    metric: 'Ejecución de la suite completa',
    karma: '~0.5 s · 237 tests',
    vitest: '~2.1 s · 240 tests',
    winner: 'neutral' as const,
  },
  {
    metric: 'Watch mode · tras editar un test',
    karma: 'relanza el navegador',
    vitest: 'HMR instantáneo · <100 ms',
    winner: 'vitest' as const,
  },
  {
    metric: 'Módulos ESM modernos',
    karma: 'webpack requiere config manual',
    vitest: 'Vite · nativo',
    winner: 'vitest' as const,
  },
  {
    metric: 'Mocking de módulos',
    karma: 'no existe vi.mock',
    vitest: 'vi.mock + vi.hoisted',
    winner: 'vitest' as const,
  },
  {
    metric: 'Fake timers + Promises',
    karma: 'jasmine.clock + flushMicrotasks manual',
    vitest: 'advanceTimersByTimeAsync · una línea',
    winner: 'vitest' as const,
  },
]

/* ── Quiz de calentamiento ───────────────────────────────── */

export const s13Quiz: QuizQuestion[] = [
  {
    id: 's13-q1',
    question:
      '¿Cuál de estas NO es una de las 4 palancas del Taller Avanzado?',
    options: [
      'Dominar la asincronía',
      'Mocking avanzado',
      'Snapshot testing',
      'Mutation testing con Stryker',
    ],
    correctIndex: 2,
    explanation:
      'Snapshot testing es contenido del Taller 1 (fundamentos). Las 4 palancas del Taller 2 son: asincronía, mocking avanzado, migración Jasmine→Vitest y mutation testing.',
  },
  {
    id: 's13-q2',
    question:
      'En userEvent 14, ¿qué pasa si olvidas el `await` en `user.click(boton)`?',
    options: [
      'El test falla con un error claro',
      'React lanza un warning automático',
      'El click queda pendiente, el test sigue y las assertions corren antes de tiempo',
      'userEvent ejecuta el click en el siguiente tick automáticamente',
    ],
    correctIndex: 2,
    explanation:
      'userEvent 14 es completamente async. Sin await, la Promise se queda colgada; el flujo del test continúa y los expect corren antes de que el click se haya producido. Es la causa nº 1 de tests que "pasan" sin probar nada.',
  },
  {
    id: 's13-q3',
    question:
      '¿Cuál es la diferencia entre `vi.fn()` y `vi.spyOn(obj, "method")`?',
    options: [
      'Son alias, hacen lo mismo',
      '`vi.fn()` crea una función espía nueva; `vi.spyOn` envuelve un método existente preservando su implementación original',
      '`vi.fn` solo funciona en TypeScript',
      '`vi.spyOn` solo sirve para métodos estáticos',
    ],
    correctIndex: 1,
    explanation:
      '`vi.fn()` crea una función espía desde cero (sin implementación por defecto). `vi.spyOn(obj, "method")` envuelve un método existente de un objeto, con callThrough por defecto (se ejecuta el real). Para cambiar el retorno: `.mockReturnValue(x)` o `.mockImplementation(fn)`.',
  },
]
