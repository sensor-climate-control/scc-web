import MyCard from "../application/MyCard";
import { useSelector, useDispatch } from 'react-redux';
import { setTemp, setFeelsLike, setHumidity } from '../redux/weatherSlice';
import { useEffect } from 'react';
import { endpoint } from '../../App';

const CurrentWeather = () => {
    const temp = useSelector(state => state.weather.value.temp);
    const humidity = useSelector(state => state.weather.value.humidity);
    const feelsLike = useSelector(state => state.weather.value.feelsLike);

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            let res = await fetch(endpoint + '/weather/now')

            if (res.ok) {
                let data = await res.json();
                dispatch(setTemp(data.main.temp));
                dispatch(setHumidity(data.main.humidity));
                dispatch(setFeelsLike(data.main.feels_like));
            }
        }

        fetchData();
        let id = setInterval(fetchData, 5000);

        return () => clearInterval(id);
    }, [dispatch])

    return (
        <MyCard title="Current Weather">
            <p>Temperature: {temp}°F</p>
            <p>Feels Like: {feelsLike}°F</p>
            <p>Humidity: {humidity}%</p>

        </MyCard>
    )
}

export default CurrentWeather;
