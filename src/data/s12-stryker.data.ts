import type { QuizQuestion, OutputLine } from '../types/guide.types'
import type { MatchPair } from '../components/shared/DragAndDropMatch'

/* ── Por qué el coverage miente ─────────────────────────── */
export const s12CoverageLie = `// Función a testar
function canVote(age: number): boolean {
  return age >= 18
}

// Test con 100% de coverage... pero INÚTIL
test('puede votar', () => {
  canVote(20)  // ejecuta la línea, pero NO verifica el resultado
})
// ✅ Coverage: 100% — todas las líneas ejecutadas
// ❌ Mutation score: 0% — ningún mutante detectado

// Stryker muta:  age >= 18  →  age > 18
// El test sigue pasando → ¡el mutante sobrevive!

// ─────────────────────────────────────────────────

// Test MEJORADO que mata al mutante
test('puede votar con exactamente 18', () => {
  expect(canVote(18)).toBe(true)   // mata >= vs >
})

test('no puede votar con 17', () => {
  expect(canVote(17)).toBe(false)  // verifica el boundary
})
// ✅ Coverage: 100%
// ✅ Mutation score: 100% — todos los mutantes detectados`

/* ── Tipos de mutaciones ────────────────────────────────── */
export const s12MutationTypes = `// Stryker genera estos tipos de mutantes automáticamente:
//
// ┌───────────────────┬──────────────┬──────────────┐
// │ Categoría         │ Original     │ Mutado       │
// ├───────────────────┼──────────────┼──────────────┤
// │ Aritmético        │ a + b        │ a - b        │
// │ Aritmético        │ a * b        │ a / b        │
// │ Igualdad          │ a === b      │ a !== b      │
// │ Igualdad          │ a < b        │ a <= b       │
// │ Lógico            │ a && b       │ a || b       │
// │ Condicional       │ if (cond)    │ if (true)    │
// │ Condicional       │ if (cond)    │ if (false)   │
// │ Boolean           │ true         │ false        │
// │ String            │ "foo"        │ ""           │
// │ String            │ ""           │ "Stryker!"   │
// │ Bloque            │ { code }     │ { }          │
// │ Array             │ [1, 2, 3]    │ []           │
// │ Update            │ a++          │ a--          │
// │ Optional chain    │ foo?.bar     │ foo.bar      │
// │ Método            │ toUpperCase  │ toLowerCase  │
// └───────────────────┴──────────────┴──────────────┘
//
// Si un test NO falla con la mutación → tu test es débil`

/* ── Configuración Vitest ───────────────────────────────── */
export const s12ConfigVitest = `// stryker.config.json — Configuración con Vitest
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner"],
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts"
  ],
  "reporters": ["html", "clear-text", "progress"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 0
  }
}

// Instalar:
// npm install -D @stryker-mutator/core @stryker-mutator/vitest-runner
//
// Ejecutar:
// npx stryker run`

/* ── Configuración Angular ──────────────────────────────── */
export const s12ConfigAngular = `// stryker.config.json — Angular + Vitest
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner"],
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/test.ts",
    "!src/environments/*.ts"
  ],
  "ignorers": ["angular"],  // ← CRÍTICO para Angular
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "reporters": ["progress", "clear-text", "html"],
  "concurrency": 4
}

// "ignorers": ["angular"] evita mutar:
// - Objetos de opciones de input(), output(), model()
// - Metadatos de decoradores
// Sin esto, Stryker genera mutantes que rompen la compilación`

/* ── Configuración Vue ──────────────────────────────────── */
export const s12ConfigVue = `// stryker.config.json — Vue + Vitest
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner"],
  "mutate": [
    "src/**/*.ts",
    "src/**/*.vue",       // ← Incluir .vue para mutar <script>
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts"
  ],
  "reporters": ["html", "clear-text", "progress"]
}`

