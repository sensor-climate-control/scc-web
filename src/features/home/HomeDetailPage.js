import React, { useEffect } from 'react';
import HomeInfo from './HomeInfo';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'react-redux'
import { useGetUserDetailsQuery } from '../../reduxApi';
import { Grid, CircularProgress } from '@mui/material';
import Header from '../application/Header';

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
    const { data: userdata } = useGetUserDetailsQuery(userid);

    return (
        <>
            <Header page_name='User Information' user_first_name={(userdata) ? userdata.name : ''} />
            {(!userdata) ? <CircularProgress /> : (
                <Grid container spacing={1} >
                    {userdata.homes.map((home, index) => (
                        <Grid key={index} item xs={3}>
                            <HomeInfo homeid={home} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    )
}

export default HomeDetailPage;