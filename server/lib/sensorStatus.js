const { getAllSensors, updateSensorById } = require("../models/sensors");
const { sendNotification } = require("./recommendations");

async function checkSensorStatus() {
    const sensors = await getAllSensors()
    const current_time = Date.now()

    let sensorsNotified = []
    for(let i = 1; i < sensors.length; i++) {
        if(sensors[i].readings && sensors[i].readings.length > 0) {
            const last_reading = sensors[i].readings.pop()

            if(last_reading.date_time + 86400000 > current_time) {
                console.log(`==== sensor: ${sensors[i]._id} hasn't reported any readings for more than 24 hours`)
                if(sensors[i].active === true) {
                    console.log(`==== sensor: ${sensors[i]._id} notifying`)
                    let newSensor = sensors[i]
                    newSensor.active = false
                    const update = await updateSensorById(sensors[i]._id, newSensor)
                    const notificationString = `Sensor ${newSensor._id} (${newSensor.name}) has not reported readings for more than 24 hours, it may not be online`
                    const result = await sendNotification(sensors[i].home, notificationString, notificationString)
                    sensorsNotified.push({
                        sensor: newSensor._id,
                        update: update,
                        notificationResult: result
                    })
                }
            }
        }
    }
    return sensorsNotified
}
exports.checkSensorStatus = checkSensorStatus