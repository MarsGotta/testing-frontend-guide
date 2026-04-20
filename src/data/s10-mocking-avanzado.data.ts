import type { QuizQuestion, OutputLine } from '../types/guide.types'
import type { MatchPair } from '../components/shared/DragAndDropMatch'

/* ── vi.mock() hoisting ─────────────────────────────────── */
export const s10HoistingProblem = `// ❌ ESTO FALLA — myValue no existe cuando vi.mock se ejecuta
const myValue = 'hello'
vi.mock('./module', () => ({
  getValue: vi.fn().mockReturnValue(myValue) // ReferenceError!
}))

// ✅ SOLUCIÓN 1: vi.hoisted()
const { mockGetValue } = vi.hoisted(() => ({
  mockGetValue: vi.fn().mockReturnValue('hello')
}))
vi.mock('./module', () => ({ getValue: mockGetValue }))

// ✅ SOLUCIÓN 2: vi.doMock() — no se hoistea
beforeEach(async () => {
  vi.doMock('./module', () => ({
    getValue: vi.fn().mockReturnValue('dynamic')
  }))
  // requiere import dinámico después
  const { getValue } = await import('./module')
})`

/* ── Mocking HTTP Angular ───────────────────────────────── */
export const s10HttpAngular = `// Angular — HttpTestingController con Vitest
import { provideHttpClient } from '@angular/common/http'
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing'

describe('UserService', () => {
  let service: UserService
  let httpCtrl: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),          // DEBE ir primero
        provideHttpClientTesting(),    // override del HttpClient
      ]
    })
    service = TestBed.inject(UserService)
    httpCtrl = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpCtrl.verify() // asegurar que no hay requests sin flush
  })

  it('debería obtener usuarios', () => {
    const mockUsers = [{ id: 1, name: 'Ana' }]

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers)
    })

    const req = httpCtrl.expectOne('/api/users')
    expect(req.request.method).toBe('GET')
    req.flush(mockUsers) // responder al request
  })
})`

/* ── Mocking HTTP Vue ───────────────────────────────────── */
export const s10HttpVue = `// Vue — Mock de axios con vi.mock()
vi.mock('axios')

import axios from 'axios'
import { mount, flushPromises } from '@vue/test-utils'
import UserList from './UserList.vue'

describe('UserList', () => {
  it('muestra usuarios cargados', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [
        { id: 1, name: 'Ana' },
        { id: 2, name: 'Luis' },
      ]
    })

    const wrapper = mount(UserList)
    await flushPromises()

    expect(wrapper.text()).toContain('Ana')
    expect(wrapper.text()).toContain('Luis')
    expect(axios.get).toHaveBeenCalledWith('/api/users')
  })

  it('muestra error cuando falla', async () => {
    vi.mocked(axios.get).mockRejectedValue(
      new Error('Network Error')
    )

    const wrapper = mount(UserList)
    await flushPromises()

    expect(wrapper.text()).toContain('Error')
  })
})`

/* ── Mocking NgRx Store ─────────────────────────────────── */
export const s10NgRxStore = `// Angular — provideMockStore para NgRx
import { provideMockStore, MockStore } from '@ngrx/store/testing'
import { selectUsers, selectLoading } from './user.selectors'

describe('UserListComponent', () => {
  let store: MockStore

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideMockStore({
          initialState: { users: { list: [], loading: false } }
        })
      ]
    })
    store = TestBed.inject(MockStore)
  })

  afterEach(() => {
    store.resetSelectors() // ¡IMPORTANTE! Limpiar overrides
  })

  it('muestra lista de usuarios', () => {
    // Sobreescribir selectores con valores de test
    store.overrideSelector(selectUsers, [
      { id: 1, name: 'Ana' },
      { id: 2, name: 'Luis' },
    ])
    store.overrideSelector(selectLoading, false)

    const fixture = TestBed.createComponent(UserListComponent)
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toContain('Ana')
  })

  it('verifica que despacha la acción de carga', () => {
    vi.spyOn(store, 'dispatch')
    const fixture = TestBed.createComponent(UserListComponent)
    fixture.detectChanges()

    expect(store.dispatch).toHaveBeenCalledWith(
      loadUsers()
    )
  })
})`

