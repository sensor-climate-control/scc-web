import React, { useState } from 'react';
import MyCard from "../application/MyCard";
import { useGetWeatherForecastQuery } from '../../reduxApi';
import WeatherCard from './WeatherCard';
import { Button, Grid, CircularProgress } from '@mui/material';

const WeatherForecast = (props) => {
    const [today] = useState(new Date())
    const [day, setDay] = useState(today)
    const { data, isSuccess, isError, error, isLoading, isUninitialized } = useGetWeatherForecastQuery(
        props.zip_code,
        { 
            pollingInterval: 30000,
            skip: !props.zip_code,
        }
    );

    const days = (today) ? (
        Array.apply(null, Array(5)).map(function (x, i) { return new Date(today.getTime() + (86400000 * i)); })
    ) : null

    const buttons = (days) ? (
        <Grid container item justifyContent="space-evenly" direction="row" alignItems="flex-start" spacing={1}>
            {days.map((day, index) => (
                <Grid item xs="auto">
                    <Button variant="contained" onClick={() => setDay(day)}>
                        {(index === 0) ? "Today" : day.toDateString()}
                    </Button>
                </Grid>
            ))}
        </Grid>
    ) : null

    return (
        <MyCard title="5-day 3-hour WeatherForecast" style={{ minWidth: '20rem', maxWidth: '55rem', backgroundColor: '#646c7a' }}>
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> : 
                (isSuccess && data && data.list) ? (
                    <Grid container spacing={1}>
                        <Grid container item />
                        {buttons}
                        <Grid container item justifyContent="space-evenly" direction="row" alignItems="flex-start" spacing={1}>
                            {data.list.map(weather => {
                                if(day && (weather.dt * 1000) >= day.getTime() && (weather.dt * 1000) < day.getTime() + 86400000) {
                                    return (<Grid item xs="auto">
                                        <WeatherCard key={weather.dt} weather={weather} />
                                    </Grid>)
                                } else {
                                    return null
                                }
                            })}
                        </Grid>
                    </Grid>
                ) : (<p>No Data</p>)}
        </MyCard>
    )
}

export default WeatherForecast;
