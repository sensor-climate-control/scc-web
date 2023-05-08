import NewWindow from "./NewWindow";
import "./WindowOverview.css";
import WindowSection from "./WindowSection";

export default function WindowOverview(props) {
    if (props.windows === []) {
        return (
            <div className="outer-window-overview-wrapper">
                <div className="inner-window-overview-wrapper">
                    <div className="window-overview-header">
                        <h1 className="window-overview-header-text">Overview</h1>
                    </div>

                    <hr className="window-overview-header-line" />

                    <div className="window-overview-body">
                        <NewWindow />
                    </div>
                </div>
            </div>
        );
    }

    console.log(props.windows[0]);

    return (
        <div className="outer-window-overview-wrapper">
            <div className="inner-window-overview-wrapper">
                <div className="window-overview-header">
                    <h1 className="window-overview-header-text">Overview</h1>
                </div>

                <hr className="window-overview-header-line" />

                <div className="window-overview-body">
                    {props.windows.map((window, ind) => 
                        <WindowSection key={ind} name={window.name} status={window.status} temp={window.temp} humidity={window.humidity} />
                    )}

                    <NewWindow />
                </div>
            </div>
        </div>
    );
}
