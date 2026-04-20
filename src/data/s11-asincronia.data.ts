import type { QuizQuestion, OutputLine } from '../types/guide.types'
import type { MatchPair } from '../components/shared/DragAndDropMatch'

/* ── Migración fakeAsync → vi.useFakeTimers ─────────────── */
export const s11FakeAsyncBefore = `// ANTES — Angular Zone.js (NO funciona en Vitest)
import { fakeAsync, tick, flush } from '@angular/core/testing'

it('actualiza tras delay', fakeAsync(() => {
  component.startCountdown()
  expect(component.count).toBe(10)

  tick(1000)
  expect(component.count).toBe(9)

  tick(9000)
  expect(component.count).toBe(0)
}))

it('completa todas las tareas', fakeAsync(() => {
  component.loadData()
  flush() // drena toda la cola de macrotasks
  expect(component.data).toBeTruthy()
}))

it('resuelve solo microtasks', fakeAsync(() => {
  component.fetchAsync()
  flushMicrotasks() // solo Promises, no timers
  expect(component.result).toBe('done')
}))`

export const s11FakeAsyncAfter = `// DESPUÉS — Vitest (funciona siempre)
it('actualiza tras delay', () => {
  vi.useFakeTimers()

  component.startCountdown()
  expect(component.count).toBe(10)

  vi.advanceTimersByTime(1000)
  expect(component.count).toBe(9)

  vi.advanceTimersByTime(9000)
  expect(component.count).toBe(0)

  vi.useRealTimers()
})

it('completa todas las tareas', async () => {
  vi.useFakeTimers()
  component.loadData()
  await vi.runAllTimersAsync() // equivale a flush()
  expect(component.data).toBeTruthy()
  vi.useRealTimers()
})

it('resuelve solo microtasks', async () => {
  vi.useFakeTimers()
  component.fetchAsync()
  await vi.advanceTimersByTimeAsync(0) // flush microtasks
  expect(component.result).toBe('done')
  vi.useRealTimers()
})`

/* ── La trampa sync vs async ────────────────────────────── */
export const s11SyncVsAsync = `// ⚠️ LA TRAMPA CRÍTICA: sync vs async en fake timers
//
// vi.advanceTimersByTime()      → sync  → NO flushea Promises
// vi.advanceTimersByTimeAsync() → async → SÍ flushea Promises

// Escenario: setTimeout que dispara un fetch
function delayedFetch() {
  return new Promise(resolve => {
    setTimeout(async () => {
      const data = await fetch('/api/data')
      resolve(data)
    }, 1000)
  })
}

// ❌ MAL — la Promise dentro del setTimeout NO se resuelve
it('falla silenciosamente', () => {
  vi.useFakeTimers()
  const promise = delayedFetch()
  vi.advanceTimersByTime(1000) // ejecuta setTimeout...
  // ...pero await fetch() dentro queda colgado
  vi.useRealTimers()
})

// ✅ BIEN — usar la variante async
it('funciona correctamente', async () => {
  vi.useFakeTimers()
  const promise = delayedFetch()
  await vi.advanceTimersByTimeAsync(1000) // timers + Promises
  const result = await promise
  expect(result).toBeDefined()
  vi.useRealTimers()
})`

/* ── Debounce testing ───────────────────────────────────── */
export const s11DebounceTest = `// Testar una búsqueda con debounce
describe('SearchComponent', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('no busca mientras el usuario escribe', async () => {
    const searchFn = vi.fn()
    const component = new SearchComponent(searchFn)

    component.onInput('h')
    component.onInput('ho')
    component.onInput('hol')
    component.onInput('hola')

    // Aún dentro del debounce (300ms)
    expect(searchFn).not.toHaveBeenCalled()

    // Avanzar más allá del debounce
    await vi.advanceTimersByTimeAsync(300)

    // Solo una llamada con el valor final
    expect(searchFn).toHaveBeenCalledTimes(1)
    expect(searchFn).toHaveBeenCalledWith('hola')
  })

  it('cancela búsqueda anterior si el usuario sigue escribiendo', async () => {
    const searchFn = vi.fn()
    const component = new SearchComponent(searchFn)

    component.onInput('hola')
    await vi.advanceTimersByTimeAsync(200) // no llega a 300ms

    component.onInput('hola mundo') // reinicia el debounce
    await vi.advanceTimersByTimeAsync(300) // ahora sí

    expect(searchFn).toHaveBeenCalledTimes(1)
    expect(searchFn).toHaveBeenCalledWith('hola mundo')
  })
})`

