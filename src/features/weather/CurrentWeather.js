import MyCard from "../application/MyCard";
import { useGetCurrentWeatherQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";
import WeatherCard from "./WeatherCard";

const CurrentWeather = (props) => {
    const { data, isError, error, isLoading, isUninitialized } = useGetCurrentWeatherQuery(
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
                (isLoading || isUninitialized) ? <CircularProgress /> :
                (<div className="weather-stats-wrapper">
                    <WeatherCard key={data.dt} weather={data} feels_like={true}/>
                </div>)
            }
        </MyCard>
    )
}

export default CurrentWeather;
