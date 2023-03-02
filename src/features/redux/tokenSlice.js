import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../reduxApi';

const initialState = {
    value: { token: null },
}

export const tokenReducer = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token
            }
        )
    }
})

export default tokenReducer.reducer;