/* ── Observables con firstValueFrom ─────────────────────── */
export const s11ObservablesPromise = `// Enfoque 1: Convertir Observable a Promise
import { firstValueFrom, lastValueFrom } from 'rxjs'

it('obtiene el primer usuario', async () => {
  const user = await firstValueFrom(
    service.getUser(1)
  )
  expect(user).toEqual({ id: 1, name: 'Ana' })
})

// ⚠️ firstValueFrom lanza si el observable completa sin emitir
// ⚠️ lastValueFrom cuelga con observables infinitos (interval)

// Enfoque 2: Subscribe para múltiples emisiones
it('emite tres valores', async () => {
  const values: number[] = []

  service.getStream().subscribe(v => values.push(v))

  await vi.advanceTimersByTimeAsync(3000)

  expect(values).toEqual([1, 2, 3])
})`

/* ── Marble testing ─────────────────────────────────────── */
export const s11MarbleTesting = `// Marble testing con TestScheduler de RxJS
import { TestScheduler } from 'rxjs/testing'
import { filter, map, debounceTime } from 'rxjs/operators'

let scheduler: TestScheduler

beforeEach(() => {
  scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })
})

// Sintaxis de marbles:
// -   un frame de tiempo (1ms)
// a-z valor emitido
// |   complete()
// #   error()
// ()  emisiones síncronas

it('filtra números pares', () => {
  scheduler.run(({ cold, expectObservable }) => {
    const source   = cold('-a-b-c-d|', { a:1, b:2, c:3, d:4 })
    const expected =       '---b---d|'

    const result = source.pipe(filter(n => n % 2 === 0))

    expectObservable(result).toBe(expected, { b:2, d:4 })
  })
})

it('transforma valores', () => {
  scheduler.run(({ cold, expectObservable }) => {
    const source   = cold('-a-b|', { a: 'hello', b: 'world' })
    const expected =       '-a-b|'

    const result = source.pipe(map(s => s.toUpperCase()))

    expectObservable(result).toBe(expected, {
      a: 'HELLO',
      b: 'WORLD'
    })
  })
})`

/* ── Vue async: nextTick y flushPromises ────────────────── */
export const s11VueAsync = `// Vue — nextTick vs flushPromises
import { nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

// nextTick: para actualizaciones reactivas del DOM
it('actualiza el DOM tras cambio de estado', async () => {
  const wrapper = mount(Counter)

  // trigger() ya incluye nextTick
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('Count: 1')
})

// flushPromises: para operaciones async externas
it('muestra datos tras carga de API', async () => {
  vi.mocked(axios.get).mockResolvedValue({
    data: { name: 'Ana' }
  })

  const wrapper = mount(UserProfile)

  // Resolver la llamada API
  await flushPromises()

  expect(wrapper.text()).toContain('Ana')
})

// Testing de estados de carga (loading → loaded)
it('muestra loading y luego datos', async () => {
  const wrapper = mount(DataComponent)

  // Estado loading
  expect(wrapper.find('[data-testid="spinner"]').exists())
    .toBe(true)

  await flushPromises()

  // Estado cargado
  expect(wrapper.find('[data-testid="spinner"]').exists())
    .toBe(false)
  expect(wrapper.text()).toContain('Datos cargados')
})`

