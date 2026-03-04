/**
 * S7 — Tests de Accesibilidad con jest-axe
 *
 * axe detecta violaciones de WCAG automáticamente:
 * - Imágenes sin alt
 * - Inputs sin label
 * - Contraste insuficiente
 * - Roles ARIA incorrectos
 * - Estructura de encabezados incorrecta
 */
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AccessibleForm } from '../examples/AccessibleForm'
import { TodoList } from '../examples/TodoList'
import { Counter } from '../examples/Counter'

// Extiende expect con el matcher de jest-axe
expect.extend(toHaveNoViolations)

describe('Accesibilidad con jest-axe', () => {
  it('AccessibleForm no debería tener violaciones de accesibilidad', async () => {
    const { container } = render(<AccessibleForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('TodoList no debería tener violaciones de accesibilidad', async () => {
    const { container } = render(
      <TodoList
        initialTodos={[
          { id: 1, text: 'Tarea de prueba', done: false },
        ]}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Counter no debería tener violaciones de accesibilidad', async () => {
    const { container } = render(<Counter initialValue={0} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('Violaciones de accesibilidad comunes', () => {
  it('imagen sin alt tiene violación de accesibilidad', async () => {
    const BadImage = () => (
      <div>
        <img src="/foto.jpg" /> {/* ¡Sin alt! */}
      </div>
    )

    const { container } = render(<BadImage />)
    const results = await axe(container)

    // Verificamos que SÍ hay violaciones (para demostrar el problema)
    expect(results.violations.length).toBeGreaterThan(0)
    expect(results.violations[0].id).toBe('image-alt')
  })

  it('input sin label (ni placeholder) tiene violación de accesibilidad', async () => {
    // Un input sin ningún tipo de nombre accesible viola WCAG 1.3.1
    const BadInput = () => (
      <div>
        <input type="text" /> {/* ¡Sin label, sin aria-label, sin placeholder! */}
      </div>
    )

    const { container } = render(<BadInput />)
    const results = await axe(container)

    expect(results.violations.length).toBeGreaterThan(0)
    const violationIds = results.violations.map((v) => v.id)
    expect(violationIds.some((id) => /label/i.test(id))).toBe(true)
  })

  it('imagen con alt correctamente NO tiene violaciones', async () => {
    const GoodImage = () => (
      <div>
        <img src="/foto.jpg" alt="Foto de perfil del usuario" />
      </div>
    )

    const { container } = render(<GoodImage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
