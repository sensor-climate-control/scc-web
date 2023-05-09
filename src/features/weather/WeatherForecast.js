import MyCard from "../application/MyCard";
import { useGetWeatherForecastQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";

const WeatherForecast = (props) => {
    const { data, isError, error, isLoading, isUninitialized } = useGetWeatherForecastQuery(
        props.zip_code,
        { 
            pollingInterval: 30000,
            skip: !props.zip_code,
        }
    );

    return (
        <MyCard title="5-day 3-hour WeatherForecast">
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> :  (
                <p>{JSON.stringify(data)}</p>
            )}
        </MyCard>
    )
}

export default WeatherForecast;
