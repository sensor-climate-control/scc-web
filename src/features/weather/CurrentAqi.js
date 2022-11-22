import MyCard from "../application/MyCard";
import { useEffect, useState } from "react";
import { endpoint } from "../../App";

const CurrentAqi = () => {
    const [aqi, setAqi] = useState(0);
    const [aqiColor, setAqiColor] = useState("#00ff88");

    /*
     * Query the AQI from the backend server
     */
    async function getAqi() {
        return new Promise(async (resolve, _) => {
            const res = await fetch(endpoint + "weather/aqi/now");
            const data = await res.json();

            const aqi = data[0].AQI;
            const aqiColor = data[0].Category.Number;

            resolve({ aqi, aqiColor });
        });
    }

    /*
     * Updates the AQI and AQI color every ten seconds once the component is mounted.
     * Clears the timer when the component is unmounted.
     */
    useEffect(() => {
        const color_map = {
            1: "#00ff88",
            2: "#ffff00",
            3: "#ff8800",
            4: "#ff0000",
            5: "#99004c",
            6: "#7e0023",
        }

        function updateAqi() {
            getAqi().then(({ aqi, aqiColor }) => {
                setAqi(aqi);
                setAqiColor(color_map[aqiColor]);
            });
        }

        updateAqi();
        const interval = setInterval(updateAqi, 1000 * 10);

        return () => clearInterval(interval);
    });

    /*
     * Render a card with the current AQI
     */
    return (
        <MyCard title="Current AQI">
            <p style={{color: aqiColor}}>{aqi}</p>
        </MyCard>
    )
}

export default CurrentAqi;
