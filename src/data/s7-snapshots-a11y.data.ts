import type { QuizQuestion, OutputLine } from '../types/guide.types'

import accessibleFormRaw from '../tests/examples/AccessibleForm.tsx?raw'
import inlineSnapshotTestRaw from '../tests/s7-snapshots/inline-snapshot.test.tsx?raw'
import a11yTestRaw from '../tests/s7-snapshots/a11y.test.tsx?raw'

export const s7AccessibleFormCode = accessibleFormRaw
export const s7InlineSnapshotCode = inlineSnapshotTestRaw
export const s7A11yTestCode = a11yTestRaw

export const s7InlineSnapshotExample = `// Inline snapshot — pequeño, junto al test
it('debería renderizar el precio correctamente', () => {
  const { getByTestId } = render(<PrecioDisplay valor={29.99} />)

  expect(getByTestId('precio').textContent).toMatchInlineSnapshot(
    '"29,99 €"'
  )
})

// Se actualiza con: vitest run --update-snapshots`

export const s7FileSnapshotWarning = `// ❌ Snapshot de archivo — EVITAR en la mayoría de casos
it('debería renderizar el componente', () => {
  const { container } = render(<MiComponente />)
  expect(container).toMatchSnapshot()
  // Genera un archivo .snap que cualquier cambio de espaciado rompe
  // Difícil de revisar en code review
  // Fácil de actualizar sin pensar: vitest -u
})`

export const s7A11yAxeExample = `// jest-axe detecta violaciones WCAG automáticamente
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('no debería tener violaciones de accesibilidad', async () => {
  const { container } = render(<MiFormulario />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

// Violaciones que detecta:
// - Imágenes sin alt → rule: "image-alt"
// - Inputs sin label → rule: "label"
// - Contraste insuficiente → rule: "color-contrast"
// - Headings mal ordenados → rule: "heading-order"
// - Botones sin nombre → rule: "button-name"`

export const s7A11yBadGood = {
  bad: `// ❌ Formulario sin accesibilidad
function BadForm() {
  return (
    <div>
      <div>Nombre</div>
      <input type="text" />  {/* Sin label asociado */}
      <img src="/foto.jpg" /> {/* Sin alt */}
      <div onClick={handleSave}>Guardar</div> {/* div en vez de button */}
    </div>
  )
}`,
  good: `// ✅ Formulario accesible
function GoodForm() {
  return (
    <form aria-label="Formulario de contacto">
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" type="text" aria-required="true" />
      <img src="/foto.jpg" alt="Foto del perfil" />
      <button type="submit">Guardar</button>
    </form>
  )
}`,
}

export const s7Quiz: QuizQuestion[] = [
  {
    id: 's7-q1',
    question: '¿Cuál es la principal ventaja de los snapshots INLINE frente a los de archivo?',
    options: [
      'Son más rápidos de ejecutar',
      'Viven junto al test y son más fáciles de revisar en code review',
      'Capturan más información del DOM',
      'Son más fáciles de actualizar',
    ],
    correctIndex: 1,
    explanation:
      'Los snapshots inline viven en el mismo archivo del test. Son visibles en code review, fáciles de entender y fuerzan a mantenerlos pequeños y significativos.',
  },
  {
    id: 's7-q2',
    question: '¿Qué detecta jest-axe automáticamente?',
    options: [
      'Errores de JavaScript en tiempo de ejecución',
      'Violaciones de las guías de accesibilidad WCAG',
      'Problemas de rendimiento del componente',
      'Errores de tipado TypeScript',
    ],
    correctIndex: 1,
    explanation:
      'jest-axe usa axe-core para detectar violaciones de accesibilidad: imágenes sin alt, inputs sin label, contraste insuficiente, roles ARIA incorrectos y mucho más.',
  },
  {
    id: 's7-q3',
    question: '¿Qué elemento de HTML tiene MEJOR soporte de accesibilidad para acciones de clic?',
    options: [
      '<div onClick={...}>',
      '<span onClick={...}>',
      '<button type="button">',
      'Cualquiera con role="button"',
    ],
    correctIndex: 2,
    explanation:
      'El elemento <button> tiene soporte nativo de teclado (Enter, Space), rol ARIA correcto, y es reconocido por lectores de pantalla. Los <div> con onClick requieren configuración adicional para ser accesibles.',
  },
]

export const s7SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s7-snapshots/' },
  { type: 'info', text: 'inline-snapshot.test.tsx' },
  { type: 'pass', text: 'Counter debería renderizar el valor inicial en el snapshot' },
  { type: 'pass', text: 'BUENO: snapshot de un elemento específico y estable' },
  { type: 'info', text: 'a11y.test.tsx' },
  { type: 'pass', text: 'AccessibleForm no debería tener violaciones de accesibilidad' },
  { type: 'pass', text: 'Counter no debería tener violaciones de accesibilidad' },
  { type: 'pass', text: 'imagen sin alt → viola rule: image-alt (1 violation found)' },
  { type: 'pass', text: 'imagen con alt correctamente NO tiene violaciones' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)  |  Tests  10 passed' },
]
