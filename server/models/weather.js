const { getDbReference } = require("../lib/mongo")


const WeatherSchema = {
    zip_code: { required: true },
    weather_readings: { default: [] },
    aqi_readings: { default: [] },
    weather_forecast: { default: {} },
    aqi_forecast: { default: {} }
}
exports.WeatherSchema = WeatherSchema

async function initializeWeatherByZip(zip_code) {
    const weather = {
        zip_code: zip_code,
        weather_readings: [],
        aqi_readings: [],
    }
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.insertOne(weather)
    return result.insertedId
}

async function getWeatherReadingsByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    
    return result[0].weather_readings
}
exports.getWeatherReadingsByZip = getWeatherReadingsByZip

async function getAqiReadingsByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    
    return result[0].aqi_readings
}
exports.getAqiReadingsByZip = getAqiReadingsByZip

async function getLatestWeatherReadingByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if (result) {
        const latestReading = result.weather_readings.pop()
        return latestReading
    } else {
        return null
    }
}
exports.getLatestWeatherReadingByZip = getLatestWeatherReadingByZip

async function getLatestAqiReadingByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if (result) {
        const latestReading = result.aqi_readings.pop()
        return latestReading
    } else {
        return null
    }
}
exports.getLatestAqiReadingByZip = getLatestAqiReadingByZip

async function insertWeatherReadingByZip(zip_code, reading) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if(!result) {
        initializeWeatherByZip(zip_code)
    } else if (!result.weather_readings) {
        result.weather_readings = []
    }
    result.weather_readings.push(reading)
    
    const replaceResult = await collection.replaceOne(
        { zip_code: zip_code },
        result
    )
    return replaceResult.matchedCount > 0;
}
exports.insertWeatherReadingByZip = insertWeatherReadingByZip

async function insertAqiReadingByZip(zip_code, reading) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if(!result) {
        initializeWeatherByZip(zip_code)
    } else if (!result.aqi_readings) {
        result.aqi_readings = []
    }
    result.aqi_readings.push(reading)
    
    const replaceResult = await collection.replaceOne(
        { zip_code: zip_code },
        result
    )
    return replaceResult.matchedCount > 0;
}
exports.insertAqiReadingByZip = insertAqiReadingByZip

async function getFiveThreeForecastByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if (result) {
        return result.weather_forecast
    } else {
        return null
    }
}
exports.getFiveThreeForecastByZip = getFiveThreeForecastByZip

async function getAqiForecastByZip(zip_code) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if (result) {
        return result.aqi_forecast
    } else {
        return null
    }
}
exports.getAqiForecastByZip = getAqiForecastByZip

async function updateFiveThreeForecastByZip(zip_code, forecast) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if(!result) {
        initializeWeatherByZip(zip_code)
    }
    result.weather_forecast = {forecast: forecast, dt: Date.now()}
    
    const replaceResult = await collection.replaceOne(
        { zip_code: zip_code },
        result
    )
    return replaceResult.matchedCount > 0;
}
exports.updateFiveThreeForecastByZip = updateFiveThreeForecastByZip

async function updateAqiForecastByZip(zip_code, forecast) {
    const db = getDbReference()
    const collection = db.collection('weather')
    let result = await collection.find({
        zip_code: zip_code
    }).toArray()
    result = result[0]

    if(!result) {
        initializeWeatherByZip(zip_code)
    }
    result.aqi_forecast = {forecast: forecast, dt: Date.now()}
    
    const replaceResult = await collection.replaceOne(
        { zip_code: zip_code },
        result
    )
    return replaceResult.matchedCount > 0;
}
exports.updateAqiForecastByZip = updateAqiForecastByZip