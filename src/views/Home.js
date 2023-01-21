import WindowOverview from "../features/weather/WindowOverview";

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
        <div>
            <WindowOverview windows={windows} />
        </div>
    );
}