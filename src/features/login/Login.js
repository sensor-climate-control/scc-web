import React, {useEffect, useState} from 'react';

import MyCard from "../application/MyCard";
import { Button, CircularProgress } from '@mui/material';
import { useLoginMutation } from '../../reduxApi';
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function Login () {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const [triggerLogin, { data, error, isError, isLoading, isUninitialized }] = useLoginMutation()

    const store = useStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (store.getState().token.token) {
            return navigate("/");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    async function handleLogin(e) {
        e.preventDefault();

        triggerLogin({email, password})
        setEmail("")
        setPassword("")
    }

    const loginForm = (
        <form onSubmit={handleLogin}>
            <div>
                <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <br />
            <Button variant="contained" type="submit">Login</Button>
        </form>
    )

    return (
        <MyCard title="Login">

            {
                (isUninitialized) ? loginForm :
                (isError) ?
                (<>
                    {loginForm}
                    <p>{error.data.error} - Please try logging in again</p>
                </>) :
                (isLoading) ? <CircularProgress /> :
                (<p>{JSON.stringify(data)}</p>)
            }
            
        </MyCard>
    )
}

export default Login;
