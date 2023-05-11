import React, { useEffect } from 'react';
import HomeInfo from './HomeInfo';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'react-redux'
import { useGetHomeDetailsQuery, useGetUserDetailsQuery } from '../../reduxApi';
import { Grid, CircularProgress } from '@mui/material';
import Header from '../application/Header';
import WeatherForecast from '../weather/WeatherForecast';

function HomeDetailPage () {
    const store = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    const userid = store.getState().token.userid
    const { data: userdata, isSuccess } = useGetUserDetailsQuery(userid);

    const { data: homedata } = useGetHomeDetailsQuery(((userdata) ? userdata.homes[0] : null), {
        skip: (!isSuccess || !userdata.homes || userdata.homes.length === 0)
    })

    return (
        <>
            <Header page_name='Home Information' user_first_name={(userdata) ? userdata.name : ''} />
            {(!userdata || !homedata) ? <CircularProgress /> : (
                <Grid container item justifyContent="flex-start" direction="row" alignItems="flex-start" spacing={1}>
                    {userdata.homes.map((home, index) => (
                        <Grid key={index} item xs="auto">
                            <HomeInfo homeid={home} />
                        </Grid>
                    ))}

                    <Grid item xs="auto">
                        <WeatherForecast zip_code={homedata.zip_code} />
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default HomeDetailPage;