import type { QuizQuestion, OutputLine } from '../types/guide.types'

import coverageTestRaw from '../tests/s8-buenas-practicas/coverage-demo.test.ts?raw'

export const s8CoverageTestCode = coverageTestRaw

export const s8GoldenRule = `// La Regla de Oro del Testing
// "El código de los tests NO es como el código de producción —
//  diséñalo para que sea SIMPLE, CORTO y sin abstracciones innecesarias."
//                                              — Yoni Goldberg

// ❌ MAL: abstracciones excesivas en tests
function crearUsuarioConPermisos(overrides = {}) {
  return { id: 1, nombre: 'Test', rol: 'admin', activo: true, ...overrides }
}

// ✅ BIEN: datos inline y legibles directamente en el test
it('admin tiene permiso de eliminar', () => {
  const user = { id: 1, nombre: 'Ana', rol: 'admin', activo: true }
  expect(getPermissions(user)).toContain('delete')
})`

export const s8AntiPatterns = [
  {
    title: '❌ Datos tipo "foo"',
    bad: `it('debería guardar el usuario', async () => {
  await saveUser({ nombre: 'foo', email: 'bar@test.com' })
  // "foo" no es un email válido ni un nombre real
})`,
    good: `it('debería guardar el usuario', async () => {
  await saveUser({ nombre: 'Ana García', email: 'ana@empresa.com' })
  // Datos que reflejan casos de uso reales
})`,
    explanation: 'Usa datos realistas. "foo" y "bar" no aportan contexto y dificultan entender el propósito del test.',
  },
  {
    title: '❌ Capturar errores en vez de esperarlos',
    bad: `it('debería lanzar error con email vacío', () => {
  try {
    validarEmail('')
  } catch (e) {
    // ¿Y si nunca lanza? El test pasa igualmente
  }
})`,
    good: `it('debería lanzar error con email vacío', () => {
  expect(() => validarEmail('')).toThrow('Email obligatorio')
})`,
    explanation: 'Si capturas el error y no lo verificas, el test puede pasar aunque la función no lance nada.',
  },
  {
    title: '❌ Testear detalles de implementación',
    bad: `// ⚠️ Ejemplo con Enzyme (librería deprecada, NO usar en proyectos nuevos)
it('debería actualizar el estado interno', () => {
  const wrapper = shallow(<Counter />)
  wrapper.instance().setState({ count: 5 })
  expect(wrapper.state('count')).toBe(5)
})

// ⚠️ Otro ejemplo: espiar el estado interno del hook
it('debería llamar a setCount', () => {
  const spy = vi.spyOn(React, 'useState')
  render(<Counter />)
  expect(spy).toHaveBeenCalled() // Frágil: depende del hook
})`,
    good: `it('debería mostrar 5 después de 5 clics', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  for (let i = 0; i < 5; i++) {
    await user.click(screen.getByRole('button', { name: /incrementar/i }))
  }
  expect(screen.getByTestId('count-display')).toHaveTextContent('5')
})`,
    explanation: 'Enzyme está deprecado y no es compatible con React 18+. Testing Library es el estándar actual: testea el comportamiento visible, no la implementación interna. Los tests de implementación se rompen con refactors aunque el código funcione igual.',
  },
]

export const s8CoverageExample = `// Ejecutar cobertura
npm run coverage

// ----------|---------|----------|---------|---------|
// File      | % Stmts | % Branch | % Funcs | % Lines |
// ----------|---------|----------|---------|---------|
// Counter   |   95.23 |    87.50 |     100 |   95.23 |
// LoginForm |   88.46 |    80.00 |   85.71 |   88.46 |
// TodoList  |   91.30 |    83.33 |   88.88 |   91.30 |
// ----------|---------|----------|---------|---------|

// ✅ ~80% es un objetivo realista y saludable
// ❌ 100% puede ser contraproducente:
//    - Trivial getters/setters
//    - Código de manejo de errores imposible de alcanzar
//    - Código de terceros`

