import React, { useEffect } from 'react';
import UserInfo from './UserInfo';
import { useNavigate } from 'react-router-dom';
import ApiKeys from './ApiKeys';
import { useStore } from 'react-redux'
import { useGetUserDetailsQuery } from '../../reduxApi';
import { Grid, CircularProgress } from '@mui/material';
import Header from '../application/Header';
import CreateApiKey from './CreateApiKey';
import RemoveApiKey from './RemoveApiKey';

function UserPage () {
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
            <Header page_name='Account Information' user_first_name={(userdata) ? userdata.name : ''} />
            {(!userdata) ? <CircularProgress /> : (
                <Grid container spacing={1} >
                    <Grid item />
                    <Grid container item justifyContent="flex-start" direction="row" alignItems="flex-start" spacing={1}>
                        <Grid item xs="auto">
                            <UserInfo userdata={userdata} />
                        </Grid>
                        <Grid item xs="auto">
                            <ApiKeys api_keys={userdata.api_keys} />
                        </Grid>
                        <Grid item xs="auto">
                            <CreateApiKey userid={userid} />
                        </Grid>
                        <Grid item xs="auto">
                            <RemoveApiKey api_keys={userdata.api_keys} userid={userid} />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

export default UserPage;
