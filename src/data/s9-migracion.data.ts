import type { QuizQuestion, OutputLine } from '../types/guide.types'
import type { MatchPair } from '../components/shared/DragAndDropMatch'

/* ── Comparativa de rendimiento ─────────────────────────── */
export const s9PerformanceComparison = `// Comparativa de tiempos de ejecución
//
// ┌──────────────────────┬─────────┬─────────┬─────────┐
// │ Métrica              │  Karma  │  Jest   │ Vitest  │
// ├──────────────────────┼─────────┼─────────┼─────────┤
// │ Arranque en frío     │  30s+   │  ~214s  │  ~38s   │
// │ Watch mode re-run    │  todo   │  ~8.4s  │  ~0.3s  │
// │ Uso de memoria       │  Alto   │  Base   │  -30%   │
// │ Overhead de arranque │  30s+   │  segs   │  <100ms │
// └──────────────────────┴─────────┴─────────┴─────────┘
//
// Vitest es ~10x más rápido que Karma
// y ~5x más rápido que Jest en arranque en frío`

/* ── Configuración Angular 21+ ──────────────────────────── */
export const s9AngularConfigBefore = `// angular.json — ANTES (Karma)
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "karmaConfig": "karma.conf.js",
      "polyfills": ["zone.js", "zone.js/testing"],
      "tsConfig": "tsconfig.spec.json"
    }
  }
}`

export const s9AngularConfigAfter = `// angular.json — DESPUÉS (Vitest)
{
  "test": {
    "builder": "@angular/build:unit-test",
    "options": {
      "tsConfig": "tsconfig.spec.json"
    }
  }
}

// tsconfig.spec.json — cambiar types:
// ANTES: "types": ["jasmine"]
// DESPUÉS: "types": ["vitest/globals"]

// Ejecutar schematic de migración automática:
// ng g @schematics/angular:refactor-jasmine-vitest`

/* ── Configuración Angular 17-20 (AnalogJS) ─────────────── */
export const s9AnalogConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
  },
}))

// src/test-setup.ts
import '@angular/compiler'
import '@analogjs/vitest-angular/setup-zone'
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed'

setupTestBed({ zoneless: false })`

/* ── Configuración Vue ──────────────────────────────────── */
export const s9VueConfig = `// vite.config.ts — Vue + Vitest
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    }
  }
})`

/* ── Equivalencias de Spies ─────────────────────────────── */
export const s9SpiesJasmine = `// JASMINE — Spies
const spy = jasmine.createSpy('mySpy');
spy.and.returnValue(42);

spyOn(obj, 'method').and.callFake(fn);
spyOn(obj, 'method').and.callThrough();

// createSpyObj para servicios completos
const svc = jasmine.createSpyObj('UserService', [
  'getUser', 'saveUser'
]);
svc.getUser.and.returnValue(of(mockUser));

// Verificar llamadas
expect(spy.calls.count()).toBe(2);
expect(spy.calls.argsFor(0)).toEqual(['arg1']);
expect(spy.calls.mostRecent().args).toEqual(['arg2']);`

export const s9SpiesVitest = `// VITEST — Equivalentes
const spy = vi.fn();
spy.mockReturnValue(42);

vi.spyOn(obj, 'method').mockImplementation(fn);
vi.spyOn(obj, 'method'); // callThrough por defecto

// Crear objetos mock manualmente
const svc = {
  getUser: vi.fn(() => of(mockUser)),
  saveUser: vi.fn(),
};

// Verificar llamadas
expect(spy.mock.calls.length).toBe(2);
expect(spy.mock.calls[0]).toEqual(['arg1']);
expect(spy.mock.lastCall).toEqual(['arg2']);`

/* ── Equivalencias de Matchers ──────────────────────────── */
export const s9MatchersJasmine = `// JASMINE — Matchers con namespace jasmine.*
expect(result).toEqual(
  jasmine.objectContaining({
    name: jasmine.any(String),
    items: jasmine.arrayContaining([
      jasmine.objectContaining({ id: 1 })
    ])
  })
);

// Foco y skip
fdescribe('solo esto', () => {
  fit('solo este test', () => { });
});
xdescribe('saltar esto', () => { });
xit('saltar este test', () => { });`

export const s9MatchersVitest = `// VITEST — Cambio de namespace: jasmine.* → expect.*
expect(result).toEqual(
  expect.objectContaining({
    name: expect.any(String),
    items: expect.arrayContaining([
      expect.objectContaining({ id: 1 })
    ])
  })
);

