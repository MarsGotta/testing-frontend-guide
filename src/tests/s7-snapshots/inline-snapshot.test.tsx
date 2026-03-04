/**
 * S7 — Snapshots Inline
 *
 * Los snapshots inline son pequeños y viven junto al test.
 * Se actualizan con: vitest run --update-snapshots (o -u)
 *
 * REGLA: prefiere snapshots PEQUEÑOS y SIGNIFICATIVOS.
 * Evita snapshots del DOM completo (frágiles, difíciles de revisar).
 */
import { render } from '@testing-library/react'
import { Counter } from '../examples/Counter'
import { AccessibleForm } from '../examples/AccessibleForm'

describe('Snapshot inline — componentes pequeños', () => {
  it('Counter debería renderizar el valor inicial en el snapshot', () => {
    const { getByTestId } = render(<Counter initialValue={7} />)

    // Solo snapshot del elemento relevante, no del DOM completo
    expect(getByTestId('count-display')).toMatchInlineSnapshot(`
      <span
        aria-label="Contador: 7"
        aria-live="polite"
        class="text-4xl font-bold tabular-nums"
        data-testid="count-display"
      >
        7
      </span>
    `)
  })

  it('AccessibleForm debería tener la estructura del formulario en el snapshot', () => {
    const { getByRole } = render(<AccessibleForm />)

    const form = getByRole('form', { name: /formulario de contacto/i })
    expect(form.tagName).toMatchInlineSnapshot('"FORM"')
  })
})

describe('Cuándo usar snapshots y cuándo NO', () => {
  it('BUENO: snapshot de un elemento específico y estable', () => {
    const { getByTestId } = render(<Counter initialValue={0} />)

    // Snapshot de UN elemento concreto
    const display = getByTestId('count-display')
    expect(display.textContent).toMatchInlineSnapshot('"0"')
  })

  it('BUENO: snapshot de un texto o valor calculado', () => {
    const formatear = (n: number) => `${n.toLocaleString('es-ES')} €`

    expect(formatear(1234567)).toMatchInlineSnapshot('"1.234.567 €"')
  })
})
