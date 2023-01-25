import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"
import { rootState } from './store';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: baseurl,
        prepareHeaders: (headers, { rootState }) => {
            const token = rootState(token)

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: () => '/api/weather/now',
        }),
        getAuth: builder.query({
            query: () => '/.auth/me'
        })
    }),
});

export const { useGetWeatherQuery, useGetAuthQuery } = api;