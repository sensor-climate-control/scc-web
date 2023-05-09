const router = require('express').Router();
const { requireAuthentication } = require('../lib/auth');
const { geoLocation } = require('../lib/geo');
const { getLatestWeatherReadingByZip, insertWeatherReadingByZip, getLatestAqiReadingByZip, insertAqiReadingByZip, getFiveThreeForecastByZip, updateFiveThreeForecastByZip, getAqiForecastByZip, updateAqiForecastByZip } = require('../models/weather');
require('dotenv').config();

const openweathermapApiKey = process.env.OWM_API_KEY

// Fetches and returns 3-hour, 5-day weather forecast
// Calls OpenWeatherMap API
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Requires authentication
router.get('/', requireAuthentication, async function (req, res, next) {
    if(req.query && req.query.zip) {
        const currentTime = Date.now()
        const lastForecast = await getFiveThreeForecastByZip(req.query.zip)

        // check if 30 minutes have passed since forecast was updated
        if (lastForecast && ((lastForecast.dt + 1800000) > currentTime)) {
            console.log("==== weather forecast retrieved less than 30 minutes ago, re-using")
            res.status(200).send(lastForecast.forecast)
        } else {
            console.log("==== weather forecast retrieved more than 30 minutes ago, calling API")

            const geo = await geoLocation(req.query.zip, "US")
            if(geo.cod) {
                res.status(geo.cod).send(geo.message)
                return
            }
    
            let fiveDayWeather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
            fiveDayWeather = await fiveDayWeather.json()

            const result = await updateFiveThreeForecastByZip(req.query.zip, fiveDayWeather)
            console.log("==== updateFiveThreeForecastByZip: ", result)

            res.status(200).send(fiveDayWeather)
        }

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
        const currentTime = Date.now()
        const lastReading = await getLatestWeatherReadingByZip(req.query.zip)

        // check if 15 minutes have passed since last reading
        if (lastReading && ((lastReading.dt * 1000) + 900000) > currentTime) {
            console.log("==== last weather reading happened less than 15 minutes ago, re-using")
            res.status(200).send(lastReading)
        } else {
            console.log("==== last weather reading happened more than 15 minutes ago, calling API")

            const geo = await geoLocation(req.query.zip, "US")
            if(geo.cod) {
                res.status(geo.cod).send(geo.message)
                return
            }
    
            let currentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
            currentWeather = await currentWeather.json()
    
            const result = await insertWeatherReadingByZip(req.query.zip, currentWeather)
            console.log("==== insertWeatherReading result: ", result)

            res.status(200).send(currentWeather)
        }
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
        const currentTime = Date.now()
        const lastForecast = await getAqiForecastByZip(req.query.zip)

        // check if 30 minutes have passed since forecast was updated
        if (lastForecast && ((lastForecast.dt + 1800000) > currentTime)) {
            console.log("==== aqi forecast retrieved less than 30 minutes ago, re-using")
            res.status(200).send(lastForecast.forecast)
        } else {
            console.log("==== aqi forecast retrieved more than 30 minutes ago, calling API")
            const geo = await geoLocation(req.query.zip, "US")
            if(geo.cod) {
                res.status(geo.cod).send(geo.message)
                return
            }
            let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${openweathermapApiKey}`)
            response = await response.json()

            const result = await updateAqiForecastByZip(req.query.zip, response)
            console.log("==== updateFiveThreeForecastByZip: ", result)

            res.status(200).send(response)
        }
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
        const currentTime = Date.now()
        const lastReading = await getLatestAqiReadingByZip(req.query.zip)

        // check if 15 minutes have passed since last reading
        if (lastReading && (!lastReading.cod) && ((lastReading.list[0].dt * 1000) + 900000) > currentTime) {
            console.log("==== last aqi reading happened less than 15 minutes ago, re-using")
            res.status(200).send(lastReading)
        } else {
            console.log("==== last aqi reading happened more than 15 minutes ago, calling API")

            const geo = await geoLocation(req.query.zip, "US")
            if(geo.cod) {
                res.status(geo.cod).send(geo.message)
                return
            }
            let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${geo.lat}&lon=${geo.lon}&appid=${openweathermapApiKey}`)
            response = await response.json()
            const result = await insertAqiReadingByZip(req.query.zip, response)
            console.log("==== insertWeatherReading result: ", result)
        
            res.status(200).send(response)
        }
    } else {
        res.status(400).send({
            error: "Request does not have a zip code in query string"
        })
    }
})

exports.router = router;
