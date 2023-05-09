const { getAllZipCodes } = require('../models/weather')
const { getLatestWeatherReadingByZip, insertWeatherReadingByZip, getLatestAqiReadingByZip, insertAqiReadingByZip, getFiveThreeForecastByZip, updateFiveThreeForecastByZip, getAqiForecastByZip, updateAqiForecastByZip } = require('../models/weather');
const { geoLocation } = require('../lib/geo');
require('dotenv').config();
const openweathermapApiKey = process.env.OWM_API_KEY

async function updateWeatherInfo() {
    const zip_codes = await getAllZipCodes()
    // console.log(`==== zip_codes: `, zip_codes)
    zip_codes.forEach(async (zip) => {
        await getCurrentWeather(zip.zip_code)
        await getWeatherForecast(zip.zip_code)
        await getCurrentAqi(zip.zip_code)
        await getAqiForecast(zip.zip_code)
    });
}
exports.updateWeatherInfo = updateWeatherInfo

async function getCurrentWeather(zip_code) {
    const currentTime = Date.now()
    const lastReading = await getLatestWeatherReadingByZip(zip_code)

    // check if 15 minutes have passed since last reading
    if (lastReading && ((lastReading.dt * 1000) + 900000) > currentTime) {
        console.log(`==== last weather reading for ${zip_code} happened less than 15 minutes ago, re-using`)
        return {code: 200, content: lastReading}
    } else {
        console.log(`==== last weather reading for ${zip_code} happened more than 15 minutes ago, calling API`)

        const geo = await geoLocation(zip_code, `US`)
        if(geo.cod) {
            return {code: geo.cod, content: geo.message}
        }

        try {
            let currentWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
            currentWeather = await currentWeather.json()

            await insertWeatherReadingByZip(zip_code, currentWeather)

            return {code: 200, content: currentWeather}
        } catch(e) {
            throw(e)
        }
        // console.log(`==== insertWeatherReading result: `, result)

    }
}
exports.getCurrentWeather = getCurrentWeather

async function getWeatherForecast(zip_code) {
    const currentTime = Date.now()
    const lastForecast = await getFiveThreeForecastByZip(zip_code)

    // check if 30 minutes have passed since forecast was updated
    if (lastForecast && ((lastForecast.dt + 1800000) > currentTime)) {
        console.log(`==== weather forecast for ${zip_code} retrieved less than 30 minutes ago, re-using`)
        // res.status(200).send(lastForecast.forecast)
        return {code: 200, content: lastForecast.forecast}
    } else {
        console.log(`==== weather forecast for ${zip_code} retrieved more than 30 minutes ago, calling API`)

        const geo = await geoLocation(zip_code, `US`)
        if(geo.cod) {
            // res.status(geo.cod).send(geo.message)
            return {code: geo.cod, content: geo.message}
        }

        try {
            let fiveDayWeather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=imperial&appid=${openweathermapApiKey}`)
            fiveDayWeather = await fiveDayWeather.json()
    
            await updateFiveThreeForecastByZip(zip_code, fiveDayWeather)

            return {code: 200, content: fiveDayWeather}
        } catch (e) {
            throw(e)
        }
        // console.log(`==== updateFiveThreeForecastByZip: `, result)

        // res.status(200).send(fiveDayWeather)
    }
}
exports.getWeatherForecast = getWeatherForecast

async function getCurrentAqi(zip_code) {
    const currentTime = Date.now()
    const lastReading = await getLatestAqiReadingByZip(zip_code)

    // check if 15 minutes have passed since last reading
    if (lastReading && (!lastReading.cod) && ((lastReading.list[0].dt * 1000) + 900000) > currentTime) {
        console.log(`==== last aqi reading for ${zip_code} happened less than 15 minutes ago, re-using`)
        return {code: 200, content: lastReading}
    } else {
        console.log(`==== last aqi reading for ${zip_code} happened more than 15 minutes ago, calling API`)

        const geo = await geoLocation(zip_code, `US`)
        if(geo.cod) {
            return {code: geo.cod, content: geo.message}
        }
        try {
            let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${geo.lat}&lon=${geo.lon}&appid=${openweathermapApiKey}`)
            response = await response.json()
            await insertAqiReadingByZip(zip_code, response)

            return {code: 200, content: response}
        } catch (e) {
            throw(e)
        }
        // console.log(`==== insertWeatherReading result: `, result)
    
    }
}
exports.getCurrentAqi = getCurrentAqi

async function getAqiForecast(zip_code) {
    const currentTime = Date.now()
    const lastForecast = await getAqiForecastByZip(zip_code)

    // check if 30 minutes have passed since forecast was updated
    if (lastForecast && ((lastForecast.dt + 1800000) > currentTime)) {
        console.log(`==== aqi forecast for ${zip_code} retrieved less than 30 minutes ago, re-using`)
        return {code: 200, content: lastForecast.forecast}
    } else {
        console.log(`==== aqi forecast for ${zip_code} retrieved more than 30 minutes ago, calling API`)
        const geo = await geoLocation(zip_code, `US`)
        if(geo.cod) {
            return {code: geo.cod, content: geo.message}
        }

        try {
            let response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${geo.lat}&lon=${geo.lon}&appid=${openweathermapApiKey}`)
            response = await response.json()
    
            await updateAqiForecastByZip(zip_code, response)

            return {code: 200, content: response}
        } catch (e) {
            throw(e)
        }
        // console.log(`==== updateFiveThreeForecastByZip: `, result)
    }
}
exports.getAqiForecast = getAqiForecast