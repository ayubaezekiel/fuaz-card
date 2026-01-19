import { createFileRoute } from '@tanstack/react-router'
import { FUAZIDCardSuite } from '@/components/IDCard'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <FUAZIDCardSuite />
}
