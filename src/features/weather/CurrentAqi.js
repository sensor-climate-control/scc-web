/** @jsxImportSource @emotion/react */
import MyCard from "../application/MyCard";
import { useGetCurrentAqiQuery } from '../../reduxApi';
import { CircularProgress } from "@mui/material";
import Text from '../application/Text';
import HorizontalDiv from '../application/HorizontalDiv';

const CurrentAqi = (props) => {

    const { data, error, isError, isLoading, isUninitialized } = useGetCurrentAqiQuery(
        props.zip_code, 
        { 
            pollingInterval: 30000,
            skip: !props.zip_code, 
        }
    );

    const aqi_description = ["Good", "Fair", "Moderate", "Poor", "Very Poor"]
    const aqi_color = ["green", "yellow", "red", "purple", "maroon"]
    const dt = (data) ? new Date(data.list[0].dt * 1000) : null


    return (
        <MyCard title="Current Air Quality">
            {
                (isError) ? (<p>Error: {JSON.stringify(error)}</p>) :
                (isLoading || isUninitialized) ? <CircularProgress /> : 
                (data.list && data.list.length > 0) ? 
                (<div className="weather-stats-wrapper">
                    <Text>{dt.toDateString()}</Text>
                    <Text>{dt.toLocaleTimeString('en-us')}</Text>
                    <br />
                    <HorizontalDiv>
                        <Text>AQI (PM2.5): </Text>
                        <Text color={aqi_color[data.list[0].main.aqi - 1]}>{Math.floor(data.list[0].components.pm2_5 * 10)}</Text>
                    </HorizontalDiv>
                    <HorizontalDiv>
                        <Text>Category: </Text>
                        <Text color={aqi_color[data.list[0].main.aqi - 1]}>{data.list[0].main.aqi} ({aqi_description[data.list[0].main.aqi - 1]})</Text>
                    </HorizontalDiv>
                </div>) : (<p>No results found</p>)
            }
        </MyCard>
    )
}

export default CurrentAqi;
