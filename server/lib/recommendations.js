const { getHomeById, getAllHomes, updateHomeById } = require("../models/homes");
const { getSensorById } = require("../models/sensors");
const { getUserById } = require("../models/users");
const { sendMail } = require("./mail");
const { sendSms } = require("./sms");
// const { getLatestAqiReadingByZip, getLatestWeatherReadingByZip, getFiveThreeForecastByZip, getAqiForecastByZip } = require("../models/weather");
const { getCurrentWeather, getWeatherForecast, getCurrentAqi, getAqiForecast } = require("./weather");

async function HeatIndex(temp, humidity) {
    /* Adapted from https://github.com/mcci-catena/heat-index */
    temp = parseFloat(temp)
    humidity = parseFloat(humidity)

    if (humidity < 0 || humidity > 100 || humidity === "NaN")
        return null;

    let easyHeatIndex = 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094));

    if ((easyHeatIndex + temp) < 160.0)
            return easyHeatIndex;

    var t2 = temp * temp;         // temp squared
    var rh2 = humidity * humidity;      // humidity squared
    var tResult =
        -42.379 +
        (2.04901523 * temp) +
        (10.14333127 * humidity) +
        (-0.22475541 * temp * humidity) +
        (-0.00683783 * t2) +
        (-0.05481717 * rh2) +
        (0.00122874 * t2 * humidity) +
        (0.00085282 * temp * rh2) +
        (-0.00000199 * t2 * rh2);

    
    // console.log("==== tResult: ", tResult)
    // these adjustments come from the NWA page, and are needed to
    // match the reference table.
    var tAdjust;
    if (humidity < 13.0 && 80.0 <= temp && temp <= 112.0)
        tAdjust = -((13.0 - humidity) / 4.0) * Math.sqrt((17.0 - Math.abs(temp - 95.0)) / 17.0);
    else if (humidity > 85.0 && 80.0 <= temp && temp <= 87.0)
        tAdjust = ((humidity - 85.0) / 10.0) * ((87.0 - temp) / 5.0);
    else
        tAdjust = 0;

    // apply the adjustment
    tResult += tAdjust;

    return tResult;
}

async function get_next_aqi_prediction(aqi_forecast, current_time) {
    for(let i = 0; i < aqi_forecast.length; i++) {
        if((aqi_forecast[i].dt * 1000) - current_time > 3600000) {
            aqi_forecast[i].dt = aqi_forecast[i].dt * 1000
            return aqi_forecast[i]
        }
    }
}

async function getLatestReadings(homeid) {
    const home = await getHomeById(homeid)
    // let latest_readings = []
    if (home) {
        let latest_readings = []
        const sensors = home.sensors
        if (sensors) {
            for (let i = 0; i < sensors.length; i++) {
                const details = await getSensorById(sensors[i])
                latest_readings.push({"sensor": details._id, "reading": details.readings.pop()})
            }
        }
        return latest_readings
    } else {
        return []
    }
}

