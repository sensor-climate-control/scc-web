import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './features/redux/weatherSlice'
import { api } from './reduxApi'
import { setupListeners } from '@reduxjs/toolkit/query/react'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    [api.reducerPath]: api.reducer,
  },

  // enables caching
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)