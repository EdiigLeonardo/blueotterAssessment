import { useState, type ReactNode } from 'react'
import { Button } from '../components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { syncRepo } from '../lib/api'

export default function SyncRepoPage() {
  const [user, setUser] = useState('')
  const [repo, setRepo] = useState('')
  const [result, setResult] = useState<unknown>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const r = await syncRepo(user, repo)
    setResult(r)
  }
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">Sync single repository</h2>
      <form onSubmit={submit} className="mt-6 flex gap-3">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="username" className="border rounded px-3 h-9 w-48" />
        <input value={repo} onChange={e => setRepo(e.target.value)} placeholder="repository" className="border rounded px-3 h-9 w-48" />
        <Button type="submit">Sync</Button>
      </form>
      {result as unknown as ReactNode && (
        <div className="mt-6">
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">View result</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Sync result</DialogTitle>
              <DialogDescription>Dados retornados pela API</DialogDescription>
              <pre className="mt-4 text-xs bg-gray-50 p-4 rounded max-h-[50vh] overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}