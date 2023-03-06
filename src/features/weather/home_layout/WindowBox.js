export default function WindowBox(props) {
    return (
        <div className="layout-window-box">
            <h1 className='layout-window-name'>{props.data.name}</h1>
            <h2 className='layout-window-text'>{props.data.status}</h2>
            <h2 className='layout-window-text'>{props.data.temp}</h2>
            <h2 className='layout-window-text'>{props.data.humidity}</h2>
        </div>
    )
}