/* ── Optimización ───────────────────────────────────────── */
export const s12Optimization = `// Estrategias de optimización de rendimiento
//
// 1. MODO INCREMENTAL (mayor impacto)
//    Solo re-testea mutantes afectados por cambios
//    npx stryker run --incremental
//
// 2. ARCHIVOS ESPECÍFICOS (para desarrollo local)
//    npx stryker run --mutate "src/services/auth.service.ts"
//
// 3. SOLO ARCHIVOS CAMBIADOS (para CI en PRs)
//    CHANGED=$(git diff --name-only origin/main...HEAD \\
//      -- 'src/**/*.ts' | grep -v '.spec.ts' | tr '\\n' ',')
//    npx stryker run --incremental --mutate "$CHANGED"
//
// 4. IGNORAR MUTANTES ESTÁTICOS
//    { "ignoreStatic": true }
//    Mutantes en código top-level requieren TODOS los tests
//
// 5. TYPESCRIPT CHECKER
//    { "checkers": ["typescript"] }
//    Detecta mutantes inválidos ANTES de ejecutar tests
//
// ┌──────────────────────────┬─────────┬──────────┐
// │ Estrategia               │ Impacto │ Esfuerzo │
// ├──────────────────────────┼─────────┼──────────┤
// │ Modo incremental         │  ALTO   │  Bajo    │
// │ Solo archivos cambiados  │  ALTO   │  Medio   │
// │ Ignorar estáticos        │  MEDIO  │  Bajo    │
// │ TypeScript checker       │  MEDIO  │  Bajo    │
// │ Selección de archivos    │  MEDIO  │  Bajo    │
// └──────────────────────────┴─────────┴──────────┘`

/* ── Ejemplo de mutante sobreviviente ───────────────────── */
export const s12SurvivedExample = `// Ejemplo: mutante sobreviviente y cómo matarlo

// Código original
function applyDiscount(price: number, discount: number): number {
  if (discount > 0) {
    return price * (1 - discount / 100)
  }
  return price
}

// Test actual (débil)
test('aplica descuento', () => {
  expect(applyDiscount(100, 20)).toBe(80)
  expect(applyDiscount(100, 0)).toBe(100)
})

// Stryker muta: discount > 0  →  discount >= 0
// El test sigue pasando porque:
//   applyDiscount(100, 0) → 100 * (1 - 0/100) = 100 ✓
// ¡El mutante sobrevive!

// Test mejorado que mata al mutante
test('aplica descuento', () => {
  expect(applyDiscount(100, 20)).toBe(80)
  expect(applyDiscount(100, 0)).toBe(100)
  // Verificar que descuento negativo NO se aplica
  expect(applyDiscount(100, -10)).toBe(100) // mata >= vs >
})`

/* ── Desactivar mutantes ────────────────────────────────── */
export const s12DisableMutants = `// Desactivar mutantes equivalentes o irrelevantes

// Desactivar una línea específica
// Stryker disable next-line EqualityOperator: equivalente
return a >= 0 ? a : -a

// Desactivar un bloque completo
// Stryker disable all
const CONFIG = {
  timeout: 5000,
  retries: 3,
  baseUrl: 'https://api.example.com',
}
// Stryker restore all

// Excluir tipos de mutación en la config
{
  "mutator": {
    "excludedMutations": [
      "ObjectLiteral",
      "StringLiteral"
    ]
  }
}`

/* ── CI Pipeline ────────────────────────────────────────── */
export const s12CIPipeline = `# GitHub Actions — Mutation Testing en PRs
name: Mutation Testing
on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1-5'  # Noches entre semana

jobs:
  mutation-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx stryker run --incremental
      - uses: actions/upload-artifact@v4
        with:
          name: mutation-report
          path: reports/mutation.html`

