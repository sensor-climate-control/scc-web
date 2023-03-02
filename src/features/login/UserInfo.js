import React from 'react';

import MyCard from "../application/MyCard";
import { useGetUserDetailsQuery } from '../../reduxApi';
import { useStore } from 'react-redux'

function UserInfo () {
    const store = useStore()
    const userid = store.getState().token.userid
    console.log("==== userid: ", userid)

    const { data, error, isSuccess, isLoading } = useGetUserDetailsQuery(userid);

    const userInfo = (
        <div>
            <p>UserID: {data._id}</p>
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
            <p>Phone Number: {data.phone}</p>
            <p>Phone Carrier: {data.phone_carrier}</p>
            <p>Site Admin: {String(data.admin)}</p>
        </div>
    )

    return (
        <MyCard title="User Info">
            {(isLoading) ? (<p>Loading...</p>) :
             (isSuccess) ? (userInfo) :
             (<p>{JSON.stringify(error)}</p>)}
            
        </MyCard>
    )
}

export default UserInfo;