// Foco y skip
describe.only('solo esto', () => {
  it.only('solo este test', () => { });
});
describe.skip('saltar esto', () => { });
it.skip('saltar este test', () => { });`

/* ── Equivalencias de Timers ────────────────────────────── */
export const s9TimersJasmine = `// JASMINE + ANGULAR — Timers
beforeEach(() => {
  jasmine.clock().install();
});
afterEach(() => {
  jasmine.clock().uninstall();
});

it('ejecuta tras delay', () => {
  const cb = jasmine.createSpy('callback');
  setTimeout(cb, 1000);

  jasmine.clock().tick(999);
  expect(cb).not.toHaveBeenCalled();

  jasmine.clock().tick(1);
  expect(cb).toHaveBeenCalledTimes(1);
});

// Mock de fecha
jasmine.clock().mockDate(new Date(2026, 3, 8));`

export const s9TimersVitest = `// VITEST — Equivalentes
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

it('ejecuta tras delay', () => {
  const cb = vi.fn();
  setTimeout(cb, 1000);

  vi.advanceTimersByTime(999);
  expect(cb).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(cb).toHaveBeenCalledTimes(1);
});

// Mock de fecha
vi.setSystemTime(new Date(2026, 3, 8));`

/* ── Paquetes a desinstalar/instalar ────────────────────── */
export const s9CleanupScript = `# 1. Eliminar archivos de Karma
rm karma.conf.js src/test.ts

# 2. Desinstalar paquetes legacy
npm uninstall karma karma-chrome-launcher \\
  karma-coverage karma-jasmine \\
  karma-jasmine-html-reporter \\
  jasmine-core @types/jasmine

# 3. Instalar Vitest
# Angular 21+:
npm install -D vitest jsdom

# Angular 17-20 (AnalogJS):
npm install -D @analogjs/vite-plugin-angular \\
  @analogjs/vitest-angular vitest jsdom

# Vue:
npm install -D vitest @vue/test-utils happy-dom`

/* ── Helper createSpyObj (migración manual) ─────────────── */
export const s9CreateSpyObjHelper = `// El patrón que NO migra el schematic: jasmine.createSpyObj
//
// En Jasmine:
const svc = jasmine.createSpyObj('UserService', [
  'getUser', 'saveUser', 'deleteUser',
])
svc.getUser.and.returnValue(of(mockUser))

// ❌ Escritura manual repetitiva en Vitest:
const svc = {
  getUser: vi.fn().mockReturnValue(of(mockUser)),
  saveUser: vi.fn(),
  deleteUser: vi.fn(),
}

// ✅ Helper reutilizable (ponerlo en test-utils.ts):
import { vi, type Mock } from 'vitest'

export function createSpyObj<T>(
  methods: (keyof T)[],
): Record<keyof T, Mock> {
  return Object.fromEntries(
    methods.map((m) => [m, vi.fn()]),
  ) as Record<keyof T, Mock>
}

// Uso tipado (el tipo se conserva, los asserts son seguros):
const svc = createSpyObj<UserService>([
  'getUser', 'saveUser', 'deleteUser',
])
svc.getUser.mockReturnValue(of(mockUser))
expect(svc.saveUser).toHaveBeenCalledTimes(1)`

/* ── Escenario A vs B: Zone.js vs zoneless ──────────────── */
export const s9ScenarioAB = `// Dos escenarios distintos — comprueba el tuyo antes de migrar
//
// ─── ESCENARIO A: Zone.js testing cargado ───────────────
// En src/test-setup.ts tienes:
import 'zone.js'
import 'zone.js/testing'

// → fakeAsync, tick, flush SIGUEN funcionando en Vitest
//   porque vienen de @angular/core/testing (no de Jasmine).
//   NO hay que migrar esos tests.
it('countdown', fakeAsync(() => {
  component.start()
  tick(1000)
  expect(component.count).toBe(9)
}))

// ─── ESCENARIO B: Zoneless (Angular 18+) ────────────────
// Sin zone.js en el setup. fakeAsync NO existe.
// Sustitución: vi.useFakeTimers + TestBed.tick()
it('countdown zoneless', async () => {
  vi.useFakeTimers()
  component.start()
  vi.advanceTimersByTime(1000)
  await TestBed.tick()   // drena signals/effects
  expect(component.count()).toBe(9)
  vi.useRealTimers()
})

// ⚠️ Tu proyecto probablemente está en A (mayoría de Angular
// 17-20 con zone.js). Si migras a zoneless, es un ejercicio
// separado — no lo mezcles con la migración del runner.`

