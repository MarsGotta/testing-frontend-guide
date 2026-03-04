/**
 * S4 — Queries: getBy*
 *
 * getBy* lanza un error si el elemento NO existe.
 * Úsala cuando el elemento DEBE estar en el DOM.
 */
import { render, screen } from '@testing-library/react'

function DemoComponent() {
  return (
    <div>
      <h1>Título principal</h1>
      <button>Guardar</button>
      <label htmlFor="nombre">Nombre de usuario</label>
      <input id="nombre" type="text" placeholder="Ej: Ana García" />
      <img src="/avatar.png" alt="Avatar del usuario" />
      <a href="/perfil" title="Ver perfil completo">Perfil</a>
      <span data-testid="estado-badge">Activo</span>
    </div>
  )
}

describe('getBy* — jerarquía de queries (de preferida a último recurso)', () => {
  beforeEach(() => {
    render(<DemoComponent />)
  })

  it('getByRole — la query PREFERIDA (semántica HTML/ARIA)', () => {
    // Roles comunes: heading, button, textbox, checkbox, img, link, list, listitem
    expect(screen.getByRole('heading', { name: /título principal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /nombre de usuario/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /avatar del usuario/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
  })

  it('getByLabelText — para inputs con label asociado', () => {
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
  })

  it('getByPlaceholderText — cuando no hay label (evitar si es posible)', () => {
    expect(screen.getByPlaceholderText(/ej: ana garcía/i)).toBeInTheDocument()
  })

  it('getByText — para elementos con texto visible', () => {
    expect(screen.getByText(/título principal/i)).toBeInTheDocument()
  })

  it('getByAltText — para imágenes', () => {
    expect(screen.getByAltText(/avatar del usuario/i)).toBeInTheDocument()
  })

  it('getByTitle — para elementos con atributo title', () => {
    expect(screen.getByTitle(/ver perfil completo/i)).toBeInTheDocument()
  })

  it('getByTestId — ÚLTIMO RECURSO cuando nada más funciona', () => {
    // data-testid es estable pero no semántico
    expect(screen.getByTestId('estado-badge')).toHaveTextContent('Activo')
  })
})

describe('getBy* — lanza error si el elemento no existe', () => {
  it('debería lanzar un error descriptivo cuando el elemento no se encuentra', () => {
    render(<div><span>Solo esto</span></div>)

    expect(() => {
      screen.getByRole('button', { name: /no existe/i })
    }).toThrow()
  })
})
