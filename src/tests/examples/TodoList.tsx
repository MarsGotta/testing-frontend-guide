import { useState } from 'react'

export interface Todo {
  id: number
  text: string
  done: boolean
}

type Filter = 'todas' | 'pendientes' | 'completadas'

interface TodoListProps {
  initialTodos?: Todo[]
}

export function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [filter, setFilter] = useState<Filter>('todas')
  const [newText, setNewText] = useState('')

  const addTodo = () => {
    const trimmed = newText.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed, done: false }])
    setNewText('')
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const filtered = todos.filter((t) => {
    if (filter === 'pendientes') return !t.done
    if (filter === 'completadas') return t.done
    return true
  })

  const pendingCount = todos.filter((t) => !t.done).length

  return (
    <div>
      <h2>Lista de tareas</h2>
      <p aria-live="polite">{pendingCount} tarea(s) pendiente(s)</p>

      {/* Add new todo */}
      <div>
        <label htmlFor="nueva-tarea">Nueva tarea</label>
        <input
          id="nueva-tarea"
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Escribe una tarea…"
        />
        <button onClick={addTodo}>Agregar</button>
      </div>

      {/* Filter buttons */}
      <div role="group" aria-label="Filtrar tareas">
        {(['todas', 'pendientes', 'completadas'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {filtered.length === 0 ? (
        <p>No hay tareas</p>
      ) : (
        <ul aria-label="Tareas">
          {filtered.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Marcar "${todo.text}" como ${todo.done ? 'pendiente' : 'completada'}`}
                />
                <span
                  style={todo.done ? { textDecoration: 'line-through' } : undefined}
                >
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Eliminar tarea: ${todo.text}`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
