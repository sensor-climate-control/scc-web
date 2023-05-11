import React, { useState } from 'react';
import MyCard from "../application/MyCard";
import { useGetWeatherForecastQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";
import WeatherCard from './WeatherCard';
import HorizontalDiv from "../application/HorizontalDiv";
import { Button } from '@mui/material';

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
        <HorizontalDiv>
            {days.map((day, index) => (
                <Button variant="contained" onClick={() => setDay(day)}>
                    {(index === 0) ? "Today" : day.toDateString()}
                </Button>
            ))}
        </HorizontalDiv>
    ) : null

    return (
        <MyCard title="5-day 3-hour WeatherForecast" style={{ width: '60rem', backgroundColor: '#646c7a' }}>
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> : 
                (isSuccess && data && data.list) ? (
                    <div>
                        <div>
                            {buttons}
                        </div>
                        <div>
                            {data.list.map(weather => {
                                if(day && (weather.dt * 1000) >= day.getTime() && (weather.dt * 1000) < day.getTime() + 86400000) {
                                    return <WeatherCard key={weather.dt} weather={weather} />
                                } else {
                                    return null
                                }
                            })}
                        </div>
                    </div>
                ) : (<p>No Data</p>)}
        </MyCard>
    )
}

export default WeatherForecast;
