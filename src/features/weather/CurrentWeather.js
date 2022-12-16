import MyCard from "../application/MyCard";
import { useSelector, useDispatch } from 'react-redux';
import { refreshData } from '../redux/weatherSlice';

const CurrentWeather = () => {
    const temp = useSelector(state => state.weather.value.temp);
    const humidity = useSelector(state => state.weather.value.humidity);
    const feelsLike = useSelector(state => state.weather.value.feelsLike);

    const dispatch = useDispatch();
    dispatch(refreshData());

    return (
        <MyCard title="Current Weather">
            <p>Temperature: {temp}°F</p>
            <p>Feels Like: {feelsLike}°F</p>
            <p>Humidity: {humidity}%</p>

        </MyCard>
    )
}

export default CurrentWeather;
