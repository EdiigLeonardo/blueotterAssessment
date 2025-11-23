import Header from './components/layout/header'
import RoutesProvider from './providers/RoutesProvider'

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <Header />
      <RoutesProvider />
    </div>
  )
}