/* ── Quiz ───────────────────────────────────────────────── */
export const s12Quiz: QuizQuestion[] = [
  {
    id: 's12-q1',
    question: '¿Por qué el code coverage puede dar una falsa sensación de seguridad?',
    options: [
      'Porque solo funciona con Jest, no con Vitest',
      'Porque mide si el código fue ejecutado, no si fue verificado con assertions adecuadas',
      'Porque no cuenta los archivos de configuración',
      'Porque siempre muestra el 100%',
    ],
    correctIndex: 1,
    explanation:
      'El coverage mide qué líneas se ejecutaron durante los tests, pero no si las assertions son correctas o suficientes. Puedes tener 100% coverage con tests que ejecutan todo pero no verifican nada.',
  },
  {
    id: 's12-q2',
    question: '¿Qué significa que un mutante "sobrevivió"?',
    options: [
      'Que el test detectó el cambio y falló correctamente',
      'Que Stryker no pudo generar el mutante',
      'Que todos los tests pasaron a pesar de la mutación — los tests no detectaron el cambio',
      'Que hubo un error de compilación con el mutante',
    ],
    correctIndex: 2,
    explanation:
      'Un mutante sobreviviente significa que Stryker cambió tu código (ej: + a -) y todos los tests siguieron pasando. Esto indica que tus tests no son suficientemente buenos para detectar ese tipo de error.',
  },
  {
    id: 's12-q3',
    question: '¿Cuál es la estrategia más impactante para optimizar el tiempo de Stryker?',
    options: [
      'Aumentar la concurrencia al máximo',
      'Usar el modo incremental (--incremental)',
      'Desactivar todos los mutantes de string',
      'Ejecutar solo un test por mutante',
    ],
    correctIndex: 1,
    explanation:
      'El modo incremental guarda los resultados y en ejecuciones posteriores solo re-testea mutantes afectados por cambios en el código. En un ejemplo real, de 3,965 mutantes solo 234 se re-testean.',
  },
  {
    id: 's12-q4',
    question: '¿Para qué sirve "ignorers": ["angular"] en la config de Stryker?',
    options: [
      'Para ignorar todos los archivos de Angular',
      'Para no ejecutar tests de Angular',
      'Para evitar mutar código que debe ser estático para el compilador de Angular (decoradores, input/output)',
      'Para usar Karma en vez de Vitest',
    ],
    correctIndex: 2,
    explanation:
      'El ignorer "angular" evita generar mutantes en código que el compilador de Angular requiere que sea estático: objetos de opciones de input(), output(), model() y metadatos de decoradores. Sin esto, Stryker genera mutantes que rompen la compilación.',
  },
]

/* ── Roadmap por fases (22 % → 60 %+) ───────────────────── */
export interface RoadmapPhase {
  id: string
  range: string
  focus: string
  description: string
  techniques: string[]
  mutatorCategories: string[]
}

export const s12RoadmapPhases: RoadmapPhase[] = [
  {
    id: 'fase-0',
    range: 'Punto de partida · ~22 %',
    focus: 'Baseline',
    description:
      'Ejecuta Stryker con `"break": null` y `"thresholds": { "high": 0, "low": 0 }`. El objetivo NO es pasar el threshold todavía, sino medir dónde estás y qué mutantes dominan el reporte.',
    techniques: [
      'Reporte HTML abierto en el navegador',
      'Exportar el JSON a una hoja para clasificar supervivientes',
    ],
    mutatorCategories: ['Todos — solo se observa'],
  },
  {
    id: 'fase-1',
    range: 'Fase 1 · 22 % → 35 %',
    focus: 'Atacar NoCoverage',
    description:
      'Los `NoCoverage` son los más rentables: son mutantes sin NINGÚN test que los toque. Añadir un solo test por archivo suele subir el score varios puntos. Se paraleliza bien por archivo entre el equipo.',
    techniques: [
      'Filtrar el reporte por `status: NoCoverage`',
      'Añadir al menos un test por función sin cobertura',
      'Tests de happy path primero — luego ramificaciones',
    ],
    mutatorCategories: ['BlockStatement', 'StringLiteral', 'ArrayDeclaration'],
  },
  {
    id: 'fase-2',
    range: 'Fase 2 · 35 % → 50 %',
    focus: 'Boundary + Equality',
    description:
      'Los mutantes `Survived` en `ConditionalExpression` y `EqualityOperator` se matan con boundary testing: probar el valor justo del límite, el anterior y el siguiente. Conviene asignar un dev por dominio para que los boundaries queden consistentes.',
    techniques: [
      '`it.each([[min - 1, false], [min, true], [min + 1, true]])`',
      'Asserts sobre valores exactos, no sobre `toBeGreaterThan`',
      'Tests negativos explícitos (`expect(...).toBe(false)`)',
    ],
    mutatorCategories: ['ConditionalExpression', 'EqualityOperator', 'ArithmeticOperator'],
  },
  {
    id: 'fase-3',
    range: 'Fase 3 · 50 % → 60 %+',
    focus: 'Error paths & short-circuits',
    description:
      'Lo que queda son `catch` vacíos, promises rechazadas y short-circuits en `LogicalOperator`. Son tests menos frecuentes pero blindan los caminos de error de verdad. Revisar en PR review antes de mergear para no regresar.',
    techniques: [
      'Forzar el `throw` dentro del `try` con mock que rechaza',
      'Assertar el side effect del catch (logger, retry, fallback)',
      'Test con `user = null` y test con `user.isPremium = false`',
    ],
    mutatorCategories: ['LogicalOperator', 'BlockStatement (catch)', 'OptionalChaining'],
  },
]

