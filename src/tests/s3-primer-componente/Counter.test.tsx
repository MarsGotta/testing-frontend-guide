/**
 * S3 — Tu Primer Componente con Testing Library
 *
 * Demuestra el flujo completo de RTL:
 *  render() → screen → userEvent → assertions con jest-dom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from '../examples/Counter'

describe('Counter — Primer test completo con RTL', () => {
  describe('Renderizado inicial', () => {
    it('debería renderizar el valor inicial por defecto (0)', () => {
      render(<Counter />)

      // getByTestId busca por data-testid — útil como último recurso
      expect(screen.getByTestId('count-display')).toBeInTheDocument()
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })

    it('debería renderizar el valor initial pasado como prop', () => {
      render(<Counter initialValue={42} />)
      expect(screen.getByTestId('count-display')).toHaveTextContent('42')
    })

    it('debería renderizar los tres botones de acción', () => {
      render(<Counter />)

      // getByRole + name es la forma preferida de Testing Library
      expect(screen.getByRole('button', { name: /decrementar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reiniciar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /incrementar/i })).toBeInTheDocument()
    })
  })

  describe('Interacciones del usuario', () => {
    it('debería incrementar el contador al hacer clic en +', async () => {
      // userEvent.setup() es la API moderna (v14)
      const user = userEvent.setup()
      render(<Counter initialValue={0} />)

      await user.click(screen.getByRole('button', { name: /incrementar/i }))

      expect(screen.getByTestId('count-display')).toHaveTextContent('1')
    })

    it('debería decrementar el contador al hacer clic en −', async () => {
      const user = userEvent.setup()
      render(<Counter initialValue={5} />)

      await user.click(screen.getByRole('button', { name: /decrementar/i }))

      expect(screen.getByTestId('count-display')).toHaveTextContent('4')
    })

    it('debería incrementar múltiples veces correctamente', async () => {
      const user = userEvent.setup()
      render(<Counter />)

      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /incrementar/i }))

      expect(screen.getByTestId('count-display')).toHaveTextContent('3')
    })

    it('debería reiniciar al valor inicial al hacer clic en ↺', async () => {
      const user = userEvent.setup()
      render(<Counter initialValue={10} />)

      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /incrementar/i }))
      await user.click(screen.getByRole('button', { name: /reiniciar/i }))

      expect(screen.getByTestId('count-display')).toHaveTextContent('10')
    })
  })

  describe('Con límites (min/max)', () => {
    it('no debería bajar del mínimo definido', async () => {
      const user = userEvent.setup()
      render(<Counter initialValue={0} min={0} />)

      // El botón está desactivado cuando estamos en el mínimo
      expect(screen.getByRole('button', { name: /decrementar/i })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: /decrementar/i }))
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })

    it('no debería superar el máximo definido', () => {
      render(<Counter initialValue={10} max={10} />)

      expect(screen.getByRole('button', { name: /incrementar/i })).toBeDisabled()
    })

    it('debería mostrar el rango cuando se definen límites', () => {
      render(<Counter min={0} max={100} />)
      expect(screen.getByText(/rango/i)).toBeInTheDocument()
    })
  })
})
