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

const HOME_ID = "63ed9cb48af0fbb8f0201c11";

export default function Home() {
    // useeffect
    const { data } = api.useGetHomeSensorsQuery(HOME_ID, {
        pollingInterval: 300000,
    });

    const store = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.getState().token.token) {
            return navigate("/login");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    const userid = store.getState().token.userid
    const { data: userdata } = useGetUserDetailsQuery(userid);

    // const { home_data, home_error, home_isLoading } = api.useGetWeatherQuery(HOME_ID);

    // console.log(home_data, home_error, home_isLoading)

    // let sensor_details = [];
    // if (home_data) {
    //     console.log("Home data: " + home_data)
    //     for (let i = 0; i < home_data.sensors.length; i++) {
    //         console.log("Querying sensor " + home_data.sensors[i] + "...")
    //         sensor_details.push(api.useGetSensorDetailsQuery(HOME_ID, home_data.sensors[i]));
    //     }
    //     // get details of each sensor
    // }

    // console.log(sensor_details)


    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>Error: {error.message}</div>

    // fake data while loading
    let window_data = []

    // if (!data) {
    //     window_data = [
    //         {
    //             name: "Bedroom Window",
    //             status: "open",
    //             temp: 72,
    //             humidity: 50,
    //         },
    //         {
    //             name: "Living Room Window",
    //             status: "open",
    //             temp: 72,
    //             humidity: 50,
    //         },
    //         {
    //             name: "Kitchen Window",
    //             status: "close_soon",
    //             temp: 72,
    //             humidity: 50,
    //         },
    //         {
    //             name: "Guest Bedroom Window",
    //             status: "closed",
    //             temp: 72,
    //             humidity: 50,
    //         }
    //     ]

    //     faker.seed(123);

    //     points = [];
    //     for (let i = 0; i < 100; i++) {
    //         points.push({
    //             x: i,
    //             y: faker.datatype.number({min: 62, max: 74})
    //         });
    //     }
    // switch to real data
    if (data) {
        window_data = []
        let window = {}
        for (let i = 0; i < data.length; i++) {
            if (data[i].readings.length === 0) {
                window = {
                    name: data[i].name,
                    status: "closed",
                    temp: 0,
                    humidity: 0,
                    lastReadings: [],
                }
            } else {
                window = {
                    name: data[i].name,
                    status: "closed",
                    temp: data[i].readings[data[i].readings.length - 1].temp_f,
                    humidity: data[i].readings[data[i].readings.length - 1].humidity,
                    lastReadings: data[i].readings.slice(Math.max(data[i].readings.length - 100, 0))
                }
            }

            window_data.push(window)
        }

        // use last 100 readings
        // points = [];
        // for (let i = data[0].readings.length - 100; i < data[0].readings.length; i++) {
        //     points.push(data[0].readings[i].temp_f)
        // }
    }

    const homeToDisplay = (
            !userdata || 
            !userdata.homes || 
            userdata.homes.length === 0
        ) ? <CreateHome userdata={userdata} /> : (
            <>
                <div className="outer-home-sections-wrapper">
                    <WindowOverview windows={window_data} />
                    <GraphSection windows={window_data}/>
                </div>
                <CurrentWeather />
            </>
        )

    return (
        <>
            <Header page_name='View Your Home' user_first_name={(userdata) ? userdata.name : ''}/>
            {homeToDisplay}
            {/* <UserInfo userdata={userdata}/> */}
        </>
    );
}