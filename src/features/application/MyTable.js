import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// import MyCard from "../application/MyCard";

const MyTable = props => {
    // const styling = (props.style) ? props.style : { width: '18rem', backgroundColor: '#646c7a' }
    return (
        <TableContainer component={Paper}>
            <Table sx={props.sx} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow
                        key={props.headers[0]}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {props.headers.map((cell) => (
                                <TableCell>{cell}</TableCell>
                            ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <TableRow
                        key={row[0]}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {row.map((cell) => (
                                <TableCell style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MyTable