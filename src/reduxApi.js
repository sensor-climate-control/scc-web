import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseurl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().token

            console.log("==== token: ", token)
            console.log("==== state: ", getState())

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: () => '/api/weather/now',
            extraOptions: { maxRetries: 5 },
        }),
        getAuth: builder.query({
            query: () => '/.auth/me'
        })
    }),
});

export const { useGetWeatherQuery, useGetAuthQuery } = api;