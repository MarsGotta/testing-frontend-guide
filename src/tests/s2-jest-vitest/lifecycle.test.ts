/**
 * S2 — Jest/Vitest: Ciclo de vida de los tests
 *
 * Demuestra: beforeEach, afterEach, beforeAll, afterAll
 * y la anidación de describe().
 */

// Simulamos una base de datos en memoria
interface DB {
  users: string[]
  insert: (name: string) => void
  clear: () => void
  findAll: () => string[]
}

function createDB(): DB {
  let users: string[] = []
  return {
    get users() { return users },
    insert(name) { users.push(name) },
    clear() { users = [] },
    findAll() { return [...users] },
  }
}

describe('Ciclo de vida de los tests', () => {
  let db: DB

  // Se ejecuta UNA VEZ antes de todos los tests de este describe
  beforeAll(() => {
    db = createDB()
  })

  // Se ejecuta ANTES de CADA test
  beforeEach(() => {
    db.clear()
    db.insert('Ana')
    db.insert('Carlos')
  })

  // Se ejecuta DESPUÉS de CADA test
  afterEach(() => {
    // Limpieza post-test (aquí podría ir: vi.restoreAllMocks(), etc.)
  })

  it('debería tener 2 usuarios después del beforeEach', () => {
    expect(db.findAll()).toHaveLength(2)
  })

  it('debería poder insertar un usuario nuevo', () => {
    db.insert('María')
    expect(db.findAll()).toContain('María')
  })

  it('debería empezar limpio gracias al beforeEach (no contamina el test anterior)', () => {
    // María NO debería estar porque beforeEach limpia y recrea el estado
    expect(db.findAll()).not.toContain('María')
  })

  describe('filtrado de usuarios', () => {
    beforeEach(() => {
      // beforeEach anidado — se ejecuta DESPUÉS del beforeEach padre
      db.insert('Luisa')
    })

    it('debería tener 3 usuarios (2 del padre + 1 del hijo)', () => {
      expect(db.findAll()).toHaveLength(3)
    })

    it('debería encontrar a Luisa', () => {
      expect(db.findAll()).toContain('Luisa')
    })
  })
})
