/**
 * S1 — Anatomía de un Test: funciones puras
 *
 * Demuestra aserciones BDD con expect() en funciones sin UI.
 */

// ── Funciones puras de ejemplo ──────────────────────────────────────────────

function sumar(a: number, b: number): number {
  return a + b
}

function capitalizar(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function dividir(a: number, b: number): number {
  if (b === 0) throw new Error('No se puede dividir por cero')
  return a / b
}

function esPar(n: number): boolean {
  return n % 2 === 0
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('sumar', () => {
  it('debería retornar la suma de dos números positivos', () => {
    expect(sumar(2, 3)).toBe(5)
  })

  it('debería retornar 0 al sumar un número y su negativo', () => {
    expect(sumar(5, -5)).toBe(0)
  })

  it('debería manejar correctamente los decimales', () => {
    expect(sumar(0.1, 0.2)).toBeCloseTo(0.3)
  })
})

describe('capitalizar', () => {
  it('debería poner en mayúscula la primera letra', () => {
    expect(capitalizar('hola mundo')).toBe('Hola mundo')
  })

  it('debería retornar cadena vacía si se pasa una vacía', () => {
    expect(capitalizar('')).toBe('')
  })

  it('debería convertir el resto en minúsculas', () => {
    expect(capitalizar('REACT')).toBe('React')
  })
})

describe('dividir', () => {
  it('debería retornar el cociente de dos números', () => {
    expect(dividir(10, 2)).toBe(5)
  })

  it('debería lanzar un error cuando el divisor es cero', () => {
    expect(() => dividir(10, 0)).toThrow('No se puede dividir por cero')
  })

  it('debería retornar un decimal cuando la división no es exacta', () => {
    expect(dividir(7, 2)).toBe(3.5)
  })
})

describe('esPar', () => {
  it('debería retornar true para números pares', () => {
    expect(esPar(4)).toBe(true)
  })

  it('debería retornar false para números impares', () => {
    expect(esPar(7)).toBe(false)
  })

  it('debería retornar true para el 0', () => {
    expect(esPar(0)).toBe(true)
  })
})