/* ── Tabla exhaustiva Jasmine ↔ Vitest (archivo 11) ────── */
export interface EquivalenceRow {
  category: 'Spies' | 'Matchers' | 'Timers' | 'Lifecycle' | 'Async'
  jasmine: string
  vitest: string
  note?: string
}

export const s9FullEquivalenceTable: EquivalenceRow[] = [
  // Spies
  { category: 'Spies', jasmine: `jasmine.createSpy('nombre')`, vitest: `vi.fn()`, note: 'El nombre en Vitest se pasa con `vi.fn().mockName("nombre")`' },
  { category: 'Spies', jasmine: `jasmine.createSpyObj('S', ['a','b'])`, vitest: `{ a: vi.fn(), b: vi.fn() }`, note: 'Sin equivalente directo — usa el helper createSpyObj' },
  { category: 'Spies', jasmine: `spyOn(obj, 'm')`, vitest: `vi.spyOn(obj, 'm')`, note: 'Por defecto hace callThrough' },
  { category: 'Spies', jasmine: `.and.returnValue(x)`, vitest: `.mockReturnValue(x)` },
  { category: 'Spies', jasmine: `.and.callFake(fn)`, vitest: `.mockImplementation(fn)` },
  { category: 'Spies', jasmine: `.and.callThrough()`, vitest: `(por defecto)`, note: 'Eliminar la llamada — `vi.spyOn` ya llama al real' },
  { category: 'Spies', jasmine: `.and.throwError('boom')`, vitest: `.mockImplementation(() => { throw new Error('boom') })` },
  { category: 'Spies', jasmine: `spy.calls.count()`, vitest: `spy.mock.calls.length` },
  { category: 'Spies', jasmine: `spy.calls.argsFor(0)`, vitest: `spy.mock.calls[0]` },
  { category: 'Spies', jasmine: `spy.calls.mostRecent().args`, vitest: `spy.mock.lastCall` },
  { category: 'Spies', jasmine: `spy.calls.reset()`, vitest: `spy.mockClear()` },

  // Matchers
  { category: 'Matchers', jasmine: `jasmine.any(Number)`, vitest: `expect.any(Number)` },
  { category: 'Matchers', jasmine: `jasmine.anything()`, vitest: `expect.anything()` },
  { category: 'Matchers', jasmine: `jasmine.objectContaining({...})`, vitest: `expect.objectContaining({...})` },
  { category: 'Matchers', jasmine: `jasmine.arrayContaining([...])`, vitest: `expect.arrayContaining([...])` },
  { category: 'Matchers', jasmine: `jasmine.stringMatching(/re/)`, vitest: `expect.stringMatching(/re/)` },
  { category: 'Matchers', jasmine: `jasmine.truthy() / falsy()`, vitest: `(sin 1:1) toBeTruthy / toBeFalsy`, note: 'Usa los matchers directos en lugar de un helper' },

  // Timers
  { category: 'Timers', jasmine: `jasmine.clock().install()`, vitest: `vi.useFakeTimers()` },
  { category: 'Timers', jasmine: `jasmine.clock().uninstall()`, vitest: `vi.useRealTimers()` },
  { category: 'Timers', jasmine: `jasmine.clock().tick(ms)`, vitest: `vi.advanceTimersByTime(ms)` },
  { category: 'Timers', jasmine: `jasmine.clock().mockDate(d)`, vitest: `vi.setSystemTime(d)` },

  // Lifecycle
  { category: 'Lifecycle', jasmine: `fdescribe / fit`, vitest: `describe.only / it.only`, note: 'Para foco durante debug' },
  { category: 'Lifecycle', jasmine: `xdescribe / xit`, vitest: `describe.skip / it.skip` },
  { category: 'Lifecycle', jasmine: `beforeAll / afterAll`, vitest: `beforeAll / afterAll`, note: 'Idéntico' },

  // Async
  { category: 'Async', jasmine: `it('...', (done) => { ... done() })`, vitest: `it('...', async () => { ... })`, note: 'done está desaconsejado; usar async/await' },
  { category: 'Async', jasmine: `waitForAsync(() => {})`, vitest: `async () => { await ... }` },
  { category: 'Async', jasmine: `.toHaveBeenCalled()`, vitest: `.toHaveBeenCalled()`, note: 'Idéntico' },
  { category: 'Async', jasmine: `.toHaveBeenCalledWith(x)`, vitest: `.toHaveBeenCalledWith(x)`, note: 'Idéntico' },
]

