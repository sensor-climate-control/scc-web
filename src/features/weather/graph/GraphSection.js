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
let labels = [];
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 4; j++) {
        let strI = i.toString();
        if (i < 10) {
            strI = `0${i}`;
        }

        let strJ = (j * 15).toString();
        if (j * 15 < 10) {
            strJ = `0${j}`;
        }

        labels.push(strI + ':' + strJ);
    }
}

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

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].lastReadings === [] || !windowState[i]) {
                continue;
            }

            datasets.push({
                label: windows[i].name,
                data: windows[i].lastReadings ? windows[i].lastReadings.filter(reading => reading.date_time > cuttoffTime).map((reading) => reading.temp_f) : [],
                borderColor: colors[i].borderColor,
                backgroundColor: colors[i].backgroundColor,
            })
        }
    }

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
                ticks: {
                    min: 60,
                    max: 70,
                },
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
        console.log("Resetting.")
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
                            <option value='day'>Day</option>
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
