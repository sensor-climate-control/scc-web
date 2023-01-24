import "./WindowSection.css"

export default function WindowSection(props) {
    let bg_color = "";
    if (props.status == "open") {
        bg_color = "#4aff71";
    } else if (props.status == "closed") {
        bg_color = "#ff0000";
    } else {
        bg_color = "#efff00";
    }

    return (
        <button className="window-section-wrapper">
            <div className="inner-window-section-wrapper">
                <div className="window-section-indicator">
                    <div className="window-section-indicator-circle" style={{backgroundColor: bg_color}}/>
                </div>

                <div className="window-section-header">
                    <h1 className="window-section-header-text">{props.name}</h1>
                </div>
            </div>
        </button>
    );
}