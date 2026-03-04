import { http, HttpResponse } from 'msw'
import type { User } from '../examples/FetchData'

export const mockUsers: User[] = [
  { id: 1, name: 'Ana García', email: 'ana@ejemplo.com' },
  { id: 2, name: 'Carlos López', email: 'carlos@ejemplo.com' },
  { id: 3, name: 'María Fernández', email: 'maria@ejemplo.com' },
]

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === Number(params.id))
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(user)
  }),
]
