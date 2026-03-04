/**
 * S8 — Buenas Prácticas: cobertura y antipatrones
 *
 * Demuestra qué SE DEBE y qué NO SE DEBE hacer en los tests.
 */

// ── Función con varias ramas para demostrar cobertura ────────────────────────

type UserRole = 'admin' | 'editor' | 'viewer'

interface User {
  id: number
  name: string
  role: UserRole
  active: boolean
}

function getUserPermissions(user: User): string[] {
  if (!user.active) return []

  const base = ['read']

  if (user.role === 'admin') {
    return [...base, 'write', 'delete', 'manage_users']
  }

  if (user.role === 'editor') {
    return [...base, 'write']
  }

  return base // viewer
}

function formatUserDisplay(user: User): string {
  if (!user.name.trim()) throw new Error('El nombre no puede estar vacío')
  const status = user.active ? 'Activo' : 'Inactivo'
  return `${user.name} (${user.role}) — ${status}`
}

// ── Tests que demuestran buena cobertura de RAMAS ────────────────────────────

describe('getUserPermissions', () => {
  it('debería retornar [] para usuarios inactivos', () => {
    const user: User = { id: 1, name: 'Ana', role: 'admin', active: false }
    expect(getUserPermissions(user)).toEqual([])
  })

  it('debería retornar permisos completos para admin activo', () => {
    const user: User = { id: 1, name: 'Ana', role: 'admin', active: true }
    expect(getUserPermissions(user)).toEqual(['read', 'write', 'delete', 'manage_users'])
  })

  it('debería retornar read+write para editor activo', () => {
    const user: User = { id: 2, name: 'Carlos', role: 'editor', active: true }
    expect(getUserPermissions(user)).toEqual(['read', 'write'])
  })

  it('debería retornar solo read para viewer activo', () => {
    const user: User = { id: 3, name: 'María', role: 'viewer', active: true }
    expect(getUserPermissions(user)).toEqual(['read'])
  })
})

describe('formatUserDisplay', () => {
  it('debería formatear correctamente un usuario activo', () => {
    const user: User = { id: 1, name: 'Ana García', role: 'admin', active: true }
    expect(formatUserDisplay(user)).toBe('Ana García (admin) — Activo')
  })

  it('debería formatear correctamente un usuario inactivo', () => {
    const user: User = { id: 2, name: 'Carlos López', role: 'viewer', active: false }
    expect(formatUserDisplay(user)).toBe('Carlos López (viewer) — Inactivo')
  })

  it('debería lanzar un error si el nombre está vacío', () => {
    const user: User = { id: 3, name: '   ', role: 'editor', active: true }
    expect(() => formatUserDisplay(user)).toThrow('El nombre no puede estar vacío')
  })
})

// ── Demostración de BUENOS patrones ─────────────────────────────────────────

describe('Buenas prácticas demostradas', () => {
  it('usa datos REALES y significativos, no "foo" o "test"', () => {
    // ❌ MAL: const user = { name: 'foo', role: 'bar' }
    // ✅ BIEN: datos que reflejan casos de uso reales
    const user: User = {
      id: 42,
      name: 'María Fernández',
      role: 'editor',
      active: true,
    }
    expect(getUserPermissions(user)).toContain('write')
  })

  it('tiene UNA aserción lógica por test (puede haber varias expect)', () => {
    const adminUser: User = { id: 1, name: 'Admin', role: 'admin', active: true }
    const permissions = getUserPermissions(adminUser)

    // Todas estas expect verifican el MISMO concepto: que el admin tiene todos los permisos
    expect(permissions).toContain('read')
    expect(permissions).toContain('write')
    expect(permissions).toContain('delete')
    expect(permissions).toContain('manage_users')
  })

  it('NO captura errores — los espera explícitamente', () => {
    // ❌ MAL:
    // try { formatUserDisplay({...nombre vacío}) } catch (e) { /* no hace nada */ }

    // ✅ BIEN: esperar el error explícitamente
    const user: User = { id: 1, name: '', role: 'admin', active: true }
    expect(() => formatUserDisplay(user)).toThrow()
  })
})
