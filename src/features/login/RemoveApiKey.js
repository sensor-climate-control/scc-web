import React from 'react';
import MyCard from "../application/MyCard";
import { Button } from '@mui/material';
import { useRemoveApiKeyMutation } from '../../reduxApi';

function RemoveApiKey (props) {

    const [triggerRemoveApiKey] = useRemoveApiKeyMutation()

    async function handleRemoveApiKey(e) {
        e.preventDefault();

        const form = e.target
        const formData = new FormData(form)
        console.log("==== form: ", form)
        console.log("==== formData: ", formData)
        const formJson = Object.fromEntries(formData.entries())
        console.log("==== formJson: ", formJson)
        console.log([...formData.entries()]);
        triggerRemoveApiKey({body: props.api_keys[formJson.selectedKey], user_id: props.userid})
    }

    const removeApiKeyForm = (props.api_keys) ? (
        <form onSubmit={handleRemoveApiKey}>
            <label htmlFor="keys">Select an API Key: </label>
            <select
                id="keys"
                name="selectedKey"
                defaultValue={0}
            >
                {props.api_keys.map((key, index) => (
                    <option value={index} key={index}>{key.name}</option>
                ))}
            </select>
            <br />
            <br />
            <Button variant="contained" type="submit">Remove Api Key</Button>
        </form>
    ) : (<p>No API Keys</p>)

    return (
        <MyCard title="Remove API Key">
            {removeApiKeyForm}
        </MyCard>
    )
}

export default RemoveApiKey;