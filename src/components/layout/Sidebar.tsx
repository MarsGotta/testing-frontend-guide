import { NavLink } from 'react-router-dom'
import { SECTIONS } from '../../data/sections.meta'
import { useProgress } from '../../context/ProgressContext'

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { isComplete } = useProgress()

  return (
    <nav className="flex flex-col h-full py-4 px-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
        Secciones
      </p>

      <ul className="space-y-0.5 flex-1 overflow-y-auto">
        {SECTIONS.map((section, idx) => {
          const complete = isComplete(section.id)

          return (
            <li key={section.id}>
              <NavLink
                to={section.path}
                onClick={onNavigate}
                end={section.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent'
                  }`
                }
              >
                {/* Progress dot */}
                <div className="flex-shrink-0 relative">
                  {complete ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-[9px] text-gray-600 font-bold">{idx + 1}</span>
                    </div>
                  )}
                </div>

                {/* Icon + title */}
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none">{section.icon}</span>
                  <span className="truncate font-medium">{section.shortTitle}</span>
                </span>
              </NavLink>
            </li>
          )
        })}
      </ul>

      <div className="px-3 pt-4 border-t border-gray-800 mt-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          Basado en las mejores prácticas de la comunidad y Testing Library.
        </p>
      </div>
    </nav>
  )
}
