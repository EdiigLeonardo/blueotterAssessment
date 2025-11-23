import { useState } from 'react'
import { Button } from '../components/ui/button'
import { getHealth, getUsers } from '../lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import type { User } from '../lib/types'
import * as Avatar from '@radix-ui/react-avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'

export default function HomePage() {
  const [status, setStatus] = useState<string>('unknown')
  const [users, setUsers] = useState<User[]>([])
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
  async function check() {
    try {
      const res = await getHealth()
      console.debug(res)
      setStatus(res.status ?? 'ok')
    } catch {
      setStatus('error')
    }
  }
  async function loadUsers() {
    try {
      const res = await getUsers()
      console.debug({users: res})
      setUsers(res)
    } catch {
      setStatus('error')
    }
  }
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold">Frontend</h1>
      <p className="text-sm text-gray-600">Base: {base}</p>
      <div className="mt-6 flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={check} variant="outline" className='p-3'>Check backend health</Button>
          </TooltipTrigger>
          <TooltipContent>GET /</TooltipContent>
        </Tooltip>
        <span className="text-sm text-center">Status: {status}</span>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={loadUsers} variant="outline" className='p-3'>Get users</Button>
          </TooltipTrigger>
          <TooltipContent>GET/github/users</TooltipContent>
        </Tooltip>
        {users.length > 0 && (
          <>
            <Tabs defaultValue="users">
              <TabsList className="w-full">
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <div className="mt-4">
                  <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <li key={user.id} className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-gray-200">
                            <Avatar.Image className="h-full w-full object-cover" src={user.avatar_url || (user as unknown as {avatarUrl: string}).avatarUrl || ''} alt={user.login} />
                            <Avatar.Fallback className="text-xs font-medium" delayMs={600}>
                              {user.login.slice(0, 2).toUpperCase()}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <span className="text-sm font-medium">{user.login}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
