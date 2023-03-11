const { ObjectId } = require('mongodb')

const { extractValidFields } = require('../lib/validation')
const { getDbReference } = require('../lib/mongo')
const { getHomeById, updateHomeById } = require('./homes')

const SensorSchema = {
    name: { required: true },
    active: {default: true },
    home: { required: true },
    location: { required: true },
    readings: { default: [] }
}
exports.SensorSchema = SensorSchema

const SensorReadingSchema = {
    date_time: { required: false },
    temp_c: { required: true },
    temp_f: { required: true },
    humidity: { required: true }
}
exports.SensorReadingSchema = SensorReadingSchema

async function insertNewSensor(sensor) {
    sensor = extractValidFields(sensor, SensorSchema)
    const db = getDbReference()
    const collection = db.collection('sensors')
    const result = await collection.insertOne(sensor)

    let home = await getHomeById(sensor.home)
    home.sensors.push(result.insertedId)
    await updateHomeById(sensor.home, home)

    return result.insertedId
}
exports.insertNewSensor = insertNewSensor

async function getSensorById(id) {
    const db = getDbReference()
    const collection = db.collection('sensors')
    const sensor = await collection.find({
        _id: id
    }).toArray()

   return sensor[0]
}
exports.getSensorById = getSensorById

async function updateSensorById(id, sensor) {
    sensor = extractValidFields(sensor, SensorSchema)
    const db = getDbReference()
    const collection = db.collection('sensors')
    const result = await collection.replaceOne(
        { _id: new ObjectId(id) },
        sensor
    )

    console.log("==== result: ", result)
    return result.matchedCount > 0;
}
exports.updateSensorById = updateSensorById

async function deleteSensorById(id, homeid) {
    const db = getDbReference()
    const collection = db.collection('sensors')
    const result = await collection.deleteOne({
        _id: id
    })

    let home = await getHomeById(homeid)
    home.sensors = home.sensors.filter(sensor => sensor !== id)
    await updateHomeById(homeid, home)

    return result.deletedCount > 0;
}
exports.deleteSensorById = deleteSensorById

