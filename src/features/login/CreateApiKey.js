import React, {useState} from 'react';
import MyCard from "../application/MyCard";
import { Button } from '@mui/material';
import { useAddApiKeyMutation } from '../../reduxApi';

function CreateApiKey (props) {
    const [ duration, setDuration ] = useState(60)
    const [ name, setName ] = useState("")

    const [triggerCreateApiKey] = useAddApiKeyMutation()

    async function handleCreateApiKey(e) {
        e.preventDefault();

        triggerCreateApiKey({body: {duration: `${duration}d`, name: name}, user_id: props.userid})
        setDuration(60)
        setName("")
    }

    const createApiKeyForm = (
        <form onSubmit={handleCreateApiKey}>
            <label htmlFor="duration">Duration (days):</label>
            <input
                type="range"
                placeholder="60"
                min="1"
                max="1000"
                value={duration}
                onChange={e => setDuration(e.target.value)}
            />
            <p>{duration}</p>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                placeholder="Kitchen"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <br />
            <br />
            <Button variant="contained" type="submit">Create Api Key</Button>
        </form>
    )

    return (
        <MyCard title="Create API Key">
            {createApiKeyForm}
        </MyCard>
    )
}

export default CreateApiKey;