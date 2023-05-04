import MyCard from "../application/MyCard";
import { useGetWeatherQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";

const CurrentWeather = (props) => {
    const { data, error, isLoading } = useGetWeatherQuery(
        props.zip_code, 
        { pollingInterval: 30000, }
    );

    return (
        <MyCard title="Current Weather">
            {(isLoading || error || !data.main) ? <CircularProgress /> : (
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
