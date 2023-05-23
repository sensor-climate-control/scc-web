import WindowOverview from "../features/weather/WindowOverview";
import GraphSection from "../features/weather/graph/GraphSection";
import './Home.css'
import { useStore } from 'react-redux'
import Header from '../features/application/Header';
import { useNavigate } from 'react-router-dom';
import CurrentWeather from '../features/weather/CurrentWeather';
import React, { useEffect } from 'react';
import { useGetUserDetailsQuery, useGetHomeDetailsQuery, useGetHomeSensorsQuery } from '../reduxApi';
import CreateHome from "../features/home/CreateHome";
import CurrentAqi from "../features/weather/CurrentAqi";
import Recommendation from "../features/home/Recommendation";
import WindowTable from "../features/weather/WindowTable";
import { Grid } from '@mui/material';

export default function Home() {
    const store = useStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
    })

    const userid = store.getState().token.userid
    const { data: userdata, isSuccess: skip } = useGetUserDetailsQuery(userid, {skip: !userid});

    let selectedHome = null;
    if (userdata) {
        // Make sure there is a home field
        if (userdata.homes) {
            if (userdata.homes.length > 0) {
                // We should only have one home for now
                selectedHome = userdata.homes[0];
            }
        }
    }

    const { data } = useGetHomeDetailsQuery(selectedHome, {
        skip: !skip,
        pollingInterval: 900000
    })
    // const { data: weather } = useGetCurrentWeatherQuery((data) ? data.zip_code : null, {skip: !data});

    const { data: sensorData } = useGetHomeSensorsQuery(selectedHome, {
        pollingInterval: 300000,
        skip: !skip
    });



    let window_data = []
    // switch to real data
    if (sensorData && sensorData.length > 0) {
        window_data = []
        for (let i = 0; i < sensorData.length; i++) {
            if (sensorData[i].readings) {
                if (sensorData[i].readings.length === 0) {
                    window_data.push({
                        id: sensorData[i]._id,
                        name: sensorData[i].name,
                        status: sensorData[i].active,
                        temp: 0,
                        humidity: 0,
                        lastReadings: [],
                    })
                } else {
                    window_data.push({
                        id: sensorData[i]._id,
                        name: sensorData[i].name,
                        status: sensorData[i].active,
                        temp: sensorData[i].readings[sensorData[i].readings.length - 1].temp_f,
                        humidity: sensorData[i].readings[sensorData[i].readings.length - 1].humidity,
                        lastReadings: sensorData[i].readings,
                    })
                }
            } else {
                window_data.push({
                    id: sensorData[i]._id,
                    name: sensorData[i].name,
                    status: sensorData[i].active,
                    temp: 0,
                    humidity: 0,
                    lastReadings: [],
                })
            }

        }
    }

    return (
        <>
            <Header page_name='View Your Home' user_first_name={(userdata) ? userdata.name : ''} />

            {(
                !userdata || 
                !userdata.homes || 
                userdata.homes.length === 0
            ) ? (<CreateHome userdata={userdata} />)
                :
                (<Grid container item justifyContent="flex-start" direction="row" alignItems="flex-start" spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={8} md={6}>
                        <WindowOverview windows={(window_data.length > 0) ? window_data : []} homeid={(selectedHome) ? selectedHome : false}/>
                    </Grid>
                    <Grid item xs={4} sm={8} md={6}>
                        <GraphSection windows={(window_data.length > 0) ? window_data : []}/>
                    </Grid>
                    <Grid item xs={4} sm={8} md={6}>
                        {
                        data && sensorData ? <WindowTable homeDetails={data} sensorDetails={sensorData} /> :
                            <h2> Loading ... </h2> 
                        }
                    </Grid>
                    <Grid item xs="auto">
                        <CurrentWeather zip_code={(data) ? data.zip_code : false} />
                    </Grid>
                    <Grid item xs="auto">
                        <Recommendation recommendations={(data) ? data.recommendations : false} preferences={(data) ? data.preferences : false} />
                    </Grid>
                    <Grid item xs="auto">
                        <CurrentAqi zip_code={(data) ? data.zip_code : false} />
                    </Grid>
                </Grid>
            )}
        </>
    );
}
