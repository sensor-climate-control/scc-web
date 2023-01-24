import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {user_id: null, id_token: null, access_token: null},
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser_id: (state, action) => {
            state.value.user_id = action.payload;
        },
        setId_token: (state, action) => {
            state.value.id_token = action.payload;
        },
        setAccess_token: (state, action) => {
            state.value.access_token = action.payload;
        }
    },
})

export const { setUser_id, setId_token, setAccess_token, refreshData } = authSlice.actions;

export default authSlice.reducer;
