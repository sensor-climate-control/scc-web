import React, {useEffect, useState} from 'react';

import MyCard from "../application/MyCard";
// import Header from '../application/Header';
import { Button, Switch, CircularProgress } from '@mui/material';
import { useCreateAccountMutation } from '../../reduxApi';
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function CreateAccount () {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ name, setName ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ phoneNotifications, setPhoneNotifications ] = useState(false)
    const [ emailNotifications, setEmailNotifications ] = useState(false)

    const [triggerCreateAccount, { error, isLoading, isError, isUninitialized }] = useCreateAccountMutation()

    const store = useStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (store.getState().token.token) {
            return navigate("/");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    async function handleCreateAccount(e) {
        e.preventDefault();

        triggerCreateAccount({name, email, password})

        setPassword("")
    }

    const createAccountForm = (
        <form onSubmit={handleCreateAccount}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Jane Doe"
                    required={true}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="email@example.com"
                    required={true}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Create a Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    required={true}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phone">Telephone Number:</label>
                <input
                    type="tel"
                    id="phone"
                    placeholder="123-456-7890"
                    pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                    required={false}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>
            <br />
            <label htmlFor="emailNotif">Email Notifications:</label>
            <Switch id="emailNotif" checked={emailNotifications} onChange={() => {setEmailNotifications(!emailNotifications)}} />
            <label htmlFor="phoneNotif">Phone Notifications</label>
            <Switch id="phoneNotif" checked={phoneNotifications} onChange={() => {setPhoneNotifications(!phoneNotifications)}} />
            <br />
            <br />
            <Button variant="contained" type="submit">Create Account</Button>
        </form>
    )

    return (
        <MyCard title="Create Account">
            {(isUninitialized) ? createAccountForm :
                (isLoading) ? <CircularProgress /> :
                (isError) ? (<>
                    {createAccountForm}
                    <p>Error: {JSON.stringify(error)} - Please try again</p>
                </>) : (<p>Success! Please log in with your email and password</p>)
            }
        </MyCard>
    )
}

export default CreateAccount;