/* ── Mocking Pinia Store ────────────────────────────────── */
export const s10PiniaStore = `// Vue — createTestingPinia para Pinia
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Counter from './Counter.vue'
import { useCounterStore } from '@/stores/counter'

describe('Counter', () => {
  it('muestra el valor inicial del store', () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              counter: { n: 42 }, // id del store → estado
            },
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('42')
  })

  it('llama a la acción increment al hacer click', async () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    const store = useCounterStore()
    await wrapper.find('button').trigger('click')

    // Las acciones son vi.fn() por defecto
    expect(store.increment).toHaveBeenCalledTimes(1)
  })
})

// Testar store en aislamiento (sin componente)
import { setActivePinia, createPinia } from 'pinia'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia()) // Pinia fresca por test
  })

  it('incrementa', () => {
    const store = useCounterStore()
    expect(store.n).toBe(0)
    store.increment() // ejecuta lógica REAL
    expect(store.n).toBe(1)
  })
})`

/* ── Mocking Router ─────────────────────────────────────── */
export const s10RouterAngular = `// Angular — Router moderno (sin RouterTestingModule)
import { provideRouter } from '@angular/router'
import { provideLocationMocks } from '@angular/common/testing'
import { RouterTestingHarness } from '@angular/router/testing'

describe('Navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', component: DashboardComponent },
          { path: 'login', component: LoginComponent },
        ]),
        provideLocationMocks(),
      ]
    })
  })

  it('navega al dashboard', async () => {
    const harness = await RouterTestingHarness.create()
    const comp = await harness.navigateByUrl(
      '/dashboard', DashboardComponent
    )
    expect(comp).toBeTruthy()
  })
})

// Testar guards funcionales
it('redirige si no autenticado', () => {
  const auth = TestBed.inject(AuthService)
  vi.mocked(auth.isLoggedIn).mockReturnValue(false)

  const result = TestBed.runInInjectionContext(() =>
    authGuard(mockRoute, mockState)
  )
  expect(result).toEqual(
    expect.objectContaining({ path: '/login' })
  )
})`

export const s10RouterVue = `// Vue — Mock de useRouter / useRoute
import { useRouter, useRoute } from 'vue-router'
import { shallowMount } from '@vue/test-utils'

vi.mock('vue-router')

describe('NavigationComponent', () => {
  const push = vi.fn()

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push } as any)
    vi.mocked(useRoute).mockReturnValue({
      params: { id: '1' },
      query: {},
    } as any)
    push.mockReset()
  })

  it('navega al hacer submit', async () => {
    const wrapper = shallowMount(MyComponent, {
      global: { stubs: ['RouterLink'] },
    })

    await wrapper.find('button').trigger('click')

    expect(push).toHaveBeenCalledWith({
      name: 'Detail',
      params: { id: '1' }
    })
  })
})`

/* ── Antipatrones ───────────────────────────────────────── */
export const s10AntiOverMocking = `// ❌ ANTI-PATRÓN: Over-mocking
// Mockear la función que estamos probando → no prueba nada
vi.mock('./calculator', () => ({
  add: vi.fn().mockReturnValue(5)
}))

test('add devuelve 5', () => {
  expect(add(2, 3)).toBe(5) // ¡Solo prueba que el mock funciona!
})`

export const s10AntiNoRestore = `// ❌ ANTI-PATRÓN: No restaurar mocks entre tests
it('test 1', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  // Math.random está mockeado...
})

it('test 2', () => {
  // ¡Math.random SIGUE mockeado! — Test pollution
  expect(Math.random()).toBe(0.5) // pasa inesperadamente
})

// ✅ SOLUCIÓN: limpiar automáticamente
// vitest.config.ts → test: { mockReset: true }`

