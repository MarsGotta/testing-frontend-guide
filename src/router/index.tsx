import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'

const S0Intro = lazy(() => import('../sections/S0Intro'))
const S1Anatomy = lazy(() => import('../sections/S1Anatomy'))
const S2JestVitest = lazy(() => import('../sections/S2JestVitest'))
const S3PrimerComponente = lazy(() => import('../sections/S3PrimerComponente'))
const S4Queries = lazy(() => import('../sections/S4Queries'))
const S5Eventos = lazy(() => import('../sections/S5Eventos'))
const S6Mocking = lazy(() => import('../sections/S6Mocking'))
const S7SnapshotsA11y = lazy(() => import('../sections/S7SnapshotsA11y'))
const S8BuenasPracticas = lazy(() => import('../sections/S8BuenasPracticas'))

const Loading = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-gray-400 animate-pulse">Cargando sección…</div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><S0Intro /></Suspense> },
      { path: 'anatomia', element: <Suspense fallback={<Loading />}><S1Anatomy /></Suspense> },
      { path: 'jest-vitest', element: <Suspense fallback={<Loading />}><S2JestVitest /></Suspense> },
      { path: 'primer-componente', element: <Suspense fallback={<Loading />}><S3PrimerComponente /></Suspense> },
      { path: 'queries', element: <Suspense fallback={<Loading />}><S4Queries /></Suspense> },
      { path: 'eventos', element: <Suspense fallback={<Loading />}><S5Eventos /></Suspense> },
      { path: 'mocking', element: <Suspense fallback={<Loading />}><S6Mocking /></Suspense> },
      { path: 'snapshots-a11y', element: <Suspense fallback={<Loading />}><S7SnapshotsA11y /></Suspense> },
      { path: 'buenas-practicas', element: <Suspense fallback={<Loading />}><S8BuenasPracticas /></Suspense> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
