import React, { useState } from 'react';
import { useTable } from 'react-table';
import { useAddWindowMutation, useDeleteWindowMutation } from '../../reduxApi';
import './WindowTable.css';

export default function WindowTable({ homeDetails = {}, sensorDetails = [] }) {
    const [newWindow, setNewWindow] = useState({ name: "", direction: "", sensorid: "" });

    const [addWindow, { isLoading: isAdding }] = useAddWindowMutation();
    const [deleteWindow, { isLoading: isDeleting }] = useDeleteWindowMutation();

    const handleAddWindow = async () => {
        if (homeDetails._id && newWindow) {
            await addWindow({ body: newWindow, home_id: homeDetails._id });
            setNewWindow({ name: "", direction: "", sensorid: "" });
        }
    };

    const handleDeleteWindow = async (window) => {
        console.log("Deleting...")
        if (homeDetails._id && window) {
            await deleteWindow({ body: window, home_id: homeDetails._id });
        }
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Name', accessor: 'name' },
            { Header: 'Direction', accessor: 'direction' },
            { Header: 'Sensor ID', accessor: 'sensorid' },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button onClick={() => handleDeleteWindow(row.original)}>Delete</button>
                )
            }
        ],
        []
    );

    const data = homeDetails.windows || [];
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    const directions = ['North', 'South', 'East', 'West'];

    return (
        homeDetails && sensorDetails ? (
            <div className='outer-graph-section-wrapper'>
                <div className='inner-graph-section-wrapper'>
                    <h1 className='graph-overview-header-text'>Windows</h1>
                    <hr className="window-overview-header-line" />
                    <div className='sensor-table-wrapper'>
                        <table {...getTableProps()}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            })}
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td><input value={newWindow.name} onChange={e => setNewWindow({ ...newWindow, name: e.target.value })} placeholder="Name" /></td>
                                    <td>
                                        <select value={newWindow.direction} onChange={e => setNewWindow({ ...newWindow, direction: e.target.value })}>
                                            <option value="">Select direction</option>
                                            {directions.map(dir => (
                                                <option key={dir} value={dir}>{dir}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select value={newWindow.sensorid} onChange={e => setNewWindow({ ...newWindow, sensorid: e.target.value })}>
                                            <option value="">Select sensor</option>
                                            {homeDetails.sensors ? homeDetails.sensors.map(sensorId => {
                                                const sensorDetail = sensorDetails.find(detail => detail._id === sensorId);
                                                return (
                                                    <option key={sensorId} value={sensorId}>{sensorDetail ? sensorDetail.name : sensorId}</option>
                                                )
                                            }) : null}
                                        </select>
                                    </td>
                                    <td><button onClick={handleAddWindow} disabled={isAdding}>Add</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) : null
    );
}
