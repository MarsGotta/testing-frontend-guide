/**
 * S4 — Queries: TodoList completo
 *
 * Test exhaustivo del componente TodoList usando la jerarquía de queries.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList, type Todo } from '../examples/TodoList'

const initialTodos: Todo[] = [
  { id: 1, text: 'Aprender Testing Library', done: false },
  { id: 2, text: 'Escribir tests de calidad', done: false },
  { id: 3, text: 'Hacer code review', done: true },
]

describe('TodoList', () => {
  describe('Renderizado inicial', () => {
    it('debería mostrar todas las tareas iniciales', () => {
      render(<TodoList initialTodos={initialTodos} />)

      expect(screen.getByText('Aprender Testing Library')).toBeInTheDocument()
      expect(screen.getByText('Escribir tests de calidad')).toBeInTheDocument()
      expect(screen.getByText('Hacer code review')).toBeInTheDocument()
    })

    it('debería mostrar el contador de tareas pendientes', () => {
      render(<TodoList initialTodos={initialTodos} />)
      expect(screen.getByText(/2 tarea\(s\) pendiente\(s\)/i)).toBeInTheDocument()
    })

    it('debería mostrar "No hay tareas" cuando la lista está vacía', () => {
      render(<TodoList initialTodos={[]} />)
      expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
    })
  })

  describe('Agregar tareas', () => {
    it('debería agregar una nueva tarea al escribir y hacer clic en Agregar', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={[]} />)

      await user.type(screen.getByLabelText(/nueva tarea/i), 'Revisar PRs')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(screen.getByText('Revisar PRs')).toBeInTheDocument()
    })

    it('debería limpiar el input después de agregar', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={[]} />)

      const input = screen.getByLabelText(/nueva tarea/i)
      await user.type(input, 'Nueva tarea')
      await user.click(screen.getByRole('button', { name: /agregar/i }))

      expect(input).toHaveValue('')
    })

    it('debería poder agregar con la tecla Enter', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={[]} />)

      await user.type(screen.getByLabelText(/nueva tarea/i), 'Tarea con Enter{Enter}')

      expect(screen.getByText('Tarea con Enter')).toBeInTheDocument()
    })

    it('no debería agregar una tarea vacía', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      await user.click(screen.getByRole('button', { name: /agregar/i }))

      // Deberían seguir siendo 3 tareas (no se añadió ninguna)
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })
  })

  describe('Marcar como completada', () => {
    it('debería marcar una tarea como completada al marcar el checkbox', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      const checkbox = screen.getByRole('checkbox', {
        name: /marcar "aprender testing library"/i,
      })
      await user.click(checkbox)

      expect(checkbox).toBeChecked()
    })

    it('debería actualizar el contador de pendientes al completar una tarea', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      await user.click(
        screen.getByRole('checkbox', { name: /marcar "aprender testing library"/i }),
      )

      expect(screen.getByText(/1 tarea\(s\) pendiente\(s\)/i)).toBeInTheDocument()
    })
  })

  describe('Eliminar tareas', () => {
    it('debería eliminar una tarea al hacer clic en Eliminar', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      // within() acota la búsqueda a un elemento específico del DOM
      const lista = screen.getByRole('list', { name: /tareas/i })
      const items = within(lista).getAllByRole('listitem')
      const primerItem = items[0]

      await user.click(within(primerItem).getByRole('button', { name: /eliminar/i }))

      expect(screen.queryByText('Aprender Testing Library')).not.toBeInTheDocument()
    })
  })

  describe('Filtros', () => {
    it('debería mostrar solo las pendientes al seleccionar "Pendientes"', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      await user.click(screen.getByRole('button', { name: /pendientes/i }))

      expect(screen.getByText('Aprender Testing Library')).toBeInTheDocument()
      expect(screen.queryByText('Hacer code review')).not.toBeInTheDocument()
    })

    it('debería mostrar solo las completadas al seleccionar "Completadas"', async () => {
      const user = userEvent.setup()
      render(<TodoList initialTodos={initialTodos} />)

      await user.click(screen.getByRole('button', { name: /completadas/i }))

      expect(screen.queryByText('Aprender Testing Library')).not.toBeInTheDocument()
      expect(screen.getByText('Hacer code review')).toBeInTheDocument()
    })
  })
})
