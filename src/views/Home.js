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
import LayoutSection from "../features/weather/home_layout/LayoutSection";

const HOME_ID = "63ed9cb48af0fbb8f0201c11";

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

    const { data: sensorData } = api.useGetHomeSensorsQuery((userdata) ? userdata.homes[0] : null, {
        pollingInterval: 300000,
        skip: !skip
    });

    // fake data while loading
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

    let orientations = ["north", "south", "east", "west"]

    let n_orientations = ["north", "north", "north", "north"]
    let s_orientations = ["south", "south", "south", "south"]
    let e_orientations = ["east", "east", "east", "east"]
    let w_orientations = ["west", "west", "west", "west"]

    let map_window_data = window_data.map((window) => {
        return {
            window_orientation: s_orientations.pop(),
            data: window,
        }
    })

    return (
        <div className="outer-home-sections-wrapper">
            <div className="top-section-wrapper">
                <WindowOverview windows={window_data} />
                <GraphSection windows={window_data}/>
            </div>

            <div className="bottom-section-wrapper">
                <LayoutSection data={map_window_data} />
            </div>
        </div>
    );
}