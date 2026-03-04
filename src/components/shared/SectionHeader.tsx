import { useProgress } from '../../context/ProgressContext'

interface SectionHeaderProps {
  id: string
  icon: string
  title: string
  description: string
  sectionNumber: number
}

export default function SectionHeader({
  id,
  icon,
  title,
  description,
  sectionNumber,
}: SectionHeaderProps) {
  const { isComplete } = useProgress()
  const complete = isComplete(id)

  return (
    <div className="mb-8 pb-6 border-b border-gray-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              Sección {sectionNumber}
            </span>
            {complete && (
              <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                <span>✓</span> Completada
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mt-1">{title}</h1>
          <p className="text-gray-400 mt-1 text-base">{description}</p>
        </div>
      </div>
    </div>
  )
}
