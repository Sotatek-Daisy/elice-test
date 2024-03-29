import { configureStore } from '@reduxjs/toolkit'
import filesReducer from './files/filesSlice'

export const store = configureStore({
  reducer: {
    files: filesReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch