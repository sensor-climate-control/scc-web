import './LayoutSection.css'

export default function LayoutSection(props) {
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
                                {props.data.map((window) => {
                                    if (window.window_orientation === "north") {
                                        return (
                                            <div className="layout-window-box">
                                                <h1 className='layout-window-name'>{window.data.name}</h1>
                                                <h2 className='layout-window-text'>{window.data.status}</h2>
                                                <h2 className='layout-window-text'>{window.data.temp}</h2>
                                                <h2 className='layout-window-text'>{window.data.humidity}</h2>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>

                        <div className='vertical-window-wrapper'>
                            {/* West windows */}
                            <div className='outer-west-window-wrapper'>
                                <div className="west-window-wrapper">
                                    {props.data.map((window) => {
                                        if (window.window_orientation === "west") {
                                            return (
                                                <div className="layout-window-box">
                                                    <h1 className='layout-window-name'>{window.data.name}</h1>
                                                    <h2 className='layout-window-text'>{window.data.status}</h2>
                                                    <h2 className='layout-window-text'>{window.data.temp}</h2>
                                                    <h2 className='layout-window-text'>{window.data.humidity}</h2>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>

                            {/* East windows */}
                            <div className='outer-east-window-wrapper'>
                                <div className="east-window-wrapper">
                                    {props.data.map((window) => {
                                        if (window.window_orientation === "east") {
                                            return (
                                                <div className="layout-window-box">
                                                    <h1 className='layout-window-name'>{window.data.name}</h1>
                                                    <h2 className='layout-window-text'>{window.data.status}</h2>
                                                    <h2 className='layout-window-text'>{window.data.temp}</h2>
                                                    <h2 className='layout-window-text'>{window.data.humidity}</h2>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* South windows */}
                        <div className='outer-south-window-wrapper'>
                            <div className="south-window-wrapper">
                                {props.data.map((window) => {
                                    if (window.window_orientation === "south") {
                                        return (
                                            <div className="layout-window-box">
                                                <h1 className='layout-window-name'>{window.data.name}</h1>
                                                <h2 className='layout-window-text'>{window.data.status}</h2>
                                                <h2 className='layout-window-text'>{window.data.temp}</h2>
                                                <h2 className='layout-window-text'>{window.data.humidity}</h2>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}