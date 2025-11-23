import { useState } from 'react'
import { Button } from '../components/ui/button'
import { listRepos } from '../lib/api'
import type { RepoItem } from '../lib/types'

export default function UserReposPage() {
  const [user, setUser] = useState('')
  const [items, setItems] = useState<RepoItem[]>([])
  async function load(e: React.FormEvent) {
    e.preventDefault()
    const r = await listRepos(user)
    setItems(r ?? [])
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">User repositories</h2>
      <form onSubmit={load} className="mt-6 flex gap-3">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="username" className="border rounded px-3 h-9 w-64" />
        <Button type="submit">Load</Button>
      </form>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">name</th>
              <th className="text-left p-2">language</th>
              <th className="text-left p-2">created_at</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <a className="text-[#1ab7ea]" href={it.url} target="_blank" rel="noreferrer">{it.name}</a>
                </td>
                <td className="p-2">{it.language ?? ''}</td>
                <td className="p-2">{it.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