/* ── Testing Library async ──────────────────────────────── */
export const s11TestingLibraryAsync = `// Testing Library — utilidades async
import { waitFor, screen } from '@testing-library/dom'

// findBy* = getBy* + waitFor (espera a que aparezca)
const element = await screen.findByText('Cargado')

// waitFor: espera con polling hasta que no lance error
await waitFor(() => {
  expect(screen.getByText('Resultado')).toBeInTheDocument()
}, { timeout: 3000 })

// ❌ ANTI-PATRÓN: side effects dentro de waitFor
await waitFor(() => {
  fireEvent.click(button) // ¡NO! Crea loop infinito
  expect(result).toBeVisible()
})

// ✅ CORRECTO: separar acción de verificación
fireEvent.click(button)
await waitFor(() => {
  expect(result).toBeVisible()
})

// waitForElementToBeRemoved: espera desaparición
await waitForElementToBeRemoved(
  () => screen.queryByTestId('spinner')
)`

/* ── React async: renderHook + waitFor + userEvent ────── */
export const s11ReactAsync = `// React — asincronía con Testing Library React 16
import { render, screen, waitFor, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ── Patrón 1: useEffect que dispara una carga ─────────────
function useUserProfile(id: string) {
  const [data, setData] = useState<User | null>(null)
  useEffect(() => {
    let alive = true
    api.getUser(id).then(u => { if (alive) setData(u) })
    return () => { alive = false }
  }, [id])
  return { data }
}

it('carga el perfil tras montar', async () => {
  const { result } = renderHook(() => useUserProfile('123'))
  // ⚠️ Sin waitFor, result.current.data es null — useEffect
  //    se ejecuta DESPUÉS del commit.
  await waitFor(() =>
    expect(result.current.data?.name).toBe('Ana')
  )
})

// ── Patrón 2: findBy* — incluye waitFor implícito ────────
it('muestra el nombre del usuario', async () => {
  render(<UserCard id="123" />)
  // findByText reintenta cada 50ms hasta 1s
  expect(await screen.findByText(/ana/i)).toBeInTheDocument()
  // ❌ NO envuelvas findBy* en waitFor — ya lo lleva dentro
})

// ── Patrón 3: userEvent 14 es async ──────────────────────
it('envía el formulario al hacer submit', async () => {
  const user = userEvent.setup()  // ← setup una vez por test
  render(<LoginForm />)

  // CADA interacción tiene que ir con await
  await user.type(screen.getByLabelText(/email/i), 'a@a.com')
  await user.click(screen.getByRole('button', { name: /entrar/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent(/ok/i)
})
// ⚠️ El error más común: olvidar el await en user.type/click.
//    El test pasa sin assertar nada porque las acciones
//    quedan pendientes cuando llega el expect.

// ── Patrón 4: TanStack Query en test ─────────────────────
it('muestra el resultado de la query', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
    //                             ↑ sin esto, un error
    //                             tarda varios segundos
  })
  render(
    <QueryClientProvider client={client}>
      <UserList />
    </QueryClientProvider>,
  )
  expect(await screen.findByText(/ana/i)).toBeInTheDocument()
})`

/* ── userEvent 14 + fake timers (fricción conocida) ────── */
export const s11UserEventTimers = `// userEvent 14 + fake timers: hay que avisar al setup
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('búsqueda con debounce de 300ms', async () => {
  // ⚠️ Si mezclas userEvent + fake timers sin avisar, los
  //    delays internos de userEvent se quedan colgados y el
  //    test hace timeout.
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  })

  const onSearch = vi.fn()
  render(<SearchBox onSearch={onSearch} />)

  await user.type(screen.getByRole('textbox'), 'hola')

  // Aún dentro del debounce
  expect(onSearch).not.toHaveBeenCalled()

  // Drenar el debounce + microtasks
  await vi.advanceTimersByTimeAsync(300)

  expect(onSearch).toHaveBeenCalledTimes(1)
  expect(onSearch).toHaveBeenCalledWith('hola')
})`

/* ── El test que pasa pero no asserta (ejercicio) ──────── */
export const s11PassingButNotAssertingBuggy = `// ❌ Este test pasa SIEMPRE. ¿Por qué?
import { firstValueFrom } from 'rxjs'

it('carga el usuario', () => {
  service.getUser(1).subscribe(user => {
    expect(user.name).toBe('Ana')
  })
})`

