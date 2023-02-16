import WindowOverview from "../features/weather/WindowOverview";
import GraphSection from "../features/weather/graph/GraphSection";
import { faker } from '@faker-js/faker';
import './Home.css'

export default function Home() {
    let windows = [
        {
            name: "Bedroom Window",
            status: "open",
        },
        {
            name: "Living Room Window",
            status: "open",
        },
        {
            name: "Kitchen Window",
            status: "close_soon",
        },
        {
            name: "Guest Bedroom Window",
            status: "closed",
        }
    ]

    faker.seed(123);

    let temp_points = [];
    for (let i = 0; i < 100; i++) {
        temp_points.push({
            x: i,
            y: faker.datatype.number({min: 62, max: 74})
        });
    }

    return (
        <div className="outer-home-sections-wrapper">
            <WindowOverview windows={windows} />
            <GraphSection temp_points={temp_points}/>
        </div>
    );
}