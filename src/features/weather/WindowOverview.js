import HorizontalDiv from "../application/HorizontalDiv";
import RemoveSensor from "../home/RemoveSensor";
import NewWindow from "./NewWindow";
import "./WindowOverview.css";
import WindowSection from "./WindowSection";
import { Grid } from '@mui/material';

export default function WindowOverview(props) {
    if (props.windows === []) {
        return (
            <div className="outer-window-overview-wrapper">
                <div className="inner-window-overview-wrapper">
                    <div className="window-overview-header">
                        <h1 className="window-overview-header-text">Sensor Overview</h1>
                    </div>

                    <hr className="window-overview-header-line" />

                    <div className="window-overview-body">
                        <NewWindow />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="outer-window-overview-wrapper">
            <div className="inner-window-overview-wrapper">
                <div className="window-overview-header">
                    <h1 className="window-overview-header-text">Sensor Overview</h1>
                </div>

                <hr className="window-overview-header-line" />

                <Grid container spacing={1} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    {props.windows.map((window, ind) => (
                        <Grid item xs='auto'>
                            <HorizontalDiv key={ind}>
                                <WindowSection  name={window.name} status={window.status} temp={window.temp} humidity={window.humidity} />
                                <RemoveSensor sensorid={window.id} homeid={props.homeid} />
                            </HorizontalDiv>
                        </Grid>
                        )
                    )}
                    <Grid item xs='auto'>
                        <NewWindow />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