export const s11PassingButNotAssertingOptions: {
  id: string
  label: string
  code: string
  correct: boolean
  feedback: string
}[] = [
  {
    id: 'done',
    label: 'Añadir un callback `done`',
    code: `it('carga el usuario', (done) => {
  service.getUser(1).subscribe(user => {
    expect(user.name).toBe('Ana')
    done()
  })
})`,
    correct: false,
    feedback:
      'Técnicamente funciona, pero el estilo `done` está desaconsejado desde Vitest / Jest modernos. Si olvidas llamar `done()` el test queda colgado hasta el timeout. Prefiere `async/await`.',
  },
  {
    id: 'firstvaluefrom',
    label: 'Convertir el Observable a Promise con `firstValueFrom`',
    code: `it('carga el usuario', async () => {
  const user = await firstValueFrom(service.getUser(1))
  expect(user.name).toBe('Ana')
})`,
    correct: true,
    feedback:
      '✓ Correcto. `firstValueFrom` espera a la primera emisión y devuelve una Promise. Si el Observable nunca emite, el test hace timeout — que es exactamente lo que quieres (te avisa del problema).',
  },
  {
    id: 'returnpromise',
    label: 'Devolver una Promise manualmente con `new Promise`',
    code: `it('carga el usuario', () => {
  return new Promise((resolve) => {
    service.getUser(1).subscribe(user => {
      expect(user.name).toBe('Ana')
      resolve(null)
    })
  })
})`,
    correct: false,
    feedback:
      'Funciona pero reinventa `firstValueFrom`. Además, olvida manejar errores del Observable. `firstValueFrom` ya los propaga como rejection.',
  },
]

/* ── Checklist del guion síncrono: 7 escenarios ────────── */
export const s11AsyncChecklistPairs: MatchPair[] = [
  {
    id: 'observable',
    prompt: 'Observable finito que emite un valor (Angular/RxJS)',
    answer: 'await firstValueFrom(obs$)',
    explanation:
      'Espera a la primera emisión y devuelve una Promise. Para streams infinitos usa `firstValueFrom(obs$.pipe(take(1)))`.',
  },
  {
    id: 'settimeout',
    prompt: 'setTimeout / setInterval / debounce',
    answer: 'vi.useFakeTimers() + await vi.advanceTimersByTimeAsync(ms)',
    explanation:
      'La variante `Async` drena timers Y microtasks. La variante sync deja `fetch().then()` colgado dentro del callback.',
  },
  {
    id: 'signal-effect',
    prompt: 'Angular Signal con effect()',
    answer: 'TestBed.tick()   (o ApplicationRef.tick())',
    explanation:
      '`effect()` corre en microtask. `TestBed.tick()` (disponible en Angular 19+) lo fuerza. Si tu effect dispara un Observable, combina con `await Promise.resolve()`.',
  },
  {
    id: 'vue-reactivity',
    prompt: 'Vue: cambio de ref → actualización del DOM',
    answer: 'await nextTick()',
    explanation:
      'Vue batchea las actualizaciones del DOM. `nextTick()` espera a que se apliquen. `wrapper.trigger()` ya lo hace por dentro.',
  },
  {
    id: 'react-render',
    prompt: 'React: componente que se re-renderiza tras estado async',
    answer: 'await screen.findByText(...)  (o waitFor)',
    explanation:
      '`findBy*` reintenta cada 50ms hasta 1s. NO lo envuelvas en `waitFor`: ya lo lleva dentro.',
  },
  {
    id: 'userevent',
    prompt: 'React: interacción del usuario con userEvent 14',
    answer: 'await user.click(...)   con const user = userEvent.setup()',
    explanation:
      'userEvent 14 es completamente async. Todas las interacciones devuelven Promise. Olvidar el `await` hace que el test pase sin assertar nada.',
  },
  {
    id: 'waitfor-generic',
    prompt: 'Espera genérica: "cuando X condición se cumpla"',
    answer: 'await waitFor(() => expect(...).toBe(...))',
    explanation:
      'Polling con timeout. Nunca pongas side-effects (clicks, dispatches) dentro de `waitFor` — lo reintenta y los duplica.',
  },
]

