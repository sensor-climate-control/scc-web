import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../reduxApi';

const initialState = {
    value: { token: null },
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.getAuth.matchFulfilled,
            (state, { payload }) => {
                state.token = payload[0].access_token
            }
        )
    }
    // reducers: {
    //     setToken: (state, action) => {
    //         state.value = action.payload;
    //     },
    // },
})

// export const { setToken, refreshData } = tokenSlice.actions;

export default tokenSlice.reducer;
