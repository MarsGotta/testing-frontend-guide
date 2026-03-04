/**
 * S4 — Queries: queryBy*
 *
 * queryBy* retorna null si el elemento NO existe (en vez de lanzar error).
 * Úsala cuando quieres VERIFICAR QUE ALGO NO ESTÁ en el DOM.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

function MensajeCondicional({ mostrar }: { mostrar: boolean }) {
  return (
    <div>
      {mostrar && <div role="alert">¡Mensaje importante!</div>}
      <button onClick={() => {}}>Acción</button>
    </div>
  )
}

function ToastNotification() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button onClick={() => { setVisible(true); setTimeout(() => setVisible(false), 500) }}>
        Mostrar notificación
      </button>
      {visible && <div role="status">Guardado correctamente</div>}
    </div>
  )
}

describe('queryBy* — para verificar AUSENCIA de elementos', () => {
  it('debería retornar null cuando el elemento no está en el DOM', () => {
    render(<MensajeCondicional mostrar={false} />)

    // queryByRole retorna null, no lanza error
    const alerta = screen.queryByRole('alert')
    expect(alerta).toBeNull()

    // Forma más idiomática con not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('debería encontrar el elemento cuando sí está presente', () => {
    render(<MensajeCondicional mostrar={true} />)

    expect(screen.queryByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toHaveTextContent('¡Mensaje importante!')
  })

  it('debería poder verificar que un error NO se muestra después de una acción válida', async () => {
    const user = userEvent.setup()
    render(<ToastNotification />)

    // Antes de la acción: no hay notificación
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    // Después de la acción: la notificación aparece
    await user.click(screen.getByRole('button', { name: /mostrar notificación/i }))
    expect(screen.queryByRole('status')).toBeInTheDocument()
  })
})

describe('CUÁNDO usar queryBy* vs getBy*', () => {
  it('usa getBy* cuando el elemento DEBE estar — falla descriptivamente si no', () => {
    render(<MensajeCondicional mostrar={true} />)
    // Esto documenta la intención: "el alert TIENE que estar aquí"
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('usa queryBy* cuando el elemento PUEDE estar o no estar', () => {
    render(<MensajeCondicional mostrar={false} />)
    // Esto documenta la intención: "comprobamos que el alert NO está"
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
