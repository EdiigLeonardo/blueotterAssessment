import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui/button'
import { syncUser } from '../lib/api'
import { useStorage } from '../hooks/useStorage'

export default function SyncUserPage() {
  const [user, setUser] = useState('')
  const [result, setResult] = useState<unknown>(null)
  const storage = useStorage()
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const u = user.trim().toLowerCase()
    if (!u) return
    if (storage.hasUser(u)) {
      setResult({ status: 'already_synced', user: u })
      return
    }
    const r = await syncUser(u)
    setResult(r)
    storage.addUser(u)
  }
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">Sync user repositories</h2>
      <form onSubmit={submit} className="mt-6 flex gap-3">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="username" className="border rounded px-3 h-9 w-64" />
        <Button type="submit" disabled={!user.trim() || storage.hasUser(user)}>Sync</Button>
      </form>
      {result as unknown as ReactNode  && (
        <pre className="mt-6 text-xs bg-gray-50 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}