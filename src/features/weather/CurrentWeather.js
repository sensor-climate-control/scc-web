import MyCard from "../application/MyCard";
import { useGetWeatherQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";

const CurrentWeather = (props) => {
    const { data, isError, error, isLoading, isUninitialized } = useGetWeatherQuery(
        props.zip_code,
        { 
            pollingInterval: 30000,
            skip: !props.zip_code,
        }
    );

    return (
        <MyCard title="Current Weather">
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> :  (
                <div className="weather-stats-wrapper">
                    <p>Temperature: {data.main.temp}°F</p>
                    <p>Feels Like: {data.main.feels_like}°F</p>
                    <p>Humidity: {data.main.humidity}%</p>
                </div>
            )}
        </MyCard>
    )
}

export default CurrentWeather;
