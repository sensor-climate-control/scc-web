require('dotenv').config();

const apiKey = process.env.OWM_API_KEY

async function geoLocation(zipCode, countryCode) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`)
        return response.json()
    } catch (e) {
        throw(new Error(e))
    }
}
exports.geoLocation = geoLocation