/* ── Ejercicio drag-and-drop · traductor ────────────────── */
export const s9TranslatorPairs: MatchPair[] = [
  {
    id: 't-createspy',
    prompt: `jasmine.createSpy('log')`,
    answer: `vi.fn()`,
    explanation:
      'El `name` de Jasmine se pasa con `.mockName("log")` si necesitas reconocerlo en errores. Es opcional.',
  },
  {
    id: 't-callfake',
    prompt: `spyOn(api, 'get')
  .and.callFake((id) => of(users[id]))`,
    answer: `vi.spyOn(api, 'get')
  .mockImplementation((id) => of(users[id]))`,
    explanation:
      '`.and.callFake` → `.mockImplementation`. Misma semántica: sustituir la función por otra.',
  },
  {
    id: 't-callthrough',
    prompt: `spyOn(api, 'get').and.callThrough()`,
    answer: `vi.spyOn(api, 'get')`,
    explanation:
      '`vi.spyOn` hace callThrough por defecto — llama al método real. Se elimina el `.and.callThrough()`.',
  },
  {
    id: 't-createspyobj',
    prompt: `jasmine.createSpyObj('UserSvc',
  ['getUser', 'saveUser'])`,
    answer: `{ getUser: vi.fn(), saveUser: vi.fn() }
  // o usar helper createSpyObj<T>(...)`,
    explanation:
      'Vitest no tiene equivalente directo. Mejor extraer un helper tipado (`createSpyObj<T>`) y reutilizarlo en toda la suite.',
  },
  {
    id: 't-objectcontaining',
    prompt: `expect(x).toEqual(
  jasmine.objectContaining({ id: 1 })
)`,
    answer: `expect(x).toEqual(
  expect.objectContaining({ id: 1 })
)`,
    explanation:
      'Cambio puro de namespace: `jasmine.*` → `expect.*`. Se aplica igual a `any`, `arrayContaining`, `stringMatching`.',
  },
  {
    id: 't-clock',
    prompt: `jasmine.clock().install()
jasmine.clock().tick(1000)
jasmine.clock().uninstall()`,
    answer: `vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()`,
    explanation:
      'Reloj simulado. La API cambia de nombre pero la semántica es idéntica. `vi.setSystemTime(date)` sustituye a `mockDate`.',
  },
  {
    id: 't-focus',
    prompt: `fdescribe('sospechoso', () => {
  fit('foco aquí', () => { })
})`,
    answer: `describe.only('sospechoso', () => {
  it.only('foco aquí', () => { })
})`,
    explanation:
      '`f*` / `x*` son modificadores de Jasmine. En Vitest se convierten en `.only` / `.skip` encadenados.',
  },
  {
    id: 't-done',
    prompt: `it('obtiene usuario', (done) => {
  svc.getUser(1).subscribe(u => {
    expect(u.name).toBe('Ana')
    done()
  })
})`,
    answer: `it('obtiene usuario', async () => {
  const u = await firstValueFrom(svc.getUser(1))
  expect(u.name).toBe('Ana')
})`,
    explanation:
      'El estilo `done` está desaconsejado. Si olvidas llamar `done()` el test se cuelga. `firstValueFrom` es más claro y falla en el timeout si el Observable no emite.',
  },
]

/* ── Quiz adicional de traducción ───────────────────────── */
export const s9TranslatorQuiz: QuizQuestion[] = [
  {
    id: 's9-q5',
    question:
      'Tu test tiene `spyOn(api, "get").and.callThrough()`. Al migrar a Vitest, ¿qué escribes?',
    options: [
      '`vi.spyOn(api, "get").mockCallThrough()` — existe en Vitest',
      '`vi.spyOn(api, "get")` — el callThrough es el comportamiento por defecto',
      '`vi.mock("api")` con factory que mantiene el original',
      'No hay equivalente, hay que reescribir el test sin spy',
    ],
    correctIndex: 1,
    explanation:
      '`vi.spyOn` ya invoca el método real por defecto. Es uno de los cambios más importantes: en Jasmine, `spyOn` reemplaza el método; en Vitest, lo espía dejándolo pasar. El `.and.callThrough()` se elimina.',
  },
  {
    id: 's9-q6',
    question:
      'Un compañero ha escrito `const svc = jasmine.createSpyObj("UserSvc", ["getUser"])`. El schematic no lo migra. ¿Cuál es la mejor solución?',
    options: [
      'Eliminar el test, no vale la pena migrarlo',
      'Expandirlo inline: `{ getUser: vi.fn() }` en cada test',
      'Crear un helper tipado `createSpyObj<T>(methods)` y reutilizarlo en toda la suite',
      'Instalar un paquete adicional que añada `jasmine.createSpyObj` a Vitest',
    ],
    correctIndex: 2,
    explanation:
      'Un helper tipado preserva el type-safety (`Record<keyof T, Mock>`), evita repetición y facilita refactors. Expandir inline funciona pero rompe la escalabilidad en suites grandes.',
  },
  {
    id: 's9-q7',
    question:
      'Tu `test-setup.ts` carga `zone.js/testing`. Tienes un test con `fakeAsync(() => { tick(1000); ... })`. Migras el runner a Vitest. ¿Qué pasa con ese test?',
    options: [
      'Hay que migrarlo a `vi.useFakeTimers()` sí o sí',
      'Sigue funcionando — `fakeAsync` viene de `@angular/core/testing`, no de Jasmine',
      'Se borra porque Vitest no soporta Zone.js',
      'Hay que reemplazarlo por `async/await`',
    ],
    correctIndex: 1,
    explanation:
      'Si cargas `zone.js/testing` en el setup (escenario A), `fakeAsync`/`tick`/`flush` siguen funcionando. Son APIs de Angular, no de Jasmine. Solo en zoneless (escenario B) hay que migrarlas a `vi.useFakeTimers()`.',
  },
]