async function whatShouldYouDoWithTheWindows(homeid, previous_dt=Date.now()) {
    const home = await getHomeById(homeid)
    if(!home.preferences || !home.preferences.temperature) {
        return {}
    }
    const desired_temp = home.preferences.temperature
    const zip_code = home.zip_code

    const latest_readings = await getLatestReadings(homeid)
    if(latest_readings === []) {
        return {}
    }

    let average_humidity = 0
    let average_temp = 0
    for(let i = 0; i < latest_readings.length; i++) {
        if(!latest_readings[i].reading) {
            continue
        }
        average_humidity += latest_readings[i].reading.humidity
        average_temp += latest_readings[i].reading.temp_f
    }
    average_humidity /= latest_readings.length
    average_temp /= latest_readings.length
    const desired_heat_index = await HeatIndex(desired_temp, average_humidity)
    const current_heat_index = await HeatIndex(average_temp, average_humidity)

    const current_weather = await (await getCurrentWeather(zip_code)).content
    if(!current_weather) {
        return {}
    }
    const current_humidity = current_weather.main.humidity
    const current_temp = current_weather.main.temp
    const current_outdoor_heat_index = await HeatIndex(current_temp, current_humidity)
    const current_time = Date.now()

    const weather_forecast = await (await getWeatherForecast(zip_code)).content
    if(!weather_forecast) {
        return {}
    }

    let near_forecast = weather_forecast.list[0]
    let near_time = near_forecast.dt * 1000
    if(near_time - current_time < 3600000) {
        near_forecast = weather_forecast.list[1]
        near_time = weather_forecast.list[1].dt * 1000
    }
    const near_humidity = near_forecast.main.humidity
    const near_temp = near_forecast.main.temp
    const near_outdoor_heat_index = await HeatIndex(near_temp, near_humidity)

    const current_aqi = await (await getCurrentAqi(zip_code)).content
    if(!current_aqi) {
        return {}
    }

    const aqi_forecast = await (await getAqiForecast(zip_code)).content
    if(!aqi_forecast) {
        return {}
    }
    const next_aqi_prediction = await get_next_aqi_prediction(aqi_forecast.list, current_time)
    // console.log("==== next_aqi_prediction: ", next_aqi_prediction)

    // console.log("==== current_aqi: ", current_aqi)
    // console.log("==== desired_heat_index: ", desired_heat_index)
    // console.log("==== current_heat_index: ", current_heat_index)
    // console.log("==== current_outdoor_heat_index: ", current_outdoor_heat_index)
    // console.log("==== near_outdoor_heat_index: ", near_outdoor_heat_index)

    let recommendations = {now: null, future: null, dt: previous_dt}

    if(current_aqi.list[0].main.aqi > 2) {
        // windows should always be closed if the AQI ategory is
        // 3 (unhealthy for sensitive groups) or greater
        recommendations.now = {rec: "closed", reason: "airQuality"}
    } else if(current_heat_index > current_outdoor_heat_index && (Math.abs(current_heat_index - current_outdoor_heat_index) >= 3)) {
        if(desired_heat_index > current_heat_index) {
            // if it's warmer inside
            // and you want it to be warmer
            console.log("windows closed")
            recommendations.now = {rec: "closed", reason: "heatIndexWarm"}
        } else {
            // if it's warmer inside
            // and you want it to be cooler
            console.log("open windows w/o sun")
            recommendations.now = {rec: "open", reason: "heatIndexCool"}
        }
    } else if (Math.abs(current_heat_index - current_outdoor_heat_index) >= 3){
        if(desired_heat_index > current_heat_index) {
            // if it's warmer outside
            // and you want it to be warmer
            console.log("open windows")
            recommendations.now = {rec: "open", reason: "heatIndexWarm"}
        } else {
            // if it's warmer outside
            // and you want it to be cooler
            console.log("close windows")
            recommendations.now = {rec: "closed", reason: "heatIndexCool"}
        }
    } else {
        recommendations.now = {rec: "none", reason: "smallTempDiff"}
    }

    if(next_aqi_prediction.main.aqi > 2) {
        // windows should always be closed if the AQI ategory is
        // 3 (unhealthy for sensitive groups) or greater
        recommendations.future = {rec: "closed", reason: "airQuality", dt: next_aqi_prediction.dt}
    } else if(current_heat_index > near_outdoor_heat_index && (Math.abs(current_heat_index - near_outdoor_heat_index) >= 3)) {
        if(desired_heat_index > current_heat_index) {
            // if it's warmer inside
            // and you want it to be warmer
            console.log("windows closed")
            recommendations.future = {rec: "closed", reason: "heatIndexWarm", dt: near_time}
        } else {
            // if it's warmer inside
            // and you want it to be cooler
            console.log("open windows w/o sun")
            recommendations.future = {rec: "open", reason: "heatIndexCool", dt: near_time}
        }
    } else if (Math.abs(current_heat_index - near_outdoor_heat_index) >= 3) {
        if(desired_heat_index > current_heat_index) {
            // if it's warmer outside
            // and you want it to be warmer
            console.log("open windows")
            recommendations.future = {rec: "open", reason: "heatIndexWarm", dt: near_time}
        } else {
            // if it's warmer outside
            // and you want it to be cooler
            console.log("close windows")
            recommendations.future = {rec: "closed", reason: "heatIndexCool", dt: near_time}
        }
    } else {
        recommendations.future = {rec: "none", reason: "smallTempDiff", dt:near_time}
    }

    return recommendations
}
exports.whatShouldYouDoWithTheWindows = whatShouldYouDoWithTheWindows

