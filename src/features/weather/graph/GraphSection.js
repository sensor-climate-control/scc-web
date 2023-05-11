import { Line } from 'react-chartjs-2';
import React, { useState } from 'react';
import { useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './GraphSection.css'
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const zoomOptions = {
    pan: {
        enabled: true,
        modifierKey: 'shift',
    },
    zoom: {
        drag: {
            enabled: true
        },
        mode: 'xy',
    },
};
export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: '',
        },
        zoom: zoomOptions,
    },
    scales: {
        x: {
            title: {
                display: false,
                text: 'Time',
            }
        },
        y: {
            title: {
                display: true,
                text: 'Temperature (F°)',
            }
        }
    }
};

// labels should be times for the last 24 hours
// i.e. 4:15am, 4:30am, 4:45am
// should be programmatically generated

const colors = [{
    borderColor: 'red',
    backgroundColor: 'red',
},
{
    borderColor: 'blue',
    backgroundColor: 'blue',
},
{
    borderColor: 'green',
    backgroundColor: 'green',
},
{
    borderColor: 'yellow',
    backgroundColor: 'yellow',
},
{
    borderColor: 'purple',
    backgroundColor: 'purple',
}]

function epochToDateString(epochSeconds) {
    // Convert seconds to milliseconds
    const epochMilliseconds = epochSeconds * 1000;

    // Create a new Date object from milliseconds
    const date = new Date(epochMilliseconds);

    // Define an array with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get the required date values
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the hours and minutes
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const amOrPm = hours >= 12 ? 'pm' : 'am';

    // Create the final date string
    const dateString = `${month} ${day} - ${formattedHours}:${formattedMinutes}${amOrPm}`;

    return dateString;
}

function generate_labels(datasets) {
    const labels = [];

    if (datasets.length === 0) {
        return labels;
    }

    // get longest dataset
    let longest = 0;
    let longest_ind = 0;
    for (let i = 0; i < datasets.length; i++) {
        if (datasets[i].data.length > longest) {
            longest = datasets[i].data.length;
            longest_ind = i;
        }
    }


    for (let i = 0; i < datasets[longest_ind].data.length; i++) {
        let label_str = epochToDateString(datasets[longest_ind].epochs[i]);
        labels.push(label_str);
    }

    return labels;
}

function getDataByDate(windows, timeScale, windowState) {
    const datasets = [];
    // get curr epoch time

    if (windowState.length === windows.length) {
        let cuttoffTime = Date.now() / 1000;

        if (timeScale === 'hour') {
            cuttoffTime -= 3600;
        } else if (timeScale === 'day') {
            cuttoffTime -= 86400;
        } else if (timeScale === 'week') {
            cuttoffTime -= 604800;
        } else if (timeScale === 'month') {
            cuttoffTime -= 2592000;
        }

        console.log(timeScale, cuttoffTime);

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].lastReadings === [] || !windowState[i]) {
                continue;
            }

            datasets.push({
                label: windows[i].name,
                data: windows[i].lastReadings ? windows[i].lastReadings.filter(reading => reading.date_time > cuttoffTime).map((reading) => reading.temp_f) : [],
                epochs: windows[i].lastReadings ? windows[i].lastReadings.filter(reading => reading.date_time > cuttoffTime).map((reading) => reading.date_time) : [], 
                borderColor: colors[i].borderColor,
                backgroundColor: colors[i].backgroundColor,
            })
        }

        // console.log("Narrowed to " + datasets[0].data.length + " datapoints");
    }

    const labels = generate_labels(datasets);

    const data = {
        labels,
        datasets: datasets,
        xAxes: [
            {
                type: 'time',
                time: {
                    unit: 'hour',
                },
            },
        ],
        yAxes: [
            {
                type: 'linear',
            },
        ],
    };

    return data;
}


export default function GraphSection(props) {
    const chartRef = useRef(null);
    const [timeScale, setTimeScale] = useState('day');
    const [windowState, setWindowState] = useState([]);

    const data = getDataByDate(props.windows, timeScale, windowState);

    if (windowState.length !== props.windows.length) {
        let newState = []
        for (let _ of props.windows) {
            newState.push(true);
        }
        setWindowState(newState);
    }

    // In the future, we will want a useEffect to update the data
    // This can pull from RTK query to get the latest data every
    // fifteen minutes or so

    // We won't need to propgate the data down from the parent
    // because the parent doesn't need to know about the data

    if (props.windows === []) {
        return (
            <div className='outer-graph-section-wrapper'>
                <div className='inner-graph-section-wrapper'>
                    <h1 className='graph-overview-header-text'>Datapoints</h1>
                    <hr className="window-overview-header-line" />
                    <div className='graph-section-wrapper-div'>
                        <Line options={{}} data={{}} />
                    </div> </div>
            </div>
        );
    }


    return (
        <div className='outer-graph-section-wrapper'>
            <div className='inner-graph-section-wrapper'>
                <h1 className='graph-overview-header-text'>Datapoints</h1>
                <hr className="window-overview-header-line" />

                <div className='graph-options-div'>
                    <div className="window-dropdown">
                        <button className="window-dropdown-button">Window</button>
                        <div className="window-dropdown-content">
                            {props.windows.map((window, index) => {
                                return (
                                    <label key={index} className="window-checkbox">
                                        <input
                                            type="checkbox"
                                            value={"window" + index}
                                            defaultChecked={true}
                                            onChange={() => {
                                                let newState = [...windowState];
                                                newState[index] = !newState[index];
                                                setWindowState(newState);
                                            }}
                                        />
                                        {window.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    <label>
                        Time Scale:
                        <select className='time-scale-selector' onChange={(e) => {
                            e.preventDefault();
                            setTimeScale(e.target.value);
                        }}>
                            <option value='hour'>Hour</option>
                            <option value='day' selected>Day</option>
                            <option value='week'>Week</option>
                            <option value='month'>Month</option>
                        </select>
                    </label>
                    <button className='reset-button' onClick={() => {
                        if (chartRef.current) {
                            chartRef.current.resetZoom();
                        }
                    }}>Reset</button>
                </div>

                <div className='graph-section-wrapper-div'>
                    <Line ref={chartRef} options={options} data={data} />
                </div>
            </div>
        </div>
    );
}
