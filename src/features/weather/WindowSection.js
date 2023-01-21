import "./WindowSection.css"

export default function WindowSection(props) {
    return (
        <button className="window-section-wrapper">
            <div className="inner-window-section-wrapper">
                <div className="window-section-indicator">
                    <div className="window-section-indicator-circle" />
                </div>

                <div className="window-section-header">
                    <h1 className="window-section-header-text">{props.name}</h1>
                </div>
            </div>
        </button>
    );
}