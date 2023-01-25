import MyCard from "../application/MyCard";
import { useGetWeatherQuery } from '../../reduxApi';

const CurrentWeather = () => {
    const { data, error, isLoading } = useGetWeatherQuery();

    return (
        <MyCard title="Current Weather">
            {
                (isLoading) ? (<p>Loading...</p>) :
                (error) ? (<p>{error}</p>) : (
                    <div className="weather-stats-wrapper">
                        <p>Temperature: {data.main.temp}°F</p>
                        <p>Feels Like: {data.main.feels_like}°F</p>
                        <p>Humidity: {data.main.humidity}%</p>
                    </div>
                )
            }
        </MyCard>
    )
}

export default CurrentWeather;
