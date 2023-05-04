import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../reduxApi';

const initialState = {
    value: { token: null },
}

export const tokenReducer = createSlice({
    name: 'token',
    initialState,
    reducers: {
        addToken(state) {
            state.token = localStorage.getItem("token");
            state.userid = localStorage.getItem("userid");
        },
        logout(state) {
            state.token = null
            state.userid = null
            localStorage.setItem("token", null)
            localStorage.setItem("userid", null)
            localStorage.setItem("expires", null)
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.token = payload.token
                state.userid = payload.userid
                localStorage.setItem("token", payload.token)
                localStorage.setItem("userid", payload.userid)
                localStorage.setItem("expires", payload.expires)
            }
        )
    }
})

export default tokenReducer.reducer;