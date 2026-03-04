import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950">
      <TopBar />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="fixed top-3.5 right-4 z-50 md:hidden w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        aria-label="Abrir menú"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <div className="flex pt-14">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-56 fixed left-0 top-14 bottom-0 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-14 bottom-0 w-64 z-40 bg-gray-900 border-r border-gray-800 overflow-y-auto md:hidden">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-56 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
