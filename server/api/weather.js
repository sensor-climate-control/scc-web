const router = require('express').Router();
const { requireAuthentication } = require('../lib/auth');
const { geoLocation } = require('../lib/geo');
require('dotenv').config();

const openweathermapApiKey = process.env.OWM_API_KEY
const airnowApiKey = process.env.AIRNOW_API_KEY

// Fetches and returns 3-hour, 5-day weather forecast
// Calls OpenWeatherMap API
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Requires authentication
router.get('/', requireAuthentication, async function (req, res, next) {
    if(req.query && req.query.zip) {
        const geo = await geoLocation(req.query.zip, "US")

        let fiveDayWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
        fiveDayWeather = await fiveDayWeather.json()
        res.status(200).send(fiveDayWeather)
    } else {
        res.status(400).send({
            error: "Request does not have a zip code in query string"
        })
    }
})

// Fetches and returns current weather forecast
// Calls OpenWeatherMap API 
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// Requires authentication
router.get('/now', requireAuthentication, async function (req, res, next) {
    if(req.query && req.query.zip) {
        const geo = await geoLocation(req.query.zip, "US")

        let currentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
        currentWeather = await currentWeather.json()

        res.status(200).send(currentWeather)
    } else {
        res.status(400).send({
            error: "Request does not have a zip code in query string"
        })
    }
})

// Fetches and returns AQI forecast
// Calls AirNow API
// https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode={zip}&date=2022-11-09&distance=25&API_KEY={API key}
// Requires authentication
router.get('/aqi', requireAuthentication, async function (req, res, next) {
    if(req.query && req.query.zip) {
        let response = await fetch(`https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${req.query.zip}&date=2022-11-09&distance=25&API_KEY=${airnowApiKey}`)
        response = await response.json()

        res.status(200).send(response)
    } else {
        res.status(400).send({
            error: "Request does not have a zip code in query string"
        })
    }
})

// Fetches and returns current AQI observation
// Calls AirNow API
// https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode={zip}&distance=25&API_KEY={API key}
// Requires authentication
router.get('/aqi/now', requireAuthentication, async function (req, res, next) {
    if(req.query && req.query.zip) {
        let response = await fetch(`https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${req.query.zip}&distance=25&API_KEY=${airnowApiKey}`)
        response = await response.json()
    
        res.status(200).send(response)
    } else {
        res.status(400).send({
            error: "Request does not have a zip code in query string"
        })
    }
})

exports.router = router;
