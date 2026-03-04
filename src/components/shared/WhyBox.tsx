import { useState, type ReactNode } from 'react'

interface WhyBoxProps {
  title?: string
  variant?: 'why' | 'tip' | 'warning' | 'info'
  children: ReactNode
  defaultOpen?: boolean
}

const variants = {
  why: {
    icon: '💡',
    label: '¿Por qué?',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/5',
    headerBg: 'bg-yellow-500/10 hover:bg-yellow-500/15',
    text: 'text-yellow-400',
  },
  tip: {
    icon: '✅',
    label: 'Buena práctica',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    headerBg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
    text: 'text-emerald-400',
  },
  warning: {
    icon: '⚠️',
    label: 'Antipatrón',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    headerBg: 'bg-red-500/10 hover:bg-red-500/15',
    text: 'text-red-400',
  },
  info: {
    icon: 'ℹ️',
    label: 'Nota',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    headerBg: 'bg-blue-500/10 hover:bg-blue-500/15',
    text: 'text-blue-400',
  },
}

export default function WhyBox({
  title,
  variant = 'why',
  children,
  defaultOpen = false,
}: WhyBoxProps) {
  const [open, setOpen] = useState(defaultOpen)
  const v = variants[variant]

  return (
    <div className={`rounded-lg border ${v.border} overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 ${v.headerBg} transition-colors`}
      >
        <span className={`flex items-center gap-2 text-sm font-semibold ${v.text}`}>
          <span>{v.icon}</span>
          <span>{title ?? v.label}</span>
        </span>
        <span
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className={`px-4 py-4 ${v.bg} text-sm text-gray-300 leading-relaxed`}>
          {children}
        </div>
      </div>
    </div>
  )
}
