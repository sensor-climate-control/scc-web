import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './features/redux/weatherSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
})
