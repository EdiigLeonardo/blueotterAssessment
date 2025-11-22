import { useState } from 'react'
import { Button } from '../components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'
import { getHealth } from '../lib/api'

export default function HomePage() {
  const [status, setStatus] = useState<string>('unknown')
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
  async function check() {
    try {
      const res = await getHealth()
      setStatus(res.status ?? 'ok')
    } catch {
      setStatus('error')
    }
  }
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold">Frontend</h1>
      <p className="text-sm text-gray-600">Base: {base}</p>
      <div className="mt-6 flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button onClick={check} variant="outline" className='p-3'>Check backend health</Button>
            </TooltipTrigger>
            <TooltipContent>GET /</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm text-center">Status: {status}</span>
      </div>
    </div>
  )
}