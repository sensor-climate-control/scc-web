/** @jsxImportSource @emotion/react */
import Text from '../application/Text'
import { css } from '@emotion/react';

function WeatherCard (props) {
    const horizontal = css`
        display: inline-flex;
        flex-direction: row;
        margin-left: 20px;
    `;
    const styles = css `
      border: 1px solid #dedddc;
      display: inline-flex;
      width: 150px;
      flex-direction: column;
      margin: max(0.5vw, 10px);
      background-color: #dedddc;
      align-items: center;
      font-weight: bold;
    `;
  
    const dt = new Date(`${props.weather.dt_txt}`)
    return (
      <div key={props.weather.dt} css={styles}>
        <Text>{dt.toDateString()}</Text>
        <Text>{dt.toLocaleTimeString('en-us')}</Text>
        <img src={ `https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@4x.png` } alt={props.weather.weather[0].description}/>
        <div css={horizontal}>
          <Text color="red">High: {props.weather.main.temp_max}</Text>
          <Text color="blue">Low: {props.weather.main.temp_min}</Text>
        </div>
        <Text>Precip: {props.weather.pop * 100}%</Text>
        <Text>{props.weather.weather[0].description}</Text>
      </div>
    )
}

export default WeatherCard;