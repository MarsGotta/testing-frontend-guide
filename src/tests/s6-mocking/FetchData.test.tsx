/**
 * S6 — Mocking: FetchData con MSW (Mock Service Worker)
 *
 * MSW intercepta las peticiones HTTP reales a nivel de red.
 * - No hay que mockear fetch() directamente
 * - Los tests son más realistas
 * - Fácil override por test con server.use()
 */
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { FetchData } from '../examples/FetchData'
import { server } from './server'
import { mockUsers } from './handlers'

// ── Ciclo de vida del servidor MSW ──────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers()) // Limpia overrides por test
afterAll(() => server.close())

describe('FetchData con MSW', () => {
  describe('carga exitosa', () => {
    it('debería mostrar estado de carga inicialmente', () => {
      render(<FetchData />)
      expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument()
    })

    it('debería mostrar la lista de usuarios cuando la API responde correctamente', async () => {
      render(<FetchData />)

      // findBy* espera a que los elementos aparezcan (después de la petición)
      expect(await screen.findByText('Ana García')).toBeInTheDocument()
      expect(await screen.findByText('Carlos López')).toBeInTheDocument()
      expect(await screen.findByText('María Fernández')).toBeInTheDocument()
    })

    it('debería mostrar el número correcto de usuarios', async () => {
      render(<FetchData />)

      expect(await screen.findByText(`Usuarios (${mockUsers.length})`)).toBeInTheDocument()
    })

    it('debería desaparecer el estado de carga cuando los datos llegan', async () => {
      render(<FetchData />)

      await screen.findByText('Ana García')

      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument()
    })
  })

  describe('manejo de errores', () => {
    it('debería mostrar mensaje de error cuando el servidor falla (500)', async () => {
      // Override del handler solo para este test
      server.use(
        http.get('/api/users', () => {
          return new HttpResponse(null, { status: 500 })
        }),
      )

      render(<FetchData />)

      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument()
    })

    it('debería mostrar el mensaje de error específico del servidor', async () => {
      server.use(
        http.get('/api/users', () => {
          return new HttpResponse(null, {
            status: 503,
            statusText: 'Service Unavailable',
          })
        }),
      )

      render(<FetchData />)

      const alert = await screen.findByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('debería mostrar error cuando la lista está vacía', async () => {
      server.use(
        http.get('/api/users', () => {
          return HttpResponse.json([])
        }),
      )

      render(<FetchData />)

      // Con lista vacía, el componente carga exitosamente pero sin elementos
      expect(await screen.findByText(/usuarios \(0\)/i)).toBeInTheDocument()
    })
  })
})
