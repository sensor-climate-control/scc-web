import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseurl + '/api/',
        prepareHeaders: (headers, { getState }) => {
            const state = getState()
            console.log("==== state: ", state)
            const token = state.token.token
            console.log("==== token: ", token)

            if(token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: (zip_code) => `weather/now?zip=${zip_code}`,
        }),
        getHomeDetails: builder.query({
            query: (home_id) => `homes/${home_id}`,
        }),
        getSensorDetails: builder.query({
            query: (home_id, sensor_id) => `homes/${home_id}/sensors/${sensor_id}`,
        }),
        getUserDetails: builder.query({
            query: (user_id) => {
                return `users/${user_id}`
            },
            providesTags: ['User'],
        }),
        getHomeSensors: builder.query({
            query: (home_id) => ({
                url: `homes/${home_id}/sensors`,
                method: 'GET'
            })
        }),
        login: builder.mutation({
            query: (body) => ({
                url: `users/login`,
                method: 'POST',
                body,
            })
        }),
        createAccount: builder.mutation({
            query: (body) => ({
                url: `users`,
                method: `POST`,
                body
            })
        }),
        createHome: builder.mutation({
            query: (body) => ({
                url: `homes`,
                method: `POST`,
                body
            })
        }),
        modifyUser: builder.mutation({
            query: ({body, user_id}) => ({
                url: `users/${user_id}`,
                method: `PUT`,
                body
            })
        }),
        addHomeToUser: builder.mutation({
            query: ({body, user_id}) => ({
                url: `users/${user_id}/homes`,
                method: `PUT`,
                body
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetWeatherQuery, useGetHomeDetailsQuery, useGetSensorDetailsQuery, useGetUserDetailsQuery, useGetHomeSensorsQuery, useLoginMutation, useCreateAccountMutation, useModifyUserMutation, useCreateHomeMutation, useAddHomeToUserMutation } = api;
