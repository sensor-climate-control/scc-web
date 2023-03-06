export default function WindowBox(props) {
    return (
        <div className="layout-window-box">
            <h1 className='layout-window-name'>{props.data.name}</h1>
            <h2 className='layout-window-text'>Status: {props.data.status.charAt(0).toUpperCase() + props.data.status.slice(1)}</h2>
            <h2 className='layout-window-text'>Temperature: {props.data.temp} F</h2>
            <h2 className='layout-window-text'>Humidity: {props.data.humidity}%</h2>
        </div>
    )
}