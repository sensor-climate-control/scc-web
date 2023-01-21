import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: baseurl + '/api/' }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: () => 'weather/now',
        }),
    }),
});

export const { useGetWeatherQuery } = api;