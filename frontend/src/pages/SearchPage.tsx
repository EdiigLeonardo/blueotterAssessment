import { useState } from 'react'
import { Button } from '../components/ui/button'
import { searchRepos } from '../lib/api'
import type { RepoItem } from '../lib/types'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<RepoItem[]>([])
  async function load(e: React.FormEvent) {
    e.preventDefault()
    const r = await searchRepos(q)
    setItems(r ?? [])
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">Search repositories</h2>
      <form onSubmit={load} className="mt-6 flex gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="query" className="border rounded px-3 h-9 w-64" />
        <Button type="submit">Search</Button>
      </form>
      <ul className="mt-6 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="border rounded p-3">
            <div className="font-medium">
              <a className="text-indigo-600" href={it.url} target="_blank" rel="noreferrer">{it.name}</a>
            </div>
            <div className="text-xs text-gray-600">{it.language ?? ''}</div>
            <div className="text-xs">{it.description ?? ''}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}