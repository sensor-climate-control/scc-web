import React from 'react';
import TimestampToDateTime from '../application/TimestampToDateTime';
import MyCard from "../application/MyCard";
import MyTable from '../application/MyTable';

function ApiKeys (props) {
    console.log("==== props: ", props)

    const rows = []
    for (let i = 0; i < props.api_keys.length; i++) {
        rows.push([props.api_keys[i].name, props.api_keys[i].token, TimestampToDateTime(props.api_keys[i].created), TimestampToDateTime(props.api_keys[i].expires)])
    }

    return (
        <MyCard title="API Keys" style={{ width: '50rem', backgroundColor: '#646c7a' }}>
            <MyTable headers={['Name', 'Token', 'Created', 'Expires']} rows={rows} sx={{ minWidth: 700 }}/>
        </MyCard>
    )
}

export default ApiKeys;
