import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {temp: 0, humidity: 0, feelsLike: 0},
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setTemp: (state, action) => {
      state.value.temp = action.payload;
    },
    setHumidity: (state, action) => {
      state.value.humidity = action.payload;
    },
    setFeelsLike: (state, action) => {
      state.value.feelsLike = action.payload;
    }
  },
})

export const { setWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
