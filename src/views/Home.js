import WindowOverview from "../features/weather/WindowOverview";
import GraphSection from "../features/weather/graph/GraphSection";
import './Home.css'
import { api } from '../reduxApi';
import { useStore } from 'react-redux'
import Header from '../features/application/Header';
import { useNavigate } from 'react-router-dom';
import CurrentWeather from '../features/weather/CurrentWeather';
import React, { useEffect } from 'react';
import { useGetUserDetailsQuery } from '../reduxApi';
import CreateHome from "../features/home/CreateHome";

export default function Home() {
    // useeffect

    const store = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    const userid = store.getState().token.userid
    const { data: userdata, isSuccess: skip } = useGetUserDetailsQuery(userid);

    let selectedHome = null;
    if (userdata) {
        // Make sure there is a home field
        if (userdata.homes) {
            if (userdata.homes.length > 0) {
                // We should only have one home for now
                selectedHome = userdata.homes[0];
            }
        }
    }

    const { data: sensorData } = api.useGetHomeSensorsQuery(selectedHome, {
        pollingInterval: 300000,
        skip: !skip
    });

    const { data } = api.useGetHomeDetailsQuery(selectedHome, {
        skip: !skip
    })

    let window_data = []

    // switch to real data
    if (sensorData) {
        console.log("==== sensorData: ", sensorData)
        window_data = []
        let window = {}
        for (let i = 0; i < sensorData.length; i++) {
            if (sensorData[i].readings.length === 0) {
                window = {
                    name: sensorData[i].name,
                    status: "closed",
                    temp: 0,
                    humidity: 0,
                    lastReadings: [],
                }
            } else {
                window = {
                    name: sensorData[i].name,
                    status: "closed",
                    temp: sensorData[i].readings[sensorData[i].readings.length - 1].temp_f,
                    humidity: sensorData[i].readings[sensorData[i].readings.length - 1].humidity,
                    lastReadings: sensorData[i].readings.slice(Math.max(sensorData[i].readings.length - 100, 0))
                }
            }

            window_data.push(window)
        }
    }

    const homeDetails = (
            !userdata || 
            !userdata.homes || 
            userdata.homes.length === 0
        ) ? <CreateHome userdata={userdata} /> : (
            <>
                <div className="outer-home-sections-wrapper">
                    <WindowOverview windows={window_data} />
                    <GraphSection windows={window_data}/>
                </div>
                <CurrentWeather zip_code={(data) ? data.zip_code : null} />
            </>
        )

    return (
        <>
            <Header page_name='View Your Home' user_first_name={(userdata) ? userdata.name : ''}/>

            {homeDetails}
        </>
    );
}