/* ── `coverageAnalysis: "perTest"` ───────────────────────── */
export const s12PerTestConfig = `// stryker.config.json — la palanca nº 1 de rendimiento
{
  "testRunner": "vitest",
  "coverageAnalysis": "perTest",   // ← CLAVE
  "plugins": ["@stryker-mutator/vitest-runner"]
}

// Sin perTest:
//   por cada mutante corre TODA la suite (miles de tests)
// Con perTest:
//   Stryker sabe qué tests tocan cada mutante y SOLO ejecuta esos
//
// Impacto real en proyectos medianos:
//   2 000 mutantes × 5 s suite = 2,8 h  (sin perTest)
//   2 000 mutantes × 0,1 s avg = 3 min  (con perTest, ~50× más rápido)
//
// Requisito: el runner debe soportar per-test coverage.
// Vitest sí lo soporta. Jest también. Karma no.`

/* ── Galería: los 5 mutantes de libro (E08) ─────────────── */
export interface GalleryMutant {
  id: string
  category: string
  icon: string
  original: string
  mutated: string
  survivesWith: string
  killsWith: string
  explanation: string
}

export const s12GalleryMutants: GalleryMutant[] = [
  {
    id: 'm-conditional',
    category: 'ConditionalExpression',
    icon: '🔀',
    original: `if (discount > 0) {
  return price * (1 - discount / 100)
}`,
    mutated: `if (true) {
  return price * (1 - discount / 100)
}`,
    survivesWith: `test('aplica descuento del 20%', () => {
  expect(total(100, 20)).toBe(80)
})`,
    killsWith: `test('sin descuento devuelve el precio', () => {
  expect(total(100, 0)).toBe(100)
  //  ↑ con discount=0 el mutante if(true) entra y rompe
})`,
    explanation:
      'Stryker sustituye la condición por `true`. El test solo pasa si hay un caso con `discount === 0` que fuerce el camino sin descuento.',
  },
  {
    id: 'm-equality',
    category: 'EqualityOperator',
    icon: '⚖️',
    original: 'if (qty >= minQty) { ... }',
    mutated: 'if (qty > minQty) { ... }',
    survivesWith: `test('permite 10 unidades', () => {
  expect(allow(10, 5)).toBe(true)
})`,
    killsWith: `test.each([
  [minQty - 1, false],
  [minQty,     true],   // ← boundary exacto: mata >= vs >
  [minQty + 1, true],
])('qty=%i permite=%s', (qty, ok) => {
  expect(allow(qty, minQty)).toBe(ok)
})`,
    explanation:
      'El cambio `>=` → `>` solo se detecta testeando el valor JUSTO del límite. Sin `qty === minQty` el test es invisible al mutante.',
  },
  {
    id: 'm-arithmetic',
    category: 'ArithmeticOperator',
    icon: '➗',
    original: 'const withTax = price * 1.21',
    mutated: 'const withTax = price / 1.21',
    survivesWith: `test('suma el IVA', () => {
  expect(addTax(100)).toBeGreaterThan(100)
  //                 ↑ tanto *1.21 como /1.21 pasan esta assertion si price > 1
})`,
    killsWith: `test('100 con IVA son 121', () => {
  expect(addTax(100)).toBe(121)
  //                  ↑ valor exacto mata la mutación
})`,
    explanation:
      'Los matchers "blandos" (`toBeGreaterThan`, `toBeTruthy`) son la causa nº 1 de mutantes supervivientes. Asserta siempre el valor concreto cuando puedas calcularlo.',
  },
  {
    id: 'm-logical',
    category: 'LogicalOperator',
    icon: '🧠',
    original: 'return user && user.isPremium',
    mutated: 'return user || user.isPremium',
    survivesWith: `test('premium devuelve true', () => {
  expect(isPremium({ isPremium: true })).toBe(true)
})`,
    killsWith: `test('user = null NO es premium', () => {
  expect(isPremium(null)).toBe(false)
  //  ↑ con || un user null devolvería user.isPremium (crash)
  //    con && devuelve false limpio
})
test('user no premium devuelve false', () => {
  expect(isPremium({ isPremium: false })).toBe(false)
})`,
    explanation:
      'Para `&&` vs `||` hay que testear los dos operandos por separado: el caso del left-falsy y el caso del right-falsy. Uno solo no basta.',
  },
  {
    id: 'm-block',
    category: 'BlockStatement',
    icon: '📦',
    original: `try {
  await api.save(data)
} catch (err) {
  logger.error('save failed', err)
  throw new ApiError('save', err)
}`,
    mutated: `try {
  await api.save(data)
} catch (err) {
  /* bloque vaciado */
}`,
    survivesWith: `test('guarda correctamente', async () => {
  await expect(service.save({ ok: true })).resolves.not.toThrow()
})`,
    killsWith: `test('si falla, loggea y re-lanza ApiError', async () => {
  api.save.mockRejectedValue(new Error('boom'))
  await expect(service.save({})).rejects.toThrow(ApiError)
  expect(logger.error).toHaveBeenCalledWith('save failed', expect.any(Error))
})`,
    explanation:
      'Vaciar un `catch` solo se detecta con un test que fuerce el throw y verifique el side-effect: logger, retry o re-throw.',
  },
]

