import MyCard from "../application/MyCard";
import { useGetCurrentAqiQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";
import TimestampToDateTime from "../application/TimestampToDateTime";

const CurrentAqi = (props) => {
    const { data, error, isError, isLoading, isUninitialized } = useGetCurrentAqiQuery(
        props.zip_code, 
        { 
            pollingInterval: 30000,
            skip: !props.zip_code, 
        }
    );

    const aqi_description = ["Good", "Fair", "Moderate", "Poor", "Very Poor"]

    return (
        <MyCard title="Current Air Quality">
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> : 
                (data.list && data.list.length > 0) ? 
                (<div className="weather-stats-wrapper">
                        <p>AQI (PM2.5): {data.list[0].components.pm2_5 * 10}</p>
                        <p>Category: {data.list[0].main.aqi} ({aqi_description[data.list[0].main.aqi - 1]})</p>
                        <p>Last Reading: {TimestampToDateTime(data.list[0].dt * 1000)}</p>
                </div>) : (<p>No results found</p>)
            }
        </MyCard>
    )
}

export default CurrentAqi;
