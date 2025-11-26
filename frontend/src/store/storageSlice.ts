import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type StorageState = {
  syncedUsers: string[]
}

function readInitial(): string[] {
  try {
    const raw = localStorage.getItem('syncedUsers')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const initialState: StorageState = { syncedUsers: readInitial() }

export const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<string>) {
      const u = action.payload
      if (!state.syncedUsers.includes(u)) state.syncedUsers.push(u)
    },
    removeUser(state, action: PayloadAction<string>) {
      const u = action.payload
      state.syncedUsers = state.syncedUsers.filter(x => x !== u)
    },
    clear(state) {
      state.syncedUsers = []
    },
  },
})

export const { addUser, removeUser, clear } = storageSlice.actions
export default storageSlice.reducer
