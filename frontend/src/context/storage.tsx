import { useEffect, useMemo, useState } from 'react'
import { StorageContext, type StorageValue } from './storage-context'

function sanitizeUser(u: string) {
  return u.trim().toLowerCase()
}

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('syncedUsers')
      return raw ? JSON.parse(raw) : []
    } catch {
      void 0
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('syncedUsers', JSON.stringify(users))
    } catch {
      void 0
    }
  }, [users])

  const value = useMemo<StorageValue>(() => ({
    syncedUsers: users,
    addUser: (u: string) => {
      const s = sanitizeUser(u)
      setUsers(prev => (prev.includes(s) ? prev : [...prev, s]))
    },
    removeUser: (u: string) => {
      const s = sanitizeUser(u)
      setUsers(prev => prev.filter(x => x !== s))
    },
    hasUser: (u: string) => users.includes(sanitizeUser(u)),
    clear: () => setUsers([]),
  }), [users])

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
}