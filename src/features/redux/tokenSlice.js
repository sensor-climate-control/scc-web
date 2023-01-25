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
            api.endpoints.getAuth.matchFulfilled,
            (state, { payload }) => {
                state.token = payload[0].access_token
            }
        )
    }
})

export default tokenReducer.reducer;
