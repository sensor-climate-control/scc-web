import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: baseurl }),
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