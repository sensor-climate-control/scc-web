import React, { useEffect, useState } from 'react';

import { Button, Grid } from '@mui/material';
import MyCard from "../application/MyCard";
import { useGetUserDetailsQuery, useModifyUserMutation } from '../../reduxApi';
import { useStore } from 'react-redux'
import Header from '../application/Header';
import { useNavigate } from 'react-router-dom';
import ApiKeys from './ApiKeys';
import MyTable from '../application/MyTable';

function UserInfo () {
    const store = useStore()
    const navigate = useNavigate()
    const [ editInfo, setEditInfo ] = useState(false)
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ phoneCarrier, setPhoneCarrier ] = useState("")
    const [ name, setName ] = useState("")


    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    const userid = store.getState().token.userid
    const { data: userdata, error, isError, isLoading } = useGetUserDetailsQuery(userid);
    const [triggerModify, { data: modifyData, error: modifyError, isError: isModifyError, isLoading: isModifyLoading, isSuccess: isModifySuccess, isUninitialized: isModifyUninitialized }] = useModifyUserMutation();
    
    async function handleEditButton(e) {
        e.preventDefault();
        setName(userdata.name)
        setEmail(userdata.email)
        setPhoneNumber(userdata.phone)
        setPhoneCarrier(userdata.phone_carrier)

        setEditInfo(!editInfo)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setEditInfo(!editInfo)

        triggerModify({body: {name, email, password, phone: phoneNumber, phone_carrier: phoneCarrier, homes: userdata.homes, api_keys: userdata.api_keys, admin: userdata.admin}, user_id: userid})
    }

    const userInfo = 
        (isLoading) ? (<p>Loading...</p>) :
        (isError) ? (<p>{JSON.stringify(error)}</p>) :
        (isModifyError) ? (<p>{JSON.stringify(modifyError)}</p>) :
        (editInfo) ? (<form onSubmit={handleSubmit} >
            <p>UserID: {userdata._id}</p>
            <label for="name">Name:</label>
            <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            <label for="email">Email Address:</label>
            <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            <label for="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <label for="phone">Telephone Number:</label>
            <input
                    type="tel"
                    id="phone"
                    placeholder="123-456-7890"
                    pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                />
            <p>Site Admin: {String(userdata.admin)}</p>
            <MyTable headers={["Homes"]} rows={[userdata.homes]} />
            <input type="submit" value="Update Information" />
        </form>) :
        (<div>
            <p>UserID: {userdata._id}</p>
            <p>Name: {userdata.name}</p>
            <p>Email: {userdata.email}</p>
            <p>Phone Number: {userdata.phone}</p>
            <p>Site Admin: {String(userdata.admin)}</p>
            <MyTable headers={["Homes"]} rows={[userdata.homes]} />
            <Button onClick={handleEditButton}>Edit Info</Button>
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
