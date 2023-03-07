import React, {useEffect, useState} from 'react';

import MyCard from "../application/MyCard";
import { useCreateHomeMutation, useAddHomeToUserMutation } from '../../reduxApi';

function CreateHome ({ userdata }) {
    const [ name, setName ] = useState("")
    const [ zipcode, setZipcode ] = useState("")
    const [ temperature, setTemperature ] = useState(65)

    const [triggerCreateHome, { data, error, isLoading, isSuccess, isUninitialized }] = useCreateHomeMutation()
    const [triggerAddHomeToUser] = useAddHomeToUserMutation()

    async function handleCreateHome(e) {
        e.preventDefault();

        const response = await triggerCreateHome({
            name,
            zip_code: zipcode,
            preferences: {
                temperature
            },
            users: [
                userdata._id
            ],
            home_admins: [
                userdata._id
            ]
        })

        triggerAddHomeToUser({body: {homeid: response.data.id}, user_id: userdata._id})
    }

    const createHomeForm = (
        <form onSubmit={handleCreateHome}>
            <div>
                <label for="name">Home Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="My Home"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label for="zipcode">Zip Code:</label>
                <input
                    type="text"
                    id="zipcode"
                    placeholder="97330"
                    value={zipcode}
                    onChange={e => setZipcode(e.target.value)}
                />
            </div>
            <div>
                <label for="temperature">Select your desired temperature:</label>
                <input
                    type="range"
                    id="temperature"
                    placeholder="65"
                    value={temperature}
                    min="0"
                    max="100"
                    onChange={e => setTemperature(e.target.value)}
                />
                <p>{temperature}</p>
            </div>
            <br />
            <div>
                <input type="submit" value="Create Home" />
            </div>
        </form>
    )

    return (
        <MyCard title="Create Home">
            <p>Your account does not currently have an associated home. Please create a home to continue</p>
            {(isUninitialized) ? createHomeForm :
                (isLoading) ? (<p>Loading...</p>) :
                (isSuccess) ? (<p>{JSON.stringify(data)}</p>) :
                (<p>{JSON.stringify(error)}</p>)}

        </MyCard>
    )
}

export default CreateHome;
