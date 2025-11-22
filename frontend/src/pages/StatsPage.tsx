import { useState } from 'react'
import { Button } from '../components/ui/button'
import { stats } from '../lib/api'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import type { StatsResponse } from '../lib/types'

export default function StatsPage() {
  const [user, setUser] = useState('')
  const [topN, setTopN] = useState(5)
  const [data, setData] = useState<StatsResponse | null>(null)
  async function load(e: React.FormEvent) {
    e.preventDefault()
    const r = await stats({ user: user || undefined, topN })
    setData(r)
  }
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold">Statistics</h2>
      <form onSubmit={load} className="mt-6 flex gap-3 items-center">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="user (optional)" className="border rounded px-3 h-9 w-56" />
        <input type="number" min={1} max={20} value={topN} onChange={e => setTopN(Number(e.target.value))} className="border rounded px-3 h-9 w-24" />
        <Button type="submit">Load</Button>
      </form>
      {data && (
        <div className="mt-6">
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="top">Top Users</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <div className="mt-3 space-y-3">
              <TabsContent value="summary">
                <pre className="text-xs">{JSON.stringify(data.summary, null, 2)}</pre>
              </TabsContent>
              <TabsContent value="languages">
                <pre className="text-xs">{JSON.stringify(data.languages, null, 2)}</pre>
              </TabsContent>
              <TabsContent value="top">
                <pre className="text-xs">{JSON.stringify(data.top_users_by_repos ?? [], null, 2)}</pre>
              </TabsContent>
              <TabsContent value="timeline">
                <pre className="text-xs">{JSON.stringify(data.timeline_created_monthly, null, 2)}</pre>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  )
}