export const s8WhatNotToTest = `// ❌ NO testear: código de terceros
import { format } from 'date-fns'
// date-fns ya tiene sus propios tests

// ❌ NO testear: trivial getters
class Usuario {
  get nombre() { return this._nombre } // No necesita test
}

// ❌ NO testear: detalles de implementación
// Nunca accedas al estado interno de React (hooks, refs internas)
// Nunca espíes useState/useEffect — testea lo que el usuario VE

// ✅ SÍ testear: lógica de negocio
expect(calcularDescuento(100, 'VIP')).toBe(20)

// ✅ SÍ testear: comportamiento del componente desde perspectiva del usuario
expect(screen.getByText('Bienvenido, Ana')).toBeInTheDocument()
expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled()`

export const s8Quiz: QuizQuestion[] = [
  {
    id: 's8-q1',
    question: '¿Cuál es un objetivo realista de cobertura de código para un proyecto sano?',
    options: ['100% siempre', '~80%', '50% o menos', 'La cobertura no importa'],
    correctIndex: 1,
    explanation:
      'El 80% es un objetivo ampliamente aceptado. El 100% suele ser contraproducente: lleva a testear trivialidades, código de terceros y detalles de implementación que no aportan valor.',
  },
  {
    id: 's8-q2',
    question: '¿Qué es un antipatrón de "testear detalles de implementación"?',
    options: [
      'Verificar que el componente muestra el texto correcto',
      'Acceder directamente al estado interno de React o las instancias de componente',
      'Usar getByRole para buscar botones',
      'Testear con datos reales',
    ],
    correctIndex: 1,
    explanation:
      'Los tests de implementación (acceder a setState, espiar hooks, manipular instancias) se rompen con refactors aunque el comportamiento no cambie. Enzyme usaba estos patrones pero está deprecado. Testing Library promueve testear desde la perspectiva del usuario.',
  },
  {
    id: 's8-q3',
    question: 'Según la Regla de Oro del testing, ¿cómo debe ser el código de los tests?',
    options: [
      'Complejo, con abstracciones reutilizables',
      'Simple, corto y sin abstracciones innecesarias',
      'Con muchas clases y herencia',
      'Generado automáticamente',
    ],
    correctIndex: 1,
    explanation:
      'La regla de oro (Yoni Goldberg): el código de tests debe ser simple y legible a primera vista. Evita abstracciones excesivas: el test debe contar su historia de forma directa.',
  },
  {
    id: 's8-q4',
    question: '¿Por qué NO se recomienda capturar errores con try/catch en tests?',
    options: [
      'Porque el catch no funciona en tests',
      'Porque si la función nunca lanza, el test pasa igualmente sin detectar el problema',
      'Porque async/await no funciona con try/catch',
      'Por rendimiento',
    ],
    correctIndex: 1,
    explanation:
      'Si capturas un error pero no verificas nada dentro del catch, el test pasa aunque la función nunca lance. Lo correcto es expect(() => fn()).toThrow() o expect(promise).rejects.toThrow().',
  },
]

export const s8SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run --coverage' },
  { type: 'info', text: 'Running tests...' },
  { type: 'pass', text: 's8-buenas-practicas/coverage-demo.test.ts (10 tests)' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Coverage Report' },
  { type: 'summary', text: '---------------------------------------------------' },
  { type: 'pass', text: 'Counter.tsx          95.23 stmts | 87.50 branch | 100 funcs' },
  { type: 'pass', text: 'LoginForm.tsx        88.46 stmts | 80.00 branch | 85.71 funcs' },
  { type: 'pass', text: 'TodoList.tsx         91.30 stmts | 83.33 branch | 88.88 funcs' },
  { type: 'pass', text: 'FetchData.tsx        92.85 stmts | 75.00 branch | 100 funcs' },
  { type: 'summary', text: '---------------------------------------------------' },
  { type: 'pass', text: 'All thresholds met: statements(80%) branches(70%) ✓' },
  { type: 'summary', text: 'Test Files  16 passed (16)  |  Tests  132 passed (132)' },
]
