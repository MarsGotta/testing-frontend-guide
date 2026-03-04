/**
 * S5 — Eventos: LoginForm con userEvent
 *
 * Test completo de un formulario con validaciones, loading y manejo de errores.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../examples/LoginForm'

describe('LoginForm', () => {
  describe('cuando el usuario completa el formulario correctamente', () => {
    it('debería llamar a onSubmit con email y contraseña', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn().mockResolvedValue(undefined)

      render(<LoginForm onSubmit={mockSubmit} />)

      await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'secreta123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(mockSubmit).toHaveBeenCalledTimes(1)
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'ana@ejemplo.com',
        password: 'secreta123',
      })
    })

    it('debería mostrar mensaje de éxito tras iniciar sesión', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn().mockResolvedValue(undefined)

      render(<LoginForm onSubmit={mockSubmit} />)

      await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'secreta123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(await screen.findByText(/sesión iniciada correctamente/i)).toBeInTheDocument()
    })

    it('debería desactivar el botón mientras carga', async () => {
      const user = userEvent.setup()
      // Promesa que nunca resuelve para simular loading infinito
      const mockSubmit = vi.fn().mockReturnValue(new Promise(() => {}))

      render(<LoginForm onSubmit={mockSubmit} />)

      await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'secreta123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeDisabled()
    })
  })

  describe('validación del formulario', () => {
    it('debería mostrar error si el email está vacío', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn()

      render(<LoginForm onSubmit={mockSubmit} />)

      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      // Hay múltiples alerts (email + contraseña), usamos getAllByRole
      const alerts = screen.getAllByRole('alert')
      expect(alerts.some((a) => /email es obligatorio/i.test(a.textContent ?? ''))).toBe(true)
      expect(mockSubmit).not.toHaveBeenCalled()
    })

    it('debería mostrar error si el email no tiene formato válido', async () => {
      const user = userEvent.setup()
      render(<LoginForm onSubmit={vi.fn()} />)

      await user.type(screen.getByLabelText(/email/i), 'no-es-un-email')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(screen.getByText(/email no es válido/i)).toBeInTheDocument()
    })

    it('debería mostrar error si la contraseña tiene menos de 6 caracteres', async () => {
      const user = userEvent.setup()
      render(<LoginForm onSubmit={vi.fn()} />)

      await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')
      await user.type(screen.getByLabelText(/contraseña/i), '123')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument()
    })
  })

  describe('cuando el servidor devuelve un error', () => {
    it('debería mostrar el mensaje de error del servidor', async () => {
      const user = userEvent.setup()
      const mockSubmit = vi.fn().mockRejectedValue(new Error('Credenciales incorrectas'))

      render(<LoginForm onSubmit={mockSubmit} />)

      await user.type(screen.getByLabelText(/email/i), 'ana@ejemplo.com')
      await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
      await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

      expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas')
    })
  })
})