export const s10ClearResetRestore = `// Tres niveles de limpieza de mocks:
//
// ┌──────────────────┬─────────────┬───────────────┬──────────────┐
// │ Método           │ Limpia hist.│ Quita impl.   │ Restaura orig│
// ├──────────────────┼─────────────┼───────────────┼──────────────┤
// │ mockClear()      │     ✅      │      ❌       │      ❌      │
// │ mockReset()      │     ✅      │      ✅       │      ❌      │
// │ mockRestore()    │     ✅      │      ✅       │      ✅      │
// └──────────────────┴─────────────┴───────────────┴──────────────┘
//
// Recomendación: configurar en vitest.config.ts
export default defineConfig({
  test: {
    mockReset: true, // auto-reset entre cada test
  }
})`

/* ── MSW v2 — agnóstico de framework ────────────────────── */
export const s10MswV2 = `// MSW v2 · intercepta a nivel de red (fetch/axios/XHR)
// Funciona igual en Angular, Vue y React.

// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Ana' },
      { id: 2, name: 'Luis' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as { name: string }
    return HttpResponse.json({ id: 3, ...body }, { status: 201 })
  }),

  http.get('/api/users/:id', ({ params }) => {
    if (params.id === '999') {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }
    return HttpResponse.json({ id: Number(params.id), name: 'Ana' })
  }),
]

export const server = setupServer(...handlers)

// src/tests/setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '../mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())     // ← CLAVE
afterAll(() => server.close())

// En un test individual: override puntual de un handler
it('maneja el 500 del backend', async () => {
  server.use(
    http.get('/api/users', () =>
      new HttpResponse(null, { status: 500 })
    ),
  )
  await expect(fetchUsers()).rejects.toThrow()
})`

/* ── React state: Redux Toolkit / Zustand / TanStack Q. ── */
export const s10ReduxToolkit = `// React — Redux Toolkit: provider con store preconfigurado
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userReducer from './userSlice'
import { UserList } from './UserList'

function renderWithStore(
  ui: React.ReactElement,
  preloadedState = {},
) {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState,
  })
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

it('muestra el usuario del store', () => {
  renderWithStore(<UserList />, {
    user: { list: [{ id: 1, name: 'Ana' }] },
  })
  expect(screen.getByText(/ana/i)).toBeInTheDocument()
})

it('permite verificar acciones despachadas', async () => {
  const { store } = renderWithStore(<UserList />)
  await userEvent.click(screen.getByRole('button', { name: /cargar/i }))
  expect(store.getState().user.loading).toBe(true)
})`

export const s10Zustand = `// React — Zustand: dos opciones según el caso

// ── Opción A: reset del store real entre tests ──────────
import { useCartStore } from './cartStore'

const initialState = useCartStore.getState()

beforeEach(() => {
  useCartStore.setState(initialState, true)  // reset total
})

it('añade items al carrito', () => {
  useCartStore.getState().addItem({ id: 1, price: 10 })
  expect(useCartStore.getState().total).toBe(10)
})

// ── Opción B: mock del hook (aislamiento completo) ──────
import { render, screen } from '@testing-library/react'
import { CartSummary } from './CartSummary'
import { useCartStore } from './cartStore'

vi.mock('./cartStore')

it('muestra el total del carrito', () => {
  vi.mocked(useCartStore).mockReturnValue({
    items: [{ id: 1, price: 10 }, { id: 2, price: 5 }],
    total: 15,
    addItem: vi.fn(),
    removeItem: vi.fn(),
  })

  render(<CartSummary />)
  expect(screen.getByText(/total: 15/i)).toBeInTheDocument()
})
// Nota: si tu componente usa selector
// (useCartStore(s => s.total)), el mock tiene que aceptar
// el selector o mejor: usa la Opción A.`

export const s10TanStackQuery = `// React — TanStack Query: QueryClient por test
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { UserDashboard } from './UserDashboard'

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,       // ← sin esto, un error tarda varios
                            //    segundos en resolver el test
        gcTime: 0,          // evita caché entre tests
      },
    },
  })
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  )
}

it('muestra los datos de la query', async () => {
  renderWithQuery(<UserDashboard />)
  // Esperamos al estado cargado
  expect(await screen.findByText(/ana/i)).toBeInTheDocument()
})

it('muestra el error tras fallo de la API', async () => {
  server.use(
    http.get('/api/user', () =>
      new HttpResponse(null, { status: 500 }),
    ),
  )
  renderWithQuery(<UserDashboard />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/error/i)
})`

