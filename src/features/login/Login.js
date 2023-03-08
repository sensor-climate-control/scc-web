import React, {useEffect, useState} from 'react';

import MyCard from "../application/MyCard";
import { useLoginMutation } from '../../reduxApi';
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function Login () {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const [triggerLogin, { data, error, isLoading, isSuccess, isUninitialized }] = useLoginMutation()

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
            <div>
                <input type="submit" value="Login" />
            </div>
        </form>
    )

    return (
        <MyCard title="Login">

            {(isUninitialized) ? loginForm :
                (isLoading) ? (<p>Loading...</p>) :
                (isSuccess) ? (<p>{JSON.stringify(data)}</p>) :
                (<p>{JSON.stringify(error)}</p>)}
            
        </MyCard>
    )
}

export default Login;
