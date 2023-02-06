import WindowOverview from "../features/weather/WindowOverview";
import GraphSection from "../features/weather/graph/GraphSection";
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

    return (
        <div className="outer-home-sections-wrapper">
            <WindowOverview windows={windows} />
            <GraphSection />
        </div>
    );
}