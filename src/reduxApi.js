import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseurl + '/api/',
        prepareHeaders: (headers, { getState }) => {
            const state = getState()
            const token = state.token.token

            if(token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    tagTypes: ['User', 'Keys', 'Home'],
    endpoints: (builder) => ({
        getCurrentWeather: builder.query({
            query: (zip_code) => `weather/now?zip=${zip_code}`,
        }),
        getWeatherForecast: builder.query({
            query: (zip_code) => `weather?zip=${zip_code}`,
        }),
        getCurrentAqi: builder.query({
            query: (zip_code) => `weather/aqi/now?zip=${zip_code}`,
        }),
        getAqiForecast: builder.query({
            query: (zip_code) => `weather/aqi?zip=${zip_code}`,
        }),
        getHomeDetails: builder.query({
            query: (home_id) => `homes/${home_id}`,
            providesTags: ['Home']
        }),
        getSensorDetails: builder.query({
            query: (home_id, sensor_id) => `homes/${home_id}/sensors/${sensor_id}`,
            providesTags: ['Sensors']
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
            }),
            providesTags: ['Sensors']
        }),
        getApiKeys: builder.query({
            query: (user_id) => ({
                url: `users/${user_id}/tokens`,
                method: `GET`
            }),
            providesTags: ['Keys'],
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
            }),
            invalidatesTags: ['User'],
        }),
        addHomeToUser: builder.mutation({
            query: ({body, user_id}) => ({
                url: `users/${user_id}/homes`,
                method: `PUT`,
                body
            }),
            invalidatesTags: ['User'],
        }),
        addApiKey: builder.mutation({
            query: ({body, user_id}) => ({
                url: `users/${user_id}/tokens`,
                method: `POST`,
                body
            }),
            invalidatesTags: ['Keys', 'User'],
        }),
        removeApiKey: builder.mutation({
            query: ({body, user_id}) => ({
                url: `users/${user_id}/tokens`,
                method: `DELETE`,
                body
            }),
            invalidatesTags: ['Keys', 'User'],
        }),
        modifyHome: builder.mutation({
            query: ({body, home_id}) => ({
                url: `homes/${home_id}`,
                method: `PUT`,
                body
            }),
            invalidatesTags: ['Home']
        }),
        deleteSensor: builder.mutation({
            query: ({home_id, sensor_id}) => ({
                url: `homes/${home_id}/sensors/${sensor_id}`,
                method: `DELETE`
            }),
            invalidatesTags: ['Sensors']
        }),
        addWindow: builder.mutation({
            query: ({body, home_id}) => ({
                url: `homes/${home_id}/windows`,
                method: `POST`,
                body
            }),
            invalidatesTags: ['Home']
        }),
        deleteWindow: builder.mutation({
            query: ({body, home_id}) => ({
                url: `homes/${home_id}/windows`,
                method: `DELETE`,
                body,
            }),
            invalidatesTags: ['Home']
        }),
    }),
});

export const { useGetCurrentWeatherQuery, useGetWeatherForecastQuery, useGetCurrentAqiQuery, useGetAqiForecastQuery, useGetHomeDetailsQuery, useGetSensorDetailsQuery, useGetUserDetailsQuery, useGetHomeSensorsQuery, useGetApiKeysQuery, useLoginMutation, useCreateAccountMutation, useModifyUserMutation, useCreateHomeMutation, useAddHomeToUserMutation, useAddApiKeyMutation, useRemoveApiKeyMutation, useModifyHomeMutation, useDeleteSensorMutation } = api;
