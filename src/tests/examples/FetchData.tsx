import { useState, useEffect } from 'react'

export interface User {
  id: number
  name: string
  email: string
}

type Status = 'loading' | 'success' | 'error'

export function FetchData() {
  const [users, setUsers] = useState<User[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
        return res.json() as Promise<User[]>
      })
      .then((data) => {
        if (!cancelled) {
          setUsers(data)
          setStatus('success')
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setErrorMessage(err.message)
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'loading') {
    return <p role="status" aria-live="polite">Cargando usuarios…</p>
  }

  if (status === 'error') {
    return (
      <div role="alert" aria-live="assertive">
        <p>Error al cargar los usuarios</p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    )
  }

  return (
    <div>
      <h2>Usuarios ({users.length})</h2>
      <ul aria-label="Lista de usuarios">
        {users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
