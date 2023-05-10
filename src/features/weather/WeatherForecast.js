import MyCard from "../application/MyCard";
import { useGetWeatherForecastQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";
import WeatherCard from './WeatherCard';

const WeatherForecast = (props) => {
    const { data, isSuccess, isError, error, isLoading, isUninitialized } = useGetWeatherForecastQuery(
        props.zip_code,
        { 
            pollingInterval: 30000,
            skip: !props.zip_code,
        }
    );

    return (
        <MyCard title="5-day 3-hour WeatherForecast" style={{ width: '80rem', backgroundColor: '#646c7a' }}>
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> : 
                (isSuccess && data && data.list) ? (
                    <div>
                        {data.list.map(weather =>
                            <WeatherCard key={weather.dt} weather={weather} />
                        )}
                    </div>
                ) : (<p>No Data</p>)}
        </MyCard>
    )
}

export default WeatherForecast;
