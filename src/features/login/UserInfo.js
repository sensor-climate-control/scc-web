import React, { useEffect } from 'react';

import { Grid } from '@mui/material';
import MyCard from "../application/MyCard";
import { useGetUserDetailsQuery } from '../../reduxApi';
import { useStore } from 'react-redux'
import Header from '../application/Header';
import { useNavigate } from 'react-router-dom';
import ApiKeys from './ApiKeys';

function UserInfo () {
    const store = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    const userid = store.getState().token.userid
    const { data: userdata, error, isError, isLoading } = useGetUserDetailsQuery(userid);

    const userInfo = 
        (isLoading) ? (<p>Loading...</p>) :
        (isError) ? (<p>{JSON.stringify(error)}</p>) : 
        (<div>
            <p>UserID: {userdata._id}</p>
            <p>Name: {userdata.name}</p>
            <p>Email: {userdata.email}</p>
            <p>Phone Number: {userdata.phone}</p>
            <p>Phone Carrier: {userdata.phone_carrier}</p>
            <p>Site Admin: {String(userdata.admin)}</p>
            <p>Homes: {JSON.stringify(userdata.homes)}</p>
        </div>)

    return (
        <>
            <Header page_name='User Information' user_first_name={(userdata) ? userdata.name : ''}/>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <MyCard title="User Info">
                        {userInfo}
                    </MyCard>
                </Grid>
                <Grid item xs={8}>
                    <ApiKeys api_keys={userdata.api_keys} />
                </Grid>
            </Grid>
        </>
    )
}

export default UserInfo;
