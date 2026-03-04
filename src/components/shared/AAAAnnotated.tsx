import CodeBlock from './CodeBlock'

interface AAAAnnotatedProps {
  arrangeCode: string
  actCode: string
  assertCode: string
  language?: string
  description?: string
}

const regions = [
  {
    key: 'arrange' as const,
    label: 'A1 — Ajustar (Arrange)',
    sublabel: 'Preparar el estado inicial y dependencias',
    borderColor: 'border-green-500',
    badgeBg: 'bg-green-500/10 text-green-400 border-green-500/30',
    dotColor: 'bg-green-500',
  },
  {
    key: 'act' as const,
    label: 'A2 — Actuar (Act)',
    sublabel: 'Ejecutar la acción que se está probando',
    borderColor: 'border-blue-500',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'assert' as const,
    label: 'A3 — Afirmar (Assert)',
    sublabel: 'Verificar que el resultado es el esperado',
    borderColor: 'border-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    dotColor: 'bg-orange-500',
  },
]

export default function AAAAnnotated({
  arrangeCode,
  actCode,
  assertCode,
  language = 'tsx',
  description,
}: AAAAnnotatedProps) {
  const codes: Record<'arrange' | 'act' | 'assert', string> = {
    arrange: arrangeCode,
    act: actCode,
    assert: assertCode,
  }

  return (
    <div className="space-y-3">
      {description && (
        <p className="text-sm text-gray-400 italic">{description}</p>
      )}

      {regions.map((region) => (
        <div key={region.key} className={`border-l-4 ${region.borderColor} pl-4`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${region.badgeBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${region.dotColor}`} />
              {region.label}
            </span>
            <span className="text-xs text-gray-500">{region.sublabel}</span>
          </div>
          <CodeBlock
            code={codes[region.key]}
            language={language}
            showLineNumbers={false}
          />
        </div>
      ))}
    </div>
  )
}