/* ── Ejercicio: empareja mutante ↔ test que lo mata ──────── */
export const s12MutantMatchPairs: MatchPair[] = [
  {
    id: 'm-conditional',
    prompt: 'if (discount > 0) { ... }  →  if (true) { ... }',
    answer: `test('sin descuento devuelve precio', () => {
  expect(total(100, 0)).toBe(100)
})`,
    explanation:
      'Con `if(true)` el cálculo se aplica siempre. Hay que probar con `discount = 0` para que el camino "sin descuento" se ejecute.',
  },
  {
    id: 'm-equality',
    prompt: 'if (qty >= min) { ... }  →  if (qty > min) { ... }',
    answer: `it.each([
  [min - 1, false],
  [min,     true],
  [min + 1, true],
])(...)`,
    explanation:
      '`>=` y `>` solo divergen en el valor exacto del límite. Sin el caso `qty === min` el mutante pasa desapercibido.',
  },
  {
    id: 'm-arithmetic',
    prompt: 'price * 1.21  →  price / 1.21',
    answer: `expect(addTax(100)).toBe(121)`,
    explanation:
      'Un matcher blando como `toBeGreaterThan(100)` se pasa tanto con 121 como con 82.6. Hay que assertar el valor exacto.',
  },
  {
    id: 'm-logical',
    prompt: 'user && user.isPremium  →  user || user.isPremium',
    answer: `expect(isPremium(null)).toBe(false)`,
    explanation:
      'Solo el caso `user = null` distingue `&&` (devuelve `null`/false) de `||` (intenta acceder a `null.isPremium` y revienta).',
  },
  {
    id: 'm-block',
    prompt: 'catch (e) { logger.error(e); throw new ApiError(e) }  →  catch (e) { }',
    answer: `expect(logger.error).toHaveBeenCalled()
await expect(service.save({})).rejects.toThrow()`,
    explanation:
      'Un bloque `catch` vaciado solo se detecta assertando el side-effect (log) y el re-throw. Testear solo el happy path no sirve.',
  },
]

/* ── Sub-ejercicio: match estado mutante ↔ interpretación ─ */
export const s12MutantStatusPairs: MatchPair[] = [
  {
    id: 'killed',
    prompt: 'Killed',
    answer: 'Algún test falló cuando Stryker aplicó la mutación. Es el resultado deseado: tus tests detectan el cambio.',
  },
  {
    id: 'survived',
    prompt: 'Survived',
    answer: 'Todos los tests siguieron pasando con el código mutado. Los tests son débiles — atacar aquí en Fase 2.',
  },
  {
    id: 'nocoverage',
    prompt: 'NoCoverage',
    answer: 'Ningún test tocó la línea mutada. Peor que Survived: no hay test que cubra esa rama — atacar primero en Fase 1.',
  },
  {
    id: 'timeout',
    prompt: 'Timeout',
    answer: 'La mutación provocó un bucle infinito u operación que superó el timeout. Cuenta como killed.',
  },
  {
    id: 'runtime',
    prompt: 'RuntimeError / CompileError',
    answer: 'La mutación produjo código inválido (ej. llamar método inexistente). Se descarta del cálculo del score.',
  },
]

