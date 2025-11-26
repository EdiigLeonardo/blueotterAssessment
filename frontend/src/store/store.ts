import { configureStore } from '@reduxjs/toolkit'
import storageReducer from './storageSlice'

export const store = configureStore({
  reducer: { storage: storageReducer },
})

store.subscribe(() => {
  try {
    const users = store.getState().storage.syncedUsers
    localStorage.setItem('syncedUsers', JSON.stringify(users))
  } catch {
    /* ignore */
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
