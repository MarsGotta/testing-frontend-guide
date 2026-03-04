/**
 * S2 — Jest/Vitest: Matchers fundamentales
 *
 * Un tour completo de los matchers más usados.
 */

describe('Matchers de igualdad', () => {
  it('toBe — compara primitivos con ===', () => {
    expect(1 + 1).toBe(2)
    expect('hola').toBe('hola')
    expect(true).toBe(true)
  })

  it('toEqual — compara objetos por valor (deep equal)', () => {
    const obj = { nombre: 'Ana', edad: 30 }
    expect(obj).toEqual({ nombre: 'Ana', edad: 30 })
  })

  it('toStrictEqual — como toEqual pero comprueba undefined y tipos de clase', () => {
    class Persona { constructor(public nombre: string) {} }
    expect(new Persona('Ana')).toStrictEqual(new Persona('Ana'))
  })
})

describe('Matchers de veracidad', () => {
  it('toBeTruthy — cualquier valor truthy', () => {
    expect(1).toBeTruthy()
    expect('hola').toBeTruthy()
    expect({}).toBeTruthy()
  })

  it('toBeFalsy — cualquier valor falsy', () => {
    expect(0).toBeFalsy()
    expect('').toBeFalsy()
    expect(null).toBeFalsy()
    expect(undefined).toBeFalsy()
  })

  it('toBeNull — exactamente null', () => {
    expect(null).toBeNull()
  })

  it('toBeUndefined — exactamente undefined', () => {
    let variable: string | undefined
    expect(variable).toBeUndefined()
  })

  it('toBeDefined — cualquier valor excepto undefined', () => {
    expect(42).toBeDefined()
  })
})

describe('Matchers numéricos', () => {
  it('toBeGreaterThan / toBeLessThan', () => {
    expect(10).toBeGreaterThan(5)
    expect(3).toBeLessThan(7)
    expect(5).toBeGreaterThanOrEqual(5)
    expect(5).toBeLessThanOrEqual(5)
  })

  it('toBeCloseTo — para comparar decimales', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3, 5)
  })
})

describe('Matchers de strings y arrays', () => {
  it('toContain — para arrays y strings', () => {
    expect([1, 2, 3]).toContain(2)
    expect('Testing Library').toContain('Library')
  })

  it('toHaveLength — longitud de arrays y strings', () => {
    expect([1, 2, 3]).toHaveLength(3)
    expect('hola').toHaveLength(4)
  })

  it('toMatch — string contra regex', () => {
    expect('jest y vitest').toMatch(/vitest/)
    expect('2024-01-15').toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('Matchers de errores', () => {
  const lanzaError = () => { throw new Error('algo salió mal') }
  const lanzaTipoError = () => { throw new TypeError('tipo incorrecto') }

  it('toThrow — cualquier error', () => {
    expect(lanzaError).toThrow()
  })

  it('toThrow con mensaje — error con mensaje específico', () => {
    expect(lanzaError).toThrow('algo salió mal')
  })

  it('toThrow con regex — error que coincide con patrón', () => {
    expect(lanzaError).toThrow(/salió/)
  })

  it('toThrow con clase — tipo específico de error', () => {
    expect(lanzaTipoError).toThrow(TypeError)
  })
})

describe('Matchers de objetos', () => {
  it('toHaveProperty — objeto tiene una propiedad', () => {
    const usuario = { id: 1, nombre: 'Ana', rol: 'admin' }
    expect(usuario).toHaveProperty('nombre')
    expect(usuario).toHaveProperty('rol', 'admin')
  })

  it('expect.objectContaining — subconjunto de propiedades', () => {
    const respuesta = { status: 200, data: [1, 2], timestamp: Date.now() }
    expect(respuesta).toEqual(
      expect.objectContaining({ status: 200 }),
    )
  })

  it('expect.arrayContaining — subconjunto de elementos', () => {
    expect([1, 2, 3, 4]).toEqual(expect.arrayContaining([2, 4]))
  })
})
