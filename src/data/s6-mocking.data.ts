import type { QuizQuestion, OutputLine } from '../types/guide.types'

import fetchDataExampleRaw from '../tests/examples/FetchData.tsx?raw'
import fetchDataTestRaw from '../tests/s6-mocking/FetchData.test.tsx?raw'
import stubsSpiesTestRaw from '../tests/s6-mocking/stubs-spies.test.ts?raw'
import handlersRaw from '../tests/s6-mocking/handlers.ts?raw'

export const s6FetchDataCode = fetchDataExampleRaw
export const s6FetchDataTestCode = fetchDataTestRaw
export const s6StubsSpiesCode = stubsSpiesTestRaw
export const s6HandlersCode = handlersRaw

export const s6StubExample = `// STUB: función que devuelve un valor fijo sin lógica real
const stubbedFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([{ id: 1, name: 'Ana' }])
})

// El componente usará este stub en vez de fetch real
global.fetch = stubbedFetch`

export const s6SpyExample = `// SPY: registra las llamadas sin reemplazar la implementación
const spy = vi.spyOn(emailService, 'send')

enviarNotificacion('usuario@test.com')

// Verificamos QUE se llamó y CON QUÉ argumentos
expect(spy).toHaveBeenCalledOnce()
expect(spy).toHaveBeenCalledWith('usuario@test.com', expect.any(String))

// Restaurar el original después del test
vi.restoreAllMocks()

// ⚠️ Desde Vitest 3+:
// - mockReset() RESTAURA la implementación original (antes era un noop)
// - mockRestore() sigue restaurando el original Y quita el spy
// - Usa vi.restoreAllMocks() en afterEach para limpiar todo`

export const s6MockExample = `// MOCK: reemplaza completamente un módulo
vi.mock('./servicios/emailService', () => ({
  enviarEmail: vi.fn().mockResolvedValue({ enviado: true }),
  verificarConexion: vi.fn().mockReturnValue(true),
}))

// En el test: el módulo importado es la versión mock
import { enviarEmail } from './servicios/emailService'
// enviarEmail ya es una función mock`

export const s6MSWExample = `// MSW (Mock Service Worker): intercepta peticiones HTTP reales
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/usuarios', () => {
    return HttpResponse.json([
      { id: 1, nombre: 'Ana García' },
      { id: 2, nombre: 'Carlos López' },
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers()) // Limpia overrides
afterAll(() => server.close())

// Override para un test específico (ej: simular error)
server.use(
  http.get('/api/usuarios', () => new HttpResponse(null, { status: 500 }))
)`

export const s6Quiz: QuizQuestion[] = [
  {
    id: 's6-q1',
    question: '¿Cuál es la diferencia entre un STUB y un SPY?',
    options: [
      'No hay diferencia, son lo mismo',
      'El stub reemplaza la función con un valor fijo; el spy observa las llamadas sin reemplazar',
      'El spy reemplaza la función; el stub solo observa',
      'El stub es para async; el spy para sync',
    ],
    correctIndex: 1,
    explanation:
      'Un stub (vi.fn().mockReturnValue()) reemplaza la implementación con un valor controlado. Un spy (vi.spyOn()) envuelve la función real para observar sus llamadas, opcionalmente cambiando el retorno.',
  },
  {
    id: 's6-q2',
    question: '¿Por qué se recomienda MSW para mockear APIs frente a vi.mock(fetch)?',
    options: [
      'MSW es más rápido',
      'MSW funciona a nivel de red, haciendo los tests más realistas sin cambiar el código de producción',
      'MSW no necesita configuración',
      'vi.mock() no puede mockear fetch',
    ],
    correctIndex: 1,
    explanation:
      'MSW intercepta peticiones HTTP reales a nivel de red. Tu código de producción usa fetch/axios normalmente; MSW intercepta antes de que lleguen al servidor. Más realista y sin acoplamiento.',
  },
  {
    id: 's6-q3',
    question: '¿Qué hace server.resetHandlers() en el afterEach de MSW?',
    options: [
      'Cierra el servidor',
      'Reinicia el servidor desde cero',
      'Elimina los handlers añadidos con server.use() en tests individuales',
      'Limpia las cookies y el localStorage',
    ],
    correctIndex: 2,
    explanation:
      'server.resetHandlers() elimina solo los handlers temporales añadidos con server.use() dentro de un test. Los handlers base (del setupServer) permanecen intactos para el siguiente test.',
  },
]

export const s6SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s6-mocking/' },
  { type: 'info', text: 'stubs-spies.test.ts' },
  { type: 'pass', text: 'Stubs > debería retornar un valor fijo sin ejecutar la lógica real' },
  { type: 'pass', text: 'Stubs > mockReturnValueOnce — diferente valor en cada llamada' },
  { type: 'pass', text: 'Spies > debería registrar que la función fue llamada' },
  { type: 'pass', text: 'Spies > debería poder interceptar y cambiar el retorno' },
  { type: 'info', text: 'FetchData.test.tsx' },
  { type: 'pass', text: 'FetchData > carga exitosa > muestra la lista de usuarios' },
  { type: 'pass', text: 'FetchData > manejo de errores > muestra error cuando el servidor falla' },
  { type: 'pass', text: 'FetchData > manejo de errores > override por test con server.use()' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  2 passed (2)  |  Tests  18 passed' },
]
