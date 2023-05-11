import React, { useState } from 'react';

import { Button, CircularProgress, Switch } from '@mui/material';
import MyCard from "../application/MyCard";
import { useModifyUserMutation } from '../../reduxApi';
import MyTable from '../application/MyTable';

function UserInfo (props) {
    const [ editInfo, setEditInfo ] = useState(false)
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ phoneCarrier, setPhoneCarrier ] = useState("")
    const [ name, setName ] = useState("")
    const [ phoneNotifications, setPhoneNotifications ] = useState("")
    const [ emailNotifications, setEmailNotifications ] = useState("")

    const [triggerModify, { isLoading: isModifyLoading, error: modifyError, isError: isModifyError}] = useModifyUserMutation();
    const userdata = props.userdata

    async function handleEditButton(e) {
        e.preventDefault();
        setName(userdata.name)
        setEmail(userdata.email)
        setPhoneNumber(userdata.phone)
        setPhoneCarrier(userdata.phone_carrier)
        setPhoneNotifications((userdata.preferences && userdata.preferences.notifications && userdata.preferences.notifications.phone) ? userdata.preferences.notifications.phone : false)
        setEmailNotifications((userdata.preferences && userdata.preferences.notifications && userdata.preferences.notifications.email) ? userdata.preferences.notifications.email : false)

        setEditInfo(!editInfo)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setEditInfo(!editInfo)

        triggerModify({body: {name, email, password, phone: phoneNumber, phone_carrier: phoneCarrier, homes: userdata.homes, api_keys: userdata.api_keys, admin: userdata.admin, preferences: {notifications: {phone: phoneNotifications, email: emailNotifications}}}, user_id: userdata._id})
    }

    const userInfo = 
        (isModifyLoading) ? <CircularProgress /> :
        (isModifyError) ? (<p>{JSON.stringify(modifyError)}</p>) :
        (editInfo) ? (<form onSubmit={handleSubmit} >
            <p>UserID: {userdata._id}</p>
            <label for="name">Name:</label>
            <input
                    type="text"
                    id="name"
                    value={name}
                    required={true}
                    onChange={e => setName(e.target.value)}
                />
            <label for="email">Email Address:</label>
            <input
                    type="email"
                    value={email}
                    required={true}
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
            <h4>Preferences</h4>
            <label for="emailNotif">Email Notifications:</label>
            <Switch id="emailNotif" checked={emailNotifications} onChange={() => {setEmailNotifications(!emailNotifications)}} />
            <label for="phoneNotif">Phone Notifications</label>
            <Switch id="phoneNotif" checked={phoneNotifications} onChange={() => {setPhoneNotifications(!phoneNotifications)}} />
            <MyTable headers={["Homes"]} rows={[userdata.homes]} />
            <br />
            <Button variant="contained" type="submit">Update Info</Button>
            <br />
            <Button variant="contained" onClick={() => {setEditInfo(false)}} >Cancel</Button>
        </form>) :
        (<div>
            <p>UserID: {userdata._id}</p>
            <p>Name: {userdata.name}</p>
            <p>Email: {userdata.email}</p>
            <p>Phone Number: {userdata.phone}</p>
            <p>Site Admin: {String(userdata.admin)}</p>
            <h4>Preferences</h4>
            <p>Email Notifications: {(userdata.preferences && userdata.preferences.notifications && userdata.preferences.notifications.email) ? "On" : "Off"}</p>
            <p>Phone Notifications: {(userdata.preferences && userdata.preferences.notifications && userdata.preferences.notifications.phone) ? "On" : "Off"}</p>
            <MyTable headers={["Homes"]} rows={[userdata.homes]} />
            <br />
            <Button variant="contained" onClick={handleEditButton}>Edit Info</Button>
        </div>)

    return (
        <MyCard title="User Info">
            {userInfo}
        </MyCard>
    )
}

export default UserInfo;
