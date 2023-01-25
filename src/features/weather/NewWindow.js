import './NewWindow.css'
export default function NewWindow() {
    return (
        <button className="window-section-wrapper">
            <div className="inner-window-section-wrapper">
                <div className="window-section-indicator">
                    <div className="window-section-indicator-circle" style={{backgroundColor: bg_color}}/>
                </div>

                <div className="window-section-header">
                    <h1 className="window-section-header-text">Add a new window...</h1>
                </div>
            </div>
        </button>
    );
}