/**
 * S1 — Anatomía de un Test
 *
 * Demuestra:
 *  - Nombres en 3 partes: componente / escenario / resultado esperado
 *  - Patrón AAA (Ajustar – Actuar – Afirmar)
 *  - Aserciones BDD con expect()
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from '../examples/Counter'

// ─── Estructura de nombre: [Componente] cuando [escenario] debería [resultado] ───

describe('Counter', () => {
  describe('cuando se renderiza sin props', () => {
    it('debería mostrar el valor inicial 0', () => {
      // ── Ajustar (Arrange) ──────────────────────────────────────────
      render(<Counter />)

      // ── Actuar (Act) ───────────────────────────────────────────────
      // (sin acción: solo verificamos el estado inicial)

      // ── Afirmar (Assert) ───────────────────────────────────────────
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })
  })

  describe('cuando se pasa initialValue={5}', () => {
    it('debería mostrar 5 como valor inicial', () => {
      // ── Ajustar ────────────────────────────────────────────────────
      render(<Counter initialValue={5} />)

      // ── Actuar ─────────────────────────────────────────────────────
      // (sin acción)

      // ── Afirmar ────────────────────────────────────────────────────
      expect(screen.getByTestId('count-display')).toHaveTextContent('5')
    })
  })

  describe('cuando el usuario hace clic en Incrementar', () => {
    it('debería mostrar el valor incrementado en 1', async () => {
      // ── Ajustar ────────────────────────────────────────────────────
      const user = userEvent.setup()
      render(<Counter initialValue={3} />)

      // ── Actuar ─────────────────────────────────────────────────────
      await user.click(screen.getByRole('button', { name: /incrementar/i }))

      // ── Afirmar ────────────────────────────────────────────────────
      expect(screen.getByTestId('count-display')).toHaveTextContent('4')
    })
  })

  describe('cuando el usuario hace clic en Decrementar', () => {
    it('debería mostrar el valor decrementado en 1', async () => {
      // ── Ajustar ────────────────────────────────────────────────────
      const user = userEvent.setup()
      render(<Counter initialValue={10} />)

      // ── Actuar ─────────────────────────────────────────────────────
      await user.click(screen.getByRole('button', { name: /decrementar/i }))

      // ── Afirmar ────────────────────────────────────────────────────
      expect(screen.getByTestId('count-display')).toHaveTextContent('9')
    })
  })

  describe('cuando el usuario hace clic en Reiniciar después de incrementar', () => {
    it('debería volver al valor initial', async () => {
      // ── Ajustar ────────────────────────────────────────────────────
      const user = userEvent.setup()
      render(<Counter initialValue={0} />)

      // ── Actuar ─────────────────────────────────────────────────────
      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /reiniciar/i }))

      // ── Afirmar ────────────────────────────────────────────────────
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })
  })

  describe('cuando se define un máximo y el contador llega a ese límite', () => {
    it('debería desactivar el botón de incrementar', async () => {
      // ── Ajustar ────────────────────────────────────────────────────
      const user = userEvent.setup()
      render(<Counter initialValue={9} max={10} />)

      // ── Actuar ─────────────────────────────────────────────────────
      await user.click(screen.getByRole('button', { name: /incrementar/i }))

      // ── Afirmar ────────────────────────────────────────────────────
      expect(screen.getByRole('button', { name: /incrementar/i })).toBeDisabled()
    })
  })
})