async function shouldWeUpdateRecommendationsNow(recommendation, previous_recommendation) {
    if(!previous_recommendation) {
        return true
    }
    if(recommendation.now.rec !== previous_recommendation.now.rec || recommendation.now.reason !== previous_recommendation.now.reason) {
        // if the recommendation or reason has changed for the current window state recommendation
        if(recommendation.now.rec !== "none") {
            return true
        }
    }
    if(recommendation.future.rec !== previous_recommendation.future.rec || recommendation.future.reason !== previous_recommendation.future.reason) {
        // if the recommendation or reason has changed for the future window state recommendation
        if(recommendation.future.rec !== "none") {
            return true
        }
    }
    if(recommendation.dt - previous_recommendation.dt > 10800000) {
        // if more than 3 hours have elapsed since last recommendation update
        return true
    }
    if (recommendation.future.dt < Date.now() + 3600000) {
        // if future rec time is less than an hour from now
        return true
    }
    return false
}
exports.shouldWeUpdateRecommendationsNow = shouldWeUpdateRecommendationsNow

async function sendNotification(home, recommendation) {
    // const degreeSymbol = String.fromCharCode(176)
    console.log("=============== sending notification =============")
    const recommendationContent = {
        heatIndexWarm: `To help warm your home to ${home.preferences.temperature}F, you should `,
        heatIndexCool: `To help cool your home to ${home.preferences.temperature}F, you should `,
        airQuality: "Due to poor air quality, you should ",
        smallTempDiff: "The indoor/outdoor temperature difference is small, so you can ",
        closed: "close your windows.",
        open: "open your windows.",
        none: "leave your windows as they are."
    }
    const futureTime = Math.ceil((recommendation.future.dt - Date.now()) / 3600000)
    let recommendationText = recommendationContent[recommendation.now.reason] + recommendationContent[recommendation.now.rec] + `\n\nBased on the weather forecast, in ${futureTime} hours: ` + recommendationContent[recommendation.future.reason] + recommendationContent[recommendation.future.rec]
    let smsRecommendationText = recommendationContent[recommendation.now.reason] + recommendationContent[recommendation.now.rec] + `\n\nIn ${futureTime} hours: ` + recommendationContent[recommendation.future.reason] + recommendationContent[recommendation.future.rec]

    let notificationInfo = []
    for(const userid of home.users) {
        const user = await getUserById(userid)
        let userNotificationInfo = []
        if(user.preferences && user.preferences.notifications) {
            if(user.preferences.notifications.phone) {
                //send sms
                console.log(`==== sending sms notification to ${user.phone}`)
                const info = await sendSms(user.phone, smsRecommendationText)
                userNotificationInfo.push({ sms: info })
            } 
            if(user.preferences.notifications.email) {
                console.log(`==== sending email notification to ${user.email}`)
                const info = await sendMail(user.email, "SCC-Web window recommendation", recommendationText)
                userNotificationInfo.push({ email: info })
            }
        }
        notificationInfo.push({user: userid, info: userNotificationInfo})
    }
    return notificationInfo
}
exports.sendNotification = sendNotification

async function checkForRecommendationUpdates() {
    let homes = await getAllHomes()

    for(const home of homes) {
        let new_rec = await whatShouldYouDoWithTheWindows(home._id)

        if(new_rec && new_rec.dt) {
            const updateRec = await shouldWeUpdateRecommendationsNow(new_rec, home.recommendations)
            console.log(`==== updateRec for ${home._id}: `, updateRec)
            if(updateRec) {
                let newHome = home
                newHome.recommendations = new_rec
                const result = await updateHomeById(home._id, newHome)
                console.log("==== recUpdateResult: ", result)
                await sendNotification(home, new_rec)
            }
        } else {
            console.log(`==== unable to create a proper recommendation for ${home._id}`)
        }
    }

    return
}
exports.checkForRecommendationUpdates = checkForRecommendationUpdates