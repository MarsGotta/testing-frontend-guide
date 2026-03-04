import { ProgressProvider } from './context/ProgressContext'
import AppRouter from './router'

export default function App() {
  return (
    <ProgressProvider>
      <AppRouter />
    </ProgressProvider>
  )
}
