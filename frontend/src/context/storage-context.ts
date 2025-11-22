import { createContext } from 'react'

export type StorageValue = {
  syncedUsers: string[]
  addUser: (u: string) => void
  removeUser: (u: string) => void
  hasUser: (u: string) => boolean
  clear: () => void
}

export const StorageContext = createContext<StorageValue | undefined>(undefined)