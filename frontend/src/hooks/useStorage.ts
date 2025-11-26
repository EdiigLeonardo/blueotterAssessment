import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { addUser as addUserAction, removeUser as removeUserAction, clear as clearAction } from '../store/storageSlice'

export function useStorage() {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((s: RootState) => s.storage.syncedUsers)
  const sanitize = (u: string) => u.trim().toLowerCase()
  return {
    syncedUsers: users,
    addUser: (u: string) => dispatch(addUserAction(sanitize(u))),
    removeUser: (u: string) => dispatch(removeUserAction(sanitize(u))),
    hasUser: (u: string) => users.includes(sanitize(u)),
    clear: () => dispatch(clearAction()),
  }
}
