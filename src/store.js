import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './features/redux/weatherSlice'
import tokenReducer from './features/redux/tokenSlice'
import { api } from './reduxApi'
import { setupListeners } from '@reduxjs/toolkit/query/react'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    token: tokenReducer,
    [api.reducerPath]: api.reducer,
  },

  // enables caching
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)