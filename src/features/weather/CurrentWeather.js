import MyCard from "../application/MyCard";
import { useEffect, useState } from "react";
import { endpoint } from "../../App";

const CurrentWeather = () => {
    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);

    /*
     * Query the AQI from the backend server
     */
    async function getTempStats() {
        return new Promise(async (resolve, _) => {
            const res = await fetch(endpoint + "weather/now");
            const data = await res.json();

            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const feelsLike = data.main.feels_like;

            resolve({ temp, humidity, feelsLike });
        });
    }

    /*
     * Updates the AQI and AQI color every ten seconds once the component is mounted.
     * Clears the timer when the component is unmounted.
     */
    useEffect(() => {
        /* commented out to appease ESLint */
        // const color_map = {
        //     1: "#00ff88",
        //     2: "#ffff00",
        //     3: "#ff8800",
        //     4: "#ff0000",
        //     5: "#99004c",
        //     6: "#7e0023",
        // }

        function updateTemp() {
            getTempStats().then(({ temp, humidity, feelsLike }) => {
                setTemp(temp);
                setHumidity(humidity);
                setFeelsLike(feelsLike);
            });
        }

        updateTemp();
        const interval = setInterval(updateTemp, 1000 * 300); // update every 5 minutes

        return () => clearInterval(interval);
    });
    return (
        <MyCard title="Current Weather">
            <p>Temperature: {temp}°F</p>
            <p>Feels Like: {feelsLike}°F</p>
            <p>Humidity: {humidity}%</p>

        </MyCard>
    )
}

export default CurrentWeather;
