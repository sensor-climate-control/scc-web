import './LayoutSection.css'
import WindowBox from './WindowBox'

export default function LayoutSection(props) {
    let south_windows = props.data.filter((window) => window.window_orientation === "south")
    let north_windows = props.data.filter((window) => window.window_orientation === "north")
    let east_windows = props.data.filter((window) => window.window_orientation === "east")
    let west_windows = props.data.filter((window) => window.window_orientation === "west")

    return (
        <div className="layout-section">
            <div className="layout-section-title">
                <h1>Home Layout Map</h1>

                <div className="home-layout-wrapper">
                    {/* Draw a rectangle */}
                    <div className="home-layout-rectangle">
                        {/* North windows */}
                        <div className='outer-north-window-wrapper'>
                            <div className="north-window-wrapper">
                                {north_windows.map((window, i) => <WindowBox key={i} data={window.data} /> ) }
                            </div>
                        </div>

                        <div className='vertical-window-wrapper'>
                            {/* West windows */}
                            <div className='outer-west-window-wrapper'>
                                <div className="west-window-wrapper">
                                    {west_windows.map((window, i) => <WindowBox key={i} data={window.data} /> ) }
                                </div>
                            </div>

                            {/* East windows */}
                            <div className='outer-east-window-wrapper'>
                                <div className="east-window-wrapper">
                                    {east_windows.map((window, i) => <WindowBox key={i} data={window.data} /> ) }
                                </div>
                            </div>
                        </div>

                        {/* South windows */}
                        <div className='outer-south-window-wrapper'>
                            <div className="south-window-wrapper">
                                {south_windows.map((window, i) => <WindowBox key={i} data={window.data} /> )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}