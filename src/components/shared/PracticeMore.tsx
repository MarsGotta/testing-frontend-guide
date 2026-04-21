interface RepoFile {
  path: string
  description: string
}

interface PracticeMoreProps {
  title?: string
  intro: string
  repoFiles?: RepoFile[]
  materialReference?: string
}

/**
 * Bloque de cierre de sección para el alumno.
 * Muestra recursos para seguir practicando: archivos del repo demo y
 * referencia al material escrito. Lenguaje orientado a quien acaba de
 * aprender el concepto y quiere profundizar o verlo en código real.
 */
export default function PracticeMore({
  title = 'Sigue practicando',
  intro,
  repoFiles,
  materialReference,
}: PracticeMoreProps) {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">📖</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-300">{title}</p>
          <p className="text-sm text-gray-200 mt-1 leading-relaxed">{intro}</p>
        </div>
      </div>

      {repoFiles && repoFiles.length > 0 && (
        <div className="pt-3 border-t border-emerald-500/20">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
            En el repo del taller
          </p>
          <ul className="space-y-1.5">
            {repoFiles.map((file) => (
              <li key={file.path} className="text-xs">
                <code className="text-emerald-300 font-mono">{file.path}</code>
                <span className="text-gray-400 ml-2">— {file.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {materialReference && (
        <div className="pt-3 border-t border-emerald-500/20">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
            Profundiza con el material escrito
          </p>
          <p className="text-xs text-gray-300">
            <code className="font-mono text-emerald-300">{materialReference}</code>
          </p>
        </div>
      )}
    </div>
  )
}
