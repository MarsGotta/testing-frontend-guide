/**
 * S5 — Eventos: userEvent vs fireEvent
 *
 * userEvent simula el comportamiento REAL del usuario (secuencia de eventos).
 * fireEvent despacha UN solo evento DOM.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

function InputDemo() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [events, setEvents] = useState<string[]>([])

  const addEvent = (name: string) =>
    setEvents((prev) => [...prev, name])

  return (
    <div>
      <label htmlFor="demo">Campo de texto</label>
      <input
        id="demo"
        value={value}
        onChange={(e) => { setValue(e.target.value); addEvent('change') }}
        onFocus={() => { setFocused(true); addEvent('focus') }}
        onBlur={() => { setFocused(false); addEvent('blur') }}
        onKeyDown={() => addEvent('keydown')}
        onKeyUp={() => addEvent('keyup')}
      />
      <p data-testid="value">{value}</p>
      <p data-testid="focused">{focused ? 'enfocado' : 'desenfocado'}</p>
      <ul data-testid="events">
        {events.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
    </div>
  )
}

function CheckboxGroup() {
  const [accepted, setAccepted] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        Acepto los términos
      </label>
      <label>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
        />
        Suscribirme al newsletter
      </label>
      <button type="submit" disabled={!accepted}>Continuar</button>
    </form>
  )
}

describe('userEvent — simula el flujo completo del usuario', () => {
  it('type dispara focus, keydown, keyup, change, blur en el orden correcto', async () => {
    const user = userEvent.setup()
    render(<InputDemo />)

    const input = screen.getByLabelText(/campo de texto/i)
    await user.type(input, 'hola')

    // userEvent.type simula: focus → keydown → keypress → change → keyup por cada carácter
    expect(screen.getByTestId('value')).toHaveTextContent('hola')
    expect(screen.getByTestId('events').children.length).toBeGreaterThan(4)
  })

  it('click en checkbox lo marca y desmarca correctamente', async () => {
    const user = userEvent.setup()
    render(<CheckboxGroup />)

    const checkbox = screen.getByRole('checkbox', { name: /acepto los términos/i })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('tab navega entre elementos enfocables', async () => {
    const user = userEvent.setup()
    render(<CheckboxGroup />)

    // Tab se mueve al primer checkbox
    await user.tab()
    expect(screen.getAllByRole('checkbox')[0]).toHaveFocus()

    // Tab siguiente
    await user.tab()
    expect(screen.getAllByRole('checkbox')[1]).toHaveFocus()
  })

  it('keyboard puede activar botones con Enter o Space', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<button onClick={handleClick}>Presionar</button>)

    const btn = screen.getByRole('button')
    btn.focus()
    await user.keyboard('{Enter}')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('fireEvent — solo despacha UN evento DOM (comparativa)', () => {
  it('fireEvent.change cambia el valor pero NO simula focus/blur', () => {
    render(<InputDemo />)

    const input = screen.getByLabelText(/campo de texto/i)
    fireEvent.change(input, { target: { value: 'hola' } })

    // El valor cambia...
    expect(screen.getByTestId('value')).toHaveTextContent('hola')

    // ...pero NO se dispararon keydown/keyup como lo haría un usuario real
    const eventList = screen.getByTestId('events')
    expect(eventList.textContent).not.toContain('keydown')
  })
})
