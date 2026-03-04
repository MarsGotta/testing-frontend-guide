/**
 * S4 — Queries: findBy*
 *
 * findBy* retorna una Promise que espera a que el elemento aparezca.
 * Úsala cuando el elemento tarda en aparecer (async: API calls, timers, etc.)
 */
import { render, screen } from '@testing-library/react'
import { useState, useEffect } from 'react'

// Componente que carga datos de forma asíncrona
function AsyncLoader() {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData('Datos cargados correctamente')
    }, 50) // Simula delay de red
    return () => clearTimeout(timer)
  }, [])

  if (!data) return <p role="status">Cargando…</p>
  return <p role="status">{data}</p>
}

function AsyncWithError({ shouldFail }: { shouldFail: boolean }) {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(shouldFail ? 'error' : 'success')
    }, 50)
    return () => clearTimeout(timer)
  }, [shouldFail])

  return (
    <div>
      {state === 'loading' && <span>Cargando…</span>}
      {state === 'success' && <div role="status">¡Éxito!</div>}
      {state === 'error' && <div role="alert">Error en la operación</div>}
    </div>
  )
}

describe('findBy* — para elementos que aparecen de forma ASÍNCRONA', () => {
  it('debería esperar a que el elemento aparezca (await es necesario)', async () => {
    render(<AsyncLoader />)

    // Primero vemos el estado de carga
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()

    // findBy* espera (por defecto hasta 1 segundo) a que el elemento aparezca
    const resultado = await screen.findByText(/datos cargados correctamente/i)
    expect(resultado).toBeInTheDocument()
  })

  it('debería encontrar un elemento de éxito tras la carga', async () => {
    render(<AsyncWithError shouldFail={false} />)

    // findByText espera a que el texto aparezca
    const success = await screen.findByText(/éxito/i)
    expect(success).toBeInTheDocument()
  })

  it('debería encontrar el error cuando la operación falla', async () => {
    render(<AsyncWithError shouldFail={true} />)

    const errorMsg = await screen.findByRole('alert')
    expect(errorMsg).toHaveTextContent('Error en la operación')
  })
})

describe('CUÁNDO usar findBy* vs getBy* vs queryBy*', () => {
  it('RESUMEN: getBy → debe existir YA | queryBy → puede no existir | findBy → aparecerá async', async () => {
    render(<AsyncLoader />)

    // getBy* — para elementos que deben existir ahora mismo
    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)

    // findBy* — para elementos que aparecerán en el futuro
    const loaded = await screen.findByText(/datos cargados correctamente/i)
    expect(loaded).toBeInTheDocument()

    // queryBy* — para verificar ausencia
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
