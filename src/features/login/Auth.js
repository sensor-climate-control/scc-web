import React from 'react';
import Header from '../application/Header';
import Login from './Login';
import CreateAccount from './CreateAccount';
import { Grid } from '@mui/material';

function Auth () {
    return (
        <>
            <Header page_name='Login or Create Account' user_first_name=''/>
            <Grid container spacing={1}>
                <Grid container item />
                <Grid item />
                <Grid item xs="auto">
                    <CreateAccount />
                </Grid>
                <Grid item xs="auto">
                    <Login />
                </Grid>
            </Grid>
        </>
    )
}

export default Auth;
