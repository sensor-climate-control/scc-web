import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import MyCard from "../application/MyCard";
// import { useGetApiKeysQuery } from '../../reduxApi';
// import { useStore } from 'react-redux'
// import Header from '../application/Header';
// import { useNavigate } from 'react-router-dom';

function ApiKeys (props) {
    console.log("==== props: ", props)

    const rows = []
    for (let i = 0; i < props.api_keys.length; i++) {
        rows.push({name: props.api_keys[i].name, token: props.api_keys[i].token, created: props.api_keys[i].created, expires: props.api_keys[i].expires})
    }

    return (
        <MyCard title="API Keys" style={{ width: '50rem', backgroundColor: '#646c7a' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Token</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Expires</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{row.token}</TableCell>
                        <TableCell>{row.created}</TableCell>
                        <TableCell>{row.expires}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MyCard>
    )
}

export default ApiKeys;
