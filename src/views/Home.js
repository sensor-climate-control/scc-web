import WindowOverview from "../features/weather/WindowOverview";
import GraphSection from "../features/weather/graph/GraphSection";
import './Home.css'
import { api } from '../reduxApi';
import LayoutSection from "../features/weather/home_layout/LayoutSection";

const HOME_ID = "63ed9cb48af0fbb8f0201c11";

export default function Home() {
    // useeffect
    const { data } = api.useGetHomeSensorsQuery(HOME_ID, {
        pollingInterval: 3000,
    });

    // fake data while loading
    let window_data = []

    // switch to real data
    if (data) {
        window_data = []
        let window = {}
        for (let i = 0; i < data.length; i++) {
            if (data[i].readings.length === 0) {
                window = {
                    name: data[i].name,
                    status: "closed",
                    temp: 0,
                    humidity: 0,
                    lastReadings: [],
                }
            } else {
                window = {
                    name: data[i].name,
                    status: "closed",
                    temp: data[i].readings[data[i].readings.length - 1].temp_f,
                    humidity: data[i].readings[data[i].readings.length - 1].humidity,
                    lastReadings: data[i].readings.slice(Math.max(data[i].readings.length - 100, 0))
                }
            }

            window_data.push(window)
        }
    }

    let orientations = ["north", "south", "east", "west"]

    let map_window_data = window_data.map((window) => {
        return {
            window_orientation: orientations.pop(),
            data: window,
        }
    })

    return (
        <div className="outer-home-sections-wrapper">
            <div className="top-section-wrapper">
                <WindowOverview windows={window_data} />
                <GraphSection windows={window_data}/>
            </div>

            <div className="bottom-section-wrapper">
                <LayoutSection data={map_window_data} />
            </div>
        </div>
    );
}