import { createSlice } from '@reduxjs/toolkit';
import { endpoint } from '../../App'

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
        },
        refreshData: async (state, action) => {
            let res = await fetch(endpoint + '/now')

            console.log(res.body)
        }
    },
})

export const { setTemp, setHumidity, setFeelsLike, refreshData } = weatherSlice.actions;

export default weatherSlice.reducer;
