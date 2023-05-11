import React, { useState } from 'react';
import { useGetHomeDetailsQuery, useModifyHomeMutation } from '../../reduxApi';
import { CircularProgress } from '@mui/material';
import MyCard from '../application/MyCard';
import MyTable from '../application/MyTable';
import { Button } from '@mui/material';
import HorizontalDiv from '../application/HorizontalDiv';

function HomeInfo (props) {
    const homeid = props.homeid

    const [ editInfo, setEditInfo ] = useState(false)
    const [ name, setName ] = useState("")
    const [ zipCode, setZipCode ] = useState("")
    const [ temperature, setTemperature ] = useState("")

    const { data: homeData, isLoading, isError, error } = useGetHomeDetailsQuery(homeid)
    const [triggerModify, { isLoading: modifyLoading, error: modifyError, isError: isModifyError }] = useModifyHomeMutation();

    async function handleEditButton(e) {
        e.preventDefault();
        setName(homeData.name)
        setZipCode(homeData.zip_code)
        setTemperature(homeData.preferences.temperature)

        setEditInfo(!editInfo)
    }

    async function handleSubmit(e) {
        e.preventDefault();

        triggerModify({body: {name: name, zip_code: zipCode, users: homeData.users, home_admins: homeData.home_admins, sensors: homeData.sensors, preferences: {temperature: temperature}, windows: homeData.windows, recommendations: homeData.recommendations}, home_id: homeid})

        setEditInfo(!editInfo)
    }

    const sensorRows = (homeData) ? (
        homeData.sensors.map(sensor => {
            return [sensor]
        })
    ) : null

    const userRows = (homeData) ? (
        homeData.users.map(user => {
            return [user]
        })
    ) : null

    const homeInfo =
        (isLoading || modifyLoading ) ? <CircularProgress /> : 
        (isError) ? <p>{JSON.stringify(error)}</p> :
        (isModifyError) ? (<p>{JSON.stringify(modifyError)}</p>) :
        (editInfo) ? (<form onSubmit={handleSubmit}>
            <p>HomeID: {homeData._id}</p>
            <label htmlFor="name">Name: </label>
            <input
                type="text"
                id="name"
                value={name}
                required={true}
                onChange={e => setName(e.target.value)}
            />
            <br />
            <br />
            <label htmlFor="zipCode">Zip Code: </label>
            <input
                type="text"
                id="zipCode"
                value={zipCode}
                required={true}
                onChange={e => setZipCode(e.target.value)}
            />
            <br />
            <br />
            <label htmlFor="temperature">Desired temperature:</label>
            <input
                type="range"
                id="temperature"
                placeholder={temperature}
                value={temperature}
                min="0"
                max="100"
                onChange={e => setTemperature(e.target.value)}
            />
            <p>{temperature}</p>
            <HorizontalDiv>
                <Button variant="contained" onClick={() => {setEditInfo(false)}} >Cancel</Button>
                <Button variant="contained" type="submit">Update Info</Button>
            </HorizontalDiv>
        </form>) :
        (<div>
            <p>HomeID: {homeData._id}</p>
            <p>Name: {homeData.name}</p>
            <p>Zip Code: {homeData.zip_code}</p>
            <p>Desired Temperature: {homeData.preferences.temperature}</p>
            {(homeData.users) ? (<MyTable headers={["Users"]} rows={userRows} />) : null }
            <br />
            {(homeData.sensors) ? (<MyTable headers={["Sensors"]} rows={sensorRows} />) : null }
            <br />
            <Button variant="contained" onClick={handleEditButton}>Edit Info</Button>
        </div>)

    return (
        <MyCard title="Home Info" style={{ width: '25rem', backgroundColor: '#646c7a' }}>
            {homeInfo}
        </MyCard>
    )
}

export default HomeInfo;