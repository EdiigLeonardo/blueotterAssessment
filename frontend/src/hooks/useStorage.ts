import { useContext } from 'react'
import { StorageContext } from '../context/storage-context'

export function useStorage() {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('StorageProvider missing')
  return ctx
}