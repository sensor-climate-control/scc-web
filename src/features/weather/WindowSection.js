import "./WindowSection.css"
import { useState } from "react";

export default function WindowSection(props) {
    let [isToggled, setIsToggled] = useState(false);

    let bg_color = "";
    if (props.status === "open") {
        bg_color = "#4aff71";
    } else if (props.status === "closed") {
        bg_color = "#ff0000";
    } else {
        bg_color = "#efff00";
    }

    return (
        <button className="window-section-wrapper" onClick={() => setIsToggled(!isToggled)}>
            {!isToggled ? (
                <div className="inner-window-section-wrapper">
                    <div className="window-section-indicator">
                        <div className="window-section-indicator-circle" style={{backgroundColor: bg_color}}/>
                    </div>

                    <div className="window-section-header">
                        <h1 className="window-section-header-text">{props.name}</h1>
                    </div>
                </div>
            ):(
                <div className="outer-window-section-wrapper">
                    <div className="inner-window-section-wrapper">
                        <div className="window-section-indicator">
                            <div className="window-section-indicator-circle" style={{backgroundColor: bg_color}}/>
                        </div>

                        <div className="window-section-header">
                            <h1 className="window-section-header-text">{props.name}</h1>
                        </div>
                    </div>

                    <div className="window-section-detailed">
                        <p className="window-section-detailed-text">Temperature: 30.4 F</p>
                        <p className="window-section-detailed-text">Humidity: 30.4 F</p>
                    </div>
                </div>
            )}
        </button>
    );
}