const router = require('express').Router();
const weather = require('../data/weather.json')

// Fetches and returns 3-hour, 5-day weather forecast
// Calls OpenWeatherMap API
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Requires authentication
router.get('/', async function (req, res, next) {
    res.status(200).send(weather.fiveDay)
})

// Fetches and returns current weather forecast
// Calls OpenWeatherMap API 
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// Requires authentication
router.get('/now', async function (req, res, next) {
    res.status(200).send(weather.current)
})

// Fetches and returns AQI forecast
// Calls AirNow API
// https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode={zip}&date=2022-11-09&distance=25&API_KEY={API key}
// Requires authentication
router.get('/aqi', async function (req, res, next) {
    res.status(200).send(weather.aqiForecast)
})

// Fetches and returns current AQI observation
// Calls AirNow API
// https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode={zip}&distance=25&API_KEY={API key}
// Requires authentication
router.get('/aqi/now', async function (req, res, next) {
    res.status(200).send(weather.currentAqi)
})

exports.router = router;