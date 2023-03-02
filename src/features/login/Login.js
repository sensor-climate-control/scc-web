import React, {useState} from 'react';

import MyCard from "../application/MyCard";
// import { useGetWeatherQuery } from '../../reduxApi';
import Header from '../application/Header';
import { useLoginMutation } from '../../reduxApi';
// import CurrentWeather from '../weather/CurrentWeather';
import { useStore } from 'react-redux'
import {
  useNavigate
} from 'react-router-dom';

function Login () {
    // const { data, error, isLoading } = useGetWeatherQuery();
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const [triggerLogin, { data, error, isLoading, isSuccess, isUninitialized }] = useLoginMutation()

    const store = useStore()
    const navigate = useNavigate()

    if (store.getState().token.token) {
        return navigate("/");
    }
    console.log("==== state: ", store.getState().token.token)

    async function handleLogin(e) {
        e.preventDefault();
        // console.log("== Logging in with these credentials:", email, password);

        triggerLogin({email, password})
    }

    const loginForm = (
        <form onSubmit={handleLogin}>
            <div>
                <input
                    type="text"
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
        <>
            <Header page_name='View Your Home' user_first_name='Daniel'/>
            <MyCard title="Login">
                {/* {(isLoading || error) ? (<p>Loading...</p>) : (
                    <div className="weather-stats-wrapper">
                        <p>Temperature: {data.main.temp}°F</p>
                        <p>Feels Like: {data.main.feels_like}°F</p>
                        <p>Humidity: {data.main.humidity}%</p>
                    </div>
                )} */}
                {(isUninitialized) ? loginForm :
                 (isLoading) ? (<p>Loading...</p>) :
                 (isSuccess) ? (<p>{JSON.stringify(data)}</p>) :
                 (<p>{JSON.stringify(error)}</p>)}
                
                
            </MyCard>
        </>
    )
}

export default Login;