/* ── Quiz extra sobre el roadmap ────────────────────────── */
export const s12RoadmapQuiz: QuizQuestion[] = [
  {
    id: 's12-q5',
    question:
      'Tu reporte tiene 40 % NoCoverage, 35 % Survived y 25 % Killed. Estás en 25 % de mutation score. ¿Por dónde atacas primero?',
    options: [
      'Configurar el CI antes de tocar nada más',
      'Matar los Survived porque ya hay tests ahí',
      'Atacar los NoCoverage: añadir al menos un test por archivo — es lo más rentable en Fase 1',
      'Subir el threshold a 60 % para forzar al equipo',
    ],
    correctIndex: 2,
    explanation:
      'Un `NoCoverage` se mata con cualquier test mínimo; un `Survived` requiere un test más fino (boundary o assertion exacta). En Fase 1 del roadmap se priorizan los NoCoverage porque su ratio esfuerzo/resultado es el mejor.',
  },
  {
    id: 's12-q6',
    question:
      'En una suite de 2 000 mutantes con tests que tardan 5 s, Stryker sin `coverageAnalysis: "perTest"` tarda varias horas. ¿Cuál es la razón principal?',
    options: [
      'Stryker corre los tests en un solo hilo',
      'Por cada mutante ejecuta toda la suite, aunque solo uno o dos tests cubran esa línea',
      'Vitest es lento con archivos `.ts`',
      'El reporte HTML bloquea la ejecución',
    ],
    correctIndex: 1,
    explanation:
      'Sin `perTest`, Stryker no sabe qué tests cubren cada mutante y corre la suite entera por cada uno. Con `perTest` limita la ejecución a los tests relevantes, acelerando típicamente entre 10× y 50×.',
  },
  {
    id: 's12-q7',
    question:
      'Tienes un mutante Survived en `if (x > 0)` → `if (x >= 0)`. ¿Qué test lo mata?',
    options: [
      '`expect(fn(5)).toBeGreaterThan(0)`',
      '`expect(fn(0)).toBe(valorCuandoNoEntra)` — testea exactamente el boundary',
      '`expect(fn(-1)).toBeDefined()`',
      'Cualquier test con `fn(10)` funciona',
    ],
    correctIndex: 1,
    explanation:
      '`>` y `>=` divergen solo cuando el valor es exactamente 0. Ni un caso con positivo ni uno con negativo detectan la diferencia — hay que testear el punto exacto del límite.',
  },
]

/* ── Simulated output ───────────────────────────────────── */
export const s12SimulatedOutput: OutputLine[] = [
  { type: 'title', text: '$ npx stryker run --mutate "src/utils/discount.ts"' },
  { type: 'info', text: 'Starting initial test run...' },
  { type: 'pass', text: 'Initial test run succeeded. 12 tests found.' },
  { type: 'info', text: 'Generated 8 mutants for discount.ts' },
  { type: 'pass', text: '#1 ArithmeticOperator: price * (1 - d) → price / (1 - d) — Killed' },
  { type: 'pass', text: '#2 ArithmeticOperator: 1 - discount → 1 + discount — Killed' },
  { type: 'pass', text: '#3 EqualityOperator: discount > 0 → discount >= 0 — Killed' },
  { type: 'fail', text: '#4 ConditionalExpression: if (discount > 0) → if (true) — Survived' },
  { type: 'pass', text: '#5 BlockStatement: { return price * ... } → { } — Killed' },
  { type: 'pass', text: '#6 BooleanLiteral: (implicit) — Killed' },
  { type: 'pass', text: '#7 EqualityOperator: discount > 0 → discount < 0 — Killed' },
  { type: 'pass', text: '#8 ArithmeticOperator: discount / 100 → discount * 100 — Killed' },
  { type: 'summary', text: '' },
  { type: 'summary', text: 'Mutation score: 87.50% (7/8 killed) | 1 survived | Threshold: 80% ✓' },
]
