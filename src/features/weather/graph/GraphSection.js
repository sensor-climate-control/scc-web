import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import React from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

        let strJ = (j*15).toString();
        if (j*15 < 10) {
            strJ = `0${j}`;
        }

        labels.push(strI + ':' + strJ);
    }
}

function gen_fake_data(labels, min, max) {
    let curr_val = faker.datatype.number({ min: min, max: max, precision: 0.1});
    let data = [curr_val];

    for (let i = 1; i < labels.length; i++) {
        curr_val += faker.datatype.number({ min: -0.3, max: 0.3, precision: 0.1 });
        data.push(curr_val);
    }

    return data
}



export default function GraphSection(props) {
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
                    </div>
                </div>
            </div>
        );
    } 

    const datasets = [];
    console.log(props.windows)
    let colors = [{
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
    }]

    // average all the data points for each window that has a full 100 data points
    let avg_data = []
    for (let i=0; i<100; i++) {
        avg_data.push(0)
        let num_skipped = 0;
        for (let j=0; j<props.windows.length; j++) {
            if (props.windows[j].lastReadings.length === 0) {
                num_skipped++;
                continue;
            }

            avg_data[i] += parseFloat(props.windows[j].lastReadings[i].temp_f);
        }

        avg_data[i] /= props.windows.length-num_skipped;
    }

    console.log(avg_data)

    for (let i = 0; i < props.windows.length; i++) {
        console.log(props.windows[i])
        if (props.windows[i].lastReadings === []) {
            continue;
        }

        datasets.push({
            label: props.windows[i].name,
            data: props.windows[i].lastReadings.map((reading) => reading.temp_f),
            borderColor: colors[i].borderColor,
            backgroundColor: colors[i].backgroundColor,
        })
    }

    datasets.push({
        label: 'Average',
        data: avg_data,
        borderColor: 'black',
        backgroundColor: 'black',
    })

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

    return (
        <div className='outer-graph-section-wrapper'>
            <div className='inner-graph-section-wrapper'>
                <h1 className='graph-overview-header-text'>Datapoints</h1>
                <hr className="window-overview-header-line" />
                <div className='graph-section-wrapper-div'>
                    <Line options={options} data={data} />
                </div>
            </div>
        </div>
    );
}