/* ── Pinia gotcha: createSpy obligatorio ────────────────── */
export const s10PiniaGotcha = `// ⚠️ Pinia + Vitest: createSpy obligatorio
//
// Por defecto, @pinia/testing usa jest.fn para stub de acciones.
// Si usas Vitest, debes decirle que use vi.fn — si no, falla con
// "ReferenceError: jest is not defined".

import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        createSpy: vi.fn,       // ← OBLIGATORIO con Vitest
        initialState: {
          counter: { n: 42 },
        },
        stubActions: true,      // default: las acciones son vi.fn()
      }),
    ],
  },
})

// Extrae esto a un helper global:
// src/testing/pinia-helper.ts
export const testingPinia = (initialState = {}) =>
  createTestingPinia({ createSpy: vi.fn, initialState })`

/* ── Ejercicio: Spot the hoisting bug ───────────────────── */
export interface HoistingBugOption {
  id: string
  label: string
  code: string
  correct: boolean
  feedback: string
}

export const s10HoistingBugOptions: HoistingBugOption[] = [
  {
    id: 'a',
    label: 'Opción A — capturar variable con `vi.mock`',
    code: `// A
const fakeUser = { id: 1, name: 'Ana' }

vi.mock('./api', () => ({
  getUser: vi.fn().mockReturnValue(fakeUser),
}))`,
    correct: false,
    feedback:
      '❌ Falla. `vi.mock` se hoistea al inicio del archivo. Cuando la factory se ejecuta, `fakeUser` todavía no está definida — ReferenceError en runtime. Este es EL bug clásico del hoisting.',
  },
  {
    id: 'b',
    label: 'Opción B — `vi.hoisted` compartiendo referencia',
    code: `// B
const { fakeUser, mockGetUser } = vi.hoisted(() => ({
  fakeUser: { id: 1, name: 'Ana' },
  mockGetUser: vi.fn(),
}))

vi.mock('./api', () => ({ getUser: mockGetUser }))

beforeEach(() => mockGetUser.mockReturnValue(fakeUser))`,
    correct: true,
    feedback:
      '✓ Correcto. `vi.hoisted` se hoistea junto a `vi.mock`, así que ambos comparten el mismo scope temporal. Puedes referenciar las variables en tests con total seguridad.',
  },
  {
    id: 'c',
    label: 'Opción C — `vi.mock` dentro de `beforeEach`',
    code: `// C
beforeEach(() => {
  const fakeUser = { id: 1, name: 'Ana' }
  vi.mock('./api', () => ({
    getUser: vi.fn().mockReturnValue(fakeUser),
  }))
})`,
    correct: false,
    feedback:
      '❌ Falla de otra forma. `vi.mock` dentro de `beforeEach` NO se hoistea (tiene que ser top-level para hacerlo), pero los imports del SUT ya cargaron el módulo REAL antes. El mock no aplica. Para esto existe `vi.doMock` + import dinámico.',
  },
]

