import MyCard from "../application/MyCard";
import { useGetWeatherQuery } from '../../reduxApi';

const CurrentWeather = () => {
    // const { error: authError, isLoading: authIsLoading } = useGetAuthQuery();

    const { data, error, isLoading } = useGetWeatherQuery();

    console.log("==== error: ", error)

    return (
        <MyCard title="Current Weather">
            {
                (isLoading) ? (<p>Loading...</p>) :
                (error) ? (<p>{JSON.stringify(error)}</p>) : (
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
