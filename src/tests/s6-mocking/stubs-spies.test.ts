/**
 * S6 — Mocking: Stubs, Spies y Mocks con vi
 *
 * - Stub:  función que siempre devuelve un valor fijo
 * - Spy:   función que registra cómo fue llamada (puede delegar al original)
 * - Mock:  doble completo con control total del comportamiento
 */

// ── Servicio de ejemplo para probar ─────────────────────────────────────────

const emailService = {
  send: (to: string, subject: string): boolean => {
    // Implementación real que NO queremos ejecutar en tests
    console.log(`Enviando email a ${to}: ${subject}`)
    return true
  },
}

function notificarUsuario(
  email: string,
  mensaje: string,
  service: typeof emailService,
): string {
  const enviado = service.send(email, mensaje)
  return enviado ? 'Notificación enviada' : 'Error al notificar'
}

async function obtenerDatos(url: string): Promise<{ data: string }> {
  const res = await fetch(url)
  return res.json()
}

// ── Tests de STUBS (vi.fn con valor de retorno fijo) ─────────────────────────

describe('Stubs con vi.fn()', () => {
  it('debería retornar un valor fijo sin ejecutar la lógica real', () => {
    const stubbedSend = vi.fn().mockReturnValue(true)

    const resultado = notificarUsuario('ana@test.com', 'Bienvenida', {
      send: stubbedSend,
    })

    expect(resultado).toBe('Notificación enviada')
  })

  it('mockReturnValueOnce — diferente valor en cada llamada', () => {
    const stub = vi.fn()
      .mockReturnValueOnce('primera')
      .mockReturnValueOnce('segunda')
      .mockReturnValue('por defecto')

    expect(stub()).toBe('primera')
    expect(stub()).toBe('segunda')
    expect(stub()).toBe('por defecto')
    expect(stub()).toBe('por defecto')
  })

  it('mockResolvedValue — para funciones async', async () => {
    const asyncStub = vi.fn().mockResolvedValue({ data: 'respuesta mock' })

    const result = await asyncStub('http://api.test/datos')
    expect(result).toEqual({ data: 'respuesta mock' })
  })

  it('mockRejectedValue — para simular errores async', async () => {
    const failingStub = vi.fn().mockRejectedValue(new Error('Error de red'))

    await expect(failingStub()).rejects.toThrow('Error de red')
  })
})

// ── Tests de SPIES (vi.spyOn) ────────────────────────────────────────────────

describe('Spies con vi.spyOn()', () => {
  afterEach(() => {
    vi.restoreAllMocks() // Restaura los mocks originales después de cada test
  })

  it('debería registrar que la función fue llamada', () => {
    const spy = vi.spyOn(emailService, 'send')

    notificarUsuario('ana@test.com', 'Hola', emailService)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('ana@test.com', 'Hola')
  })

  it('debería poder interceptar y cambiar el retorno', () => {
    const spy = vi.spyOn(emailService, 'send').mockReturnValue(false)

    const resultado = notificarUsuario('ana@test.com', 'Hola', emailService)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(resultado).toBe('Error al notificar')
  })

  it('debería espiar console.log sin ejecutarlo', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    emailService.send('test@test.com', 'Prueba')

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('test@test.com'),
    )
  })
})

// ── Tests de MOCKS de módulos (vi.mock) ──────────────────────────────────────

describe('Comprobaciones de llamadas con vi.fn()', () => {
  it('toHaveBeenCalled — fue llamado al menos una vez', () => {
    const fn = vi.fn()
    fn()
    expect(fn).toHaveBeenCalled()
  })

  it('toHaveBeenCalledTimes — número exacto de llamadas', () => {
    const fn = vi.fn()
    fn(); fn(); fn()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('toHaveBeenCalledWith — llamado con argumentos específicos', () => {
    const fn = vi.fn()
    fn('usuario1', { rol: 'admin' })
    expect(fn).toHaveBeenCalledWith('usuario1', { rol: 'admin' })
  })

  it('toHaveBeenLastCalledWith — última llamada', () => {
    const fn = vi.fn()
    fn('primera')
    fn('última')
    expect(fn).toHaveBeenLastCalledWith('última')
  })
})