/* ── Ejercicio match: qué mockear con qué API ──────────── */
export const s10WhatToMockPairs: MatchPair[] = [
  {
    id: 'http-angular',
    prompt: 'Servicio Angular que hace HttpClient.get()',
    answer: 'provideHttpClient() + provideHttpClientTesting() · HttpTestingController',
    explanation:
      'Lo estándar en Angular: interceptas con `HttpTestingController`, validas método/URL/body y llamas `req.flush(mockData)`.',
  },
  {
    id: 'http-react-vue',
    prompt: 'Componente React/Vue que llama a `fetch` o `axios`',
    answer: 'MSW v2 (setupServer) · mocks a nivel de red',
    explanation:
      'MSW v2 intercepta la capa de red, así testeas exactamente la misma ruta que produce tu app — sin vi.mock del cliente HTTP.',
  },
  {
    id: 'store-pinia',
    prompt: 'Componente Vue que usa un store Pinia',
    answer: 'createTestingPinia({ createSpy: vi.fn, initialState })',
    explanation:
      'El `createSpy: vi.fn` es obligatorio con Vitest. `stubActions: true` (default) convierte las acciones en `vi.fn()` para verificar llamadas sin ejecutar lógica real.',
  },
  {
    id: 'store-ngrx',
    prompt: 'Componente Angular que selecciona de un store NgRx',
    answer: 'provideMockStore({ initialState, selectors }) + overrideSelector',
    explanation:
      '`provideMockStore` con selectores pre-cocinados. Después `store.overrideSelector(s, value)` + `store.refreshState()` para cambiarlos mid-test.',
  },
  {
    id: 'store-zustand',
    prompt: 'Hook Zustand usado por un componente React aislado',
    answer: 'vi.mock del hook · o reset del store real en beforeEach',
    explanation:
      'Dos opciones: mockear el hook con `vi.mock` (aislamiento puro) o usar el store real y resetearlo con `setState(initial, true)` en `beforeEach`.',
  },
  {
    id: 'query-react',
    prompt: 'Hook que hace `useQuery` de TanStack Query',
    answer: 'QueryClient por test con `retry: false` + QueryClientProvider',
    explanation:
      '`retry: false` evita que un error controlado tarde varios segundos en llegar. `gcTime: 0` evita que la caché entre tests contamine.',
  },
  {
    id: 'router-angular',
    prompt: 'Componente Angular 20+ que navega con el Router',
    answer: 'provideRouter([...routes]) + provideLocationMocks() · RouterTestingModule está deprecado',
    explanation:
      '`RouterTestingModule` está deprecado desde Angular 20. Se usa `RouterTestingHarness` + `provideRouter` + `provideLocationMocks`.',
  },
  {
    id: 'module-heavy',
    prompt: 'Componente que importa un módulo enorme (@angular/material)',
    answer: 'vi.mock del módulo con factory · gotcha: vi.hoisted() para variables',
    explanation:
      '`vi.mock` con factory sustituye el módulo entero por stubs ligeros. Si necesitas referencias desde el test, usa `vi.hoisted` porque la factory se hoistea.',
  },
]

/* ── Quiz ───────────────────────────────────────────────── */
export const s10Quiz: QuizQuestion[] = [
  {
    id: 's10-q1',
    question: '¿Por qué vi.mock() no puede acceder a variables del scope del test?',
    options: [
      'Es un bug de Vitest',
      'Porque vi.mock() se hoistea (se mueve al inicio del archivo antes de ejecutarse)',
      'Porque vi.mock() se ejecuta en otro thread',
      'Solo pasa con TypeScript, no con JavaScript',
    ],
    correctIndex: 1,
    explanation:
      'vi.mock() se analiza estáticamente y se mueve al inicio del archivo mediante transformación AST. Se ejecuta antes que cualquier import o variable del test. Usar vi.hoisted() o vi.doMock() para acceder a variables.',
  },
  {
    id: 's10-q2',
    question: '¿Qué hace store.resetSelectors() en tests con NgRx MockStore?',
    options: [
      'Reinicia el estado del store a su valor inicial',
      'Elimina los overrides de selectores configurados con overrideSelector()',
      'Despacha todas las acciones pendientes',
      'Destruye el store completamente',
    ],
    correctIndex: 1,
    explanation:
      'store.resetSelectors() elimina todos los overrides configurados con overrideSelector(). Es esencial llamarlo en afterEach para evitar que los overrides de un test afecten a otros.',
  },
  {
    id: 's10-q3',
    question: '¿Cuál es la diferencia entre mockClear, mockReset y mockRestore?',
    options: [
      'Son sinónimos, hacen lo mismo',
      'Clear limpia historial; Reset también quita implementación; Restore además restaura la función original',
      'Clear es para spies; Reset para mocks; Restore para módulos',
      'Depende del framework (Angular vs Vue)',
    ],
    correctIndex: 1,
    explanation:
      'mockClear solo limpia el historial de llamadas. mockReset además elimina la implementación mock. mockRestore hace todo lo anterior y además restaura la función original (solo para vi.spyOn).',
  },
  {
    id: 's10-q4',
    question: 'En Vue, ¿qué hace createTestingPinia({ stubActions: true })?',
    options: [
      'Desactiva todas las acciones del store',
      'Convierte todas las acciones en vi.fn() para poder verificar llamadas sin ejecutar la lógica real',
      'Crea un store vacío sin acciones',
      'Solo funciona con Vuex, no con Pinia',
    ],
    correctIndex: 1,
    explanation:
      'Con stubActions: true (que es el valor por defecto), todas las acciones del store se reemplazan con vi.fn(). Así puedes verificar que una acción fue llamada sin ejecutar su lógica real (API calls, etc.).',
  },
]

