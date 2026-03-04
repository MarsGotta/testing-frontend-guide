import { useState } from 'react'
import CodeBlock from './CodeBlock'

interface ComponentTestTabsProps {
  componentCode: string
  testCode: string
  componentFilename?: string
  testFilename?: string
  componentLanguage?: string
  testLanguage?: string
}

type TabId = 'componente' | 'test'

export default function ComponentTestTabs({
  componentCode,
  testCode,
  componentFilename = 'Component.tsx',
  testFilename = 'Component.test.tsx',
  componentLanguage = 'tsx',
  testLanguage = 'tsx',
}: ComponentTestTabsProps) {
  const [active, setActive] = useState<TabId>('componente')

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      {/* Tab Bar */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {(['componente', 'test'] as TabId[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              px-5 py-2.5 text-sm font-medium transition-colors
              ${active === tab
                ? 'text-white border-b-2 border-blue-500 bg-gray-900'
                : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'}
            `}
          >
            {tab === 'componente' ? (
              <span className="flex items-center gap-1.5">
                <span>🧩</span> Componente
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>🧪</span> Test
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === 'componente' ? (
        <CodeBlock
          code={componentCode}
          language={componentLanguage}
          filename={componentFilename}
          showLineNumbers={true}
        />
      ) : (
        <CodeBlock
          code={testCode}
          language={testLanguage}
          filename={testFilename}
          showLineNumbers={true}
        />
      )}
    </div>
  )
}