/* ── Quiz base ──────────────────────────────────────────── */
export const s9Quiz: QuizQuestion[] = [
  {
    id: 's9-q1',
    question: '¿Cuál es el estado actual de Karma como test runner?',
    options: [
      'Sigue siendo el runner recomendado para Angular',
      'Fue deprecado oficialmente en abril de 2023',
      'Fue reemplazado por Jest como runner oficial',
      'Solo fue deprecado para proyectos con Vue',
    ],
    correctIndex: 1,
    explanation:
      'Karma fue deprecado oficialmente en abril de 2023. Solo recibe parches de seguridad críticos. Angular 21 adoptó Vitest como runner por defecto.',
  },
  {
    id: 's9-q2',
    question: '¿Cómo se migra jasmine.createSpyObj("Svc", ["m1", "m2"]) a Vitest?',
    options: [
      'vi.createSpyObj("Svc", ["m1", "m2"])',
      'vi.mock("Svc")',
      'Crear un objeto manualmente: { m1: vi.fn(), m2: vi.fn() }',
      'No tiene equivalente, hay que eliminar esos tests',
    ],
    correctIndex: 2,
    explanation:
      'Vitest no tiene un equivalente directo a createSpyObj. La solución es crear el objeto manualmente con vi.fn() para cada método. Es más explícito y tipado.',
  },
  {
    id: 's9-q3',
    question: '¿Qué pasa con fakeAsync() y tick() de Angular al migrar a Vitest?',
    options: [
      'Funcionan igual en Vitest',
      'Se migran con el schematic automático',
      'No funcionan en Vitest porque Zone.js no aplica sus patches — hay que usar vi.useFakeTimers()',
      'Solo fallan en Angular 21+',
    ],
    correctIndex: 2,
    explanation:
      'Los patches de Zone.js no se aplican en Vitest. fakeAsync/tick/flush no funcionan. Se migran a vi.useFakeTimers() y vi.advanceTimersByTime(). Esta migración debe hacerse manualmente.',
  },
  {
    id: 's9-q4',
    question: '¿Cuál es el equivalente de jasmine.objectContaining() en Vitest?',
    options: [
      'vi.objectContaining()',
      'expect.objectContaining()',
      'assert.objectContaining()',
      'test.objectContaining()',
    ],
    correctIndex: 1,
    explanation:
      'El cambio es de namespace: jasmine.objectContaining() → expect.objectContaining(). Lo mismo aplica para jasmine.any() → expect.any(), jasmine.arrayContaining() → expect.arrayContaining(), etc.',
  },
]

/* ── Simulated output ───────────────────────────────────── */
export const s9SimulatedOutput: OutputLine[] = [
  { type: 'title', text: '$ ng g @schematics/angular:refactor-jasmine-vitest' },
  { type: 'info', text: 'Scanning test files...' },
  { type: 'pass', text: 'Migrated spyOn() calls → vi.spyOn()' },
  { type: 'pass', text: 'Migrated fdescribe/fit → describe.only/it.only' },
  { type: 'pass', text: 'Migrated jasmine.objectContaining → expect.objectContaining' },
  { type: 'fail', text: 'Manual migration needed: fakeAsync/tick in 3 files' },
  { type: 'fail', text: 'Manual migration needed: jasmine.createSpyObj in 2 files' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Auto-migrated: 47 patterns  |  Manual: 5 files need review' },
]