/* ── Ejercicio extra: match error común ↔ causa raíz ──── */
export const s11AntiPatternPairs: MatchPair[] = [
  {
    id: 'missing-await',
    prompt: `await user.type(input, 'hola')
user.click(submit)   // ← sin await
expect(onSubmit).toHaveBeenCalled()`,
    answer: 'El click queda pendiente cuando llega el expect; el test pasa sin haber clicado.',
    explanation:
      'userEvent 14 es async. Cada llamada devuelve una Promise que hay que esperar con `await`.',
  },
  {
    id: 'findby-in-waitfor',
    prompt: `await waitFor(() =>
  screen.findByText(/ok/i)
)`,
    answer: 'Doble espera redundante; si el elemento no aparece el error es confuso.',
    explanation:
      '`findBy*` ya lleva `waitFor` dentro. Envolverlo duplica el polling y el timeout. Usa uno u otro.',
  },
  {
    id: 'sync-in-async-timer',
    prompt: `vi.useFakeTimers()
fetchWithDelay()
vi.advanceTimersByTime(1000)  // sync
expect(data).toBe('ok')`,
    answer: '`advanceTimersByTime` sync NO resuelve la Promise del fetch; data sigue vacía.',
    explanation:
      'Dentro del `setTimeout` hay un `await fetch()`. La variante sync ejecuta el `setTimeout` pero no drena el microtask del `await`. Usar `advanceTimersByTimeAsync`.',
  },
  {
    id: 'no-real-timers',
    prompt: `beforeEach(() => vi.useFakeTimers())
// no afterEach

it('otro test con setTimeout real', ...)`,
    answer: 'Los fake timers se filtran entre tests; otros tests que dependen de tiempo real rompen.',
    explanation:
      'Hay que restaurar con `afterEach(() => vi.useRealTimers())`. Sin esto, los fake timers contaminan tests posteriores del mismo archivo.',
  },
]

/* ── Quiz ───────────────────────────────────────────────── */
export const s11Quiz: QuizQuestion[] = [
  {
    id: 's11-q1',
    question: '¿Cuál es la diferencia entre vi.advanceTimersByTime() y vi.advanceTimersByTimeAsync()?',
    options: [
      'No hay diferencia, son alias',
      'La versión sync es más rápida pero menos precisa',
      'La versión sync NO flushea Promises; la async SÍ flushea Promises entre ejecuciones de timers',
      'La versión async solo funciona con Angular',
    ],
    correctIndex: 2,
    explanation:
      'vi.advanceTimersByTime() es síncrono y solo ejecuta macrotasks (setTimeout/setInterval). Si un timer callback contiene await o .then(), esas Promises no se resuelven. vi.advanceTimersByTimeAsync() intercala el flush de microtasks entre timers.',
  },
  {
    id: 's11-q2',
    question: '¿Qué reemplaza a fakeAsync/tick/flush de Angular al migrar a Vitest?',
    options: [
      'Se importan de @angular/core/testing igual',
      'vi.useFakeTimers() + vi.advanceTimersByTime() + vi.runAllTimers()',
      'setTimeout y clearTimeout nativos',
      'jasmine.clock() que sigue disponible',
    ],
    correctIndex: 1,
    explanation:
      'fakeAsync() → vi.useFakeTimers(), tick(ms) → vi.advanceTimersByTime(ms), flush() → vi.runAllTimers(). Los patches de Zone.js no aplican en Vitest, así que fakeAsync/tick/flush no funcionan.',
  },
  {
    id: 's11-q3',
    question: '¿Cuál es la forma recomendada de testar una emisión simple de un Observable?',
    options: [
      'Usar subscribe con done callback',
      'Convertir a Promise con firstValueFrom() y usar async/await',
      'Siempre usar marble testing',
      'Mockear el Observable completo',
    ],
    correctIndex: 1,
    explanation:
      'firstValueFrom() convierte la primera emisión del Observable en una Promise, permitiendo usar async/await. Es más limpio que subscribe + done y produce mejores mensajes de error. Marble testing se reserva para streams complejos.',
  },
  {
    id: 's11-q4',
    question: 'En Vue, ¿cuándo usar nextTick() vs flushPromises()?',
    options: [
      'Son intercambiables',
      'nextTick para actualizaciones reactivas del DOM; flushPromises para operaciones async externas (API calls)',
      'nextTick es para Options API; flushPromises para Composition API',
      'nextTick solo funciona con Vitest; flushPromises con Jest',
    ],
    correctIndex: 1,
    explanation:
      'nextTick() espera a que Vue actualice el DOM tras un cambio de estado reactivo. flushPromises() resuelve todas las Promises pendientes (API calls, async operations). A menudo necesitas ambos: flushPromises para la API y luego nextTick para el DOM.',
  },
]

