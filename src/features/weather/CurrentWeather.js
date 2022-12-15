import MyCard from "../application/MyCard";
import { useSelector } from 'react-redux';

const CurrentWeather = () => {
    const temp = useSelector(state => state.weather.value.temp);
    const humidity = useSelector(state => state.weather.value.humidity);
    const feelsLike = useSelector(state => state.weather.value.feelsLike);

    return (
        <MyCard title="Current Weather">
            <p>Temperature: {temp}°F</p>
            <p>Feels Like: {feelsLike}°F</p>
            <p>Humidity: {humidity}%</p>

        </MyCard>
    )
}

export default CurrentWeather;
