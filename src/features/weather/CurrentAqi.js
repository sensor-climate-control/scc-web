import MyCard from "../application/MyCard";
import { useGetCurrentAqiQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";

const CurrentAqi = (props) => {
    const { data, error, isLoading } = useGetCurrentAqiQuery(
        props.zip_code, 
        { pollingInterval: 30000, }
    );

    return (
        <MyCard title="Current AQI">
            {(isLoading || error || data.length < 1) ? <CircularProgress /> : (
                <div className="weather-stats-wrapper">
                    <p>AQI: {data[0].AQI}</p>
                    <p>Category: {data[0].Category.Number} ({data[0].Category.Name})</p>
                    <p>Last Reading: {data[0].DateObserved} at {data[0].HourObserved}:00 {data[0].LocalTimeZone}</p>
                </div>
            )}
        </MyCard>
    )
}

export default CurrentAqi;
