import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: baseurl + '/api/' }),
    endpoints: (builder) => ({
        getWeather: builder.query({
            query: () => 'weather/now',
        }),
        getHomeDetails: builder.query({
            query: (home_id) => `homes/${home_id}`,
        }),
        getSensorDetails: builder.query({
            query: (home_id, sensor_id) => `homes/${home_id}/sensors/${sensor_id}`,
        }),
        getHomeSensors: builder.query({
            async queryFn(home_id) {
                const response = await fetch(`${baseurl}/api/homes/${home_id}`);
                const data = await response.json();

                let sensors = data.sensors;

                let sensors_details = [];
                for (let i = 0; i < sensors.length; i++) {
                    const response = await fetch(`${baseurl}/api/homes/${home_id}/sensors/${sensors[i]}`);
                    const sensor_info = await response.json();

                    sensors_details.push({
                        id: sensors[i],
                        name: sensor_info.name,
                        location: sensor_info.location,
                        readings: sensor_info.readings,
                    });
                }

                return sensors_details ? { data: sensors_details } : { error: "No data" };
            }
        }),
    }),
});

export const { useGetWeatherQuery, useGetHomeDetailsQuery, useGetSensorDetailsQuery, useGetHomeSensorsQuery } = api;