/* ── Quiz adicional (React + escenarios multi-stack) ──── */
export const s11ReactQuiz: QuizQuestion[] = [
  {
    id: 's11-q5',
    question:
      'En React con userEvent 14, ¿qué pasa si olvidas el `await` en `user.click(boton)`?',
    options: [
      'El test falla con un error claro',
      'El click se ejecuta igual porque React es síncrono',
      'El test suele pasar sin haber clicado: el click queda pendiente cuando llega el expect',
      'userEvent lanza un warning y se cancela la acción',
    ],
    correctIndex: 2,
    explanation:
      'userEvent 14 es completamente async. Sin `await`, la Promise se queda colgada y el `expect` siguiente corre antes del click. Es la causa nº 1 de tests que "pasan" sin probar nada en React.',
  },
  {
    id: 's11-q6',
    question:
      'Tienes un hook con `useEffect(() => { api.getUser().then(setData) }, [])`. Testeas con `renderHook`. ¿Por qué el primer `expect(result.current.data)` es `null`?',
    options: [
      'Porque `renderHook` no monta el componente',
      'Porque `useEffect` se ejecuta DESPUÉS del primer commit; hay que esperar con `waitFor`',
      'Porque el mock de `api.getUser` no devuelve nada',
      'Porque falta `act(...)` alrededor de `renderHook`',
    ],
    correctIndex: 1,
    explanation:
      '`useEffect` corre tras el commit. Al leer `result.current` inmediatamente, el estado todavía es el inicial. Hay que envolver la assertion en `await waitFor(() => expect(...))` o usar `findBy*` en su equivalente con componente.',
  },
  {
    id: 's11-q7',
    question:
      'Mezclas userEvent 14 con `vi.useFakeTimers()` y tus tests hacen timeout. ¿Qué falta?',
    options: [
      'Llamar a `vi.useRealTimers()` antes de cada `user.click`',
      'Pasar `advanceTimers: vi.advanceTimersByTime` al `userEvent.setup()`',
      'Cambiar a fireEvent — userEvent no soporta fake timers',
      'Envolver cada llamada en `act(...)`',
    ],
    correctIndex: 1,
    explanation:
      'userEvent usa pequeños delays internos. Con fake timers activos, esos delays se congelan y los tests se cuelgan. `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` le dice a userEvent cómo avanzar el reloj.',
  },
]

/* ── Simulated output ───────────────────────────────────── */
export const s11SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s11-asincronia/' },
  { type: 'info', text: 'fake-timers.test.ts' },
  { type: 'pass', text: 'FakeTimers > debería avanzar el reloj correctamente' },
  { type: 'pass', text: 'FakeTimers > debería flushear Promises con la variante async' },
  { type: 'pass', text: 'Debounce > no busca mientras el usuario escribe' },
  { type: 'pass', text: 'Debounce > cancela búsqueda anterior' },
  { type: 'info', text: 'observables.test.ts' },
  { type: 'pass', text: 'Observables > obtiene primer valor con firstValueFrom' },
  { type: 'pass', text: 'Marbles > filtra números pares' },
  { type: 'pass', text: 'Marbles > transforma valores' },
  { type: 'info', text: 'vue-async.test.ts' },
  { type: 'pass', text: 'Vue > muestra loading y luego datos' },
  { type: 'pass', text: 'Vue > actualiza DOM tras cambio de estado' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  3 passed (3)  |  Tests  9 passed' },
]