/* ── Quiz extra: multi-stack y MSW ──────────────────────── */
export const s10ExtraQuiz: QuizQuestion[] = [
  {
    id: 's10-q5',
    question:
      'Estás testeando un componente React que hace `fetch("/api/users")`. ¿Cuál es el enfoque más robusto?',
    options: [
      '`vi.mock("node-fetch")` al inicio del test',
      'Reasignar `global.fetch = vi.fn()` en cada test',
      'MSW v2 con `setupServer(...handlers)` y `resetHandlers()` en afterEach — testeas la ruta real',
      'Dejar el fetch real para que sea un "integration test"',
    ],
    correctIndex: 2,
    explanation:
      'MSW intercepta a nivel de red. Ventajas: testeas la misma URL/método que usa la app, no dependes de un cliente HTTP concreto, los handlers se reutilizan entre tests. `resetHandlers()` en afterEach evita fugas.',
  },
  {
    id: 's10-q6',
    question:
      'Tu test con TanStack Query tarda 3-5 segundos incluso sin errores visibles. ¿Qué falta en el `QueryClient`?',
    options: [
      'Añadir `cacheTime: Infinity`',
      'Pasar `defaultOptions: { queries: { retry: false } }`',
      'Envolver el render en `act()`',
      'Montar un solo `QueryClient` global para todos los tests',
    ],
    correctIndex: 1,
    explanation:
      'Por defecto TanStack Query reintenta 3 veces con backoff exponencial ante errores. Aunque no veas el fallo, el test espera todo el backoff. `retry: false` en el `QueryClient` de test lo evita.',
  },
  {
    id: 's10-q7',
    question:
      'En Pinia + Vitest, tu test falla con `ReferenceError: jest is not defined`. ¿Qué pasa?',
    options: [
      'Falta instalar Jest como peer dependency',
      '`createTestingPinia` por defecto usa `jest.fn`; hay que pasarle `createSpy: vi.fn`',
      'Hay que migrar a `jest` en vez de `vitest`',
      'Es un bug de Pinia 3.x',
    ],
    correctIndex: 1,
    explanation:
      '`createTestingPinia` por defecto stubea acciones con `jest.fn`. En un proyecto Vitest, `jest` no existe. La solución es pasar `{ createSpy: vi.fn }` — es un gotcha muy común y silencioso.',
  },
]

/* ── Simulated output ───────────────────────────────────── */
export const s10SimulatedOutput: OutputLine[] = [
  { type: 'title', text: 'vitest run src/tests/s10-mocking-avanzado/' },
  { type: 'info', text: 'http-service.test.ts' },
  { type: 'pass', text: 'UserService > debería obtener usuarios via GET' },
  { type: 'pass', text: 'UserService > debería manejar error 500' },
  { type: 'info', text: 'store-mock.test.ts' },
  { type: 'pass', text: 'UserList > muestra usuarios del selector' },
  { type: 'pass', text: 'UserList > despacha loadUsers al montar' },
  { type: 'info', text: 'router-mock.test.ts' },
  { type: 'pass', text: 'Navigation > navega al dashboard' },
  { type: 'pass', text: 'AuthGuard > redirige si no autenticado' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Test Files  3 passed (3)  |  Tests  6 passed' },
]
