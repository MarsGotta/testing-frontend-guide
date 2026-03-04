import { useState } from 'react'
import SectionHeader from '../components/shared/SectionHeader'
import WhyBox from '../components/shared/WhyBox'
import CodeBlock from '../components/shared/CodeBlock'
import SimulatedTestOutput from '../components/shared/SimulatedTestOutput'
import Quiz from '../components/shared/Quiz'
import { useProgress } from '../context/ProgressContext'
import {
  s4TodoListCode,
  s4TodoListTestCode,
  s4GetByCode,
  s4QueryByCode,
  s4FindByCode,
  s4QueryTable,
  s4QueryPriority,
  s4WithinExample,
  s4Quiz,
  s4SimulatedOutput,
} from '../data/s4-queries.data'

type QueryTab = 'getBy' | 'queryBy' | 'findBy' | 'todolist'

export default function S4Queries() {
  const { markComplete } = useProgress()
  const [activeTab, setActiveTab] = useState<QueryTab>('getBy')

  const tabs: { id: QueryTab; label: string }[] = [
    { id: 'getBy', label: '🔍 getBy*' },
    { id: 'queryBy', label: '❓ queryBy*' },
    { id: 'findBy', label: '⏳ findBy*' },
    { id: 'todolist', label: '📋 TodoList (completo)' },
  ]

  const tabCode: Record<QueryTab, string> = {
    getBy: s4GetByCode,
    queryBy: s4QueryByCode,
    findBy: s4FindByCode,
    todolist: s4TodoListTestCode,
  }

  const tabFilename: Record<QueryTab, string> = {
    getBy: 'tests/s4-queries/queries-getBy.test.tsx',
    queryBy: 'tests/s4-queries/queries-queryBy.test.tsx',
    findBy: 'tests/s4-queries/queries-findBy.test.tsx',
    todolist: 'tests/s4-queries/TodoList.test.tsx',
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        id="s4"
        icon="🔍"
        title="Queries en Testing Library"
        description="Aprende a seleccionar elementos del DOM con la jerarquía de queries correcta."
        sectionNumber={5}
      />

      {/* Decision table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. ¿Cuándo usar cada query?</h2>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-300">Prefijo</th>
                <th className="text-left px-4 py-3 text-gray-300">No encontrado</th>
                <th className="text-left px-4 py-3 text-gray-300">Cuándo usarlo</th>
              </tr>
            </thead>
            <tbody>
              {s4QueryTable.map((row, idx) => (
                <tr key={row.prefix} className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                  <td className="px-4 py-3 font-mono text-blue-400">{row.prefix}</td>
                  <td className="px-4 py-3 text-gray-400">{row.notFound}</td>
                  <td className="px-4 py-3 text-gray-300">{row.useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Jerarquía de selectores</h2>
        <p className="text-gray-400">
          Usa siempre la query <strong className="text-white">más específica y semántica</strong> posible.
          <code className="text-emerald-400 mx-1">getByRole</code> es la preferida,
          <code className="text-emerald-400 mx-1">getByTestId</code> es el último recurso.
        </p>

        <CodeBlock
          code={s4QueryPriority}
          language="tsx"
          showLineNumbers={false}
          filename="Jerarquía completa"
        />

        <WhyBox variant="why" title="¿Por qué priorizar getByRole?">
          <p>
            <code className="text-yellow-400">getByRole</code> usa los roles ARIA del HTML,
            que es exactamente cómo los <strong>lectores de pantalla</strong> perciben la página.
            Si tus tests pasan con getByRole, tu app también es accesible.
          </p>
        </WhyBox>
      </div>

      {/* within */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. within() — búsqueda acotada</h2>
        <CodeBlock code={s4WithinExample} language="tsx" showLineNumbers={false} />
      </div>

      {/* Test examples tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Tests de ejemplo</h2>

        <div className="rounded-lg overflow-hidden border border-gray-700">
          <div className="flex flex-wrap bg-gray-800 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-blue-500 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <CodeBlock
            code={tabCode[activeTab]}
            language="tsx"
            filename={tabFilename[activeTab]}
          />
        </div>

        {activeTab === 'todolist' && (
          <details className="rounded-lg border border-gray-700 overflow-hidden">
            <summary className="px-4 py-3 bg-gray-800 cursor-pointer text-sm text-gray-300 hover:text-white">
              Ver código del componente TodoList
            </summary>
            <CodeBlock
              code={s4TodoListCode}
              language="tsx"
              filename="tests/examples/TodoList.tsx"
            />
          </details>
        )}
      </div>

      <SimulatedTestOutput lines={s4SimulatedOutput} title="vitest run s4-queries/" />

      <div className="border-t border-gray-800 pt-8">
        <Quiz questions={s4Quiz} sectionId="s4" onComplete={(score, total) => {
          if (score / total >= 0.7) markComplete('s4')
        }} />
      </div>
    </div>
  )
}
