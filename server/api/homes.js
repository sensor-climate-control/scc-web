const router = require('express').Router();
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { HomeSchema, insertNewHome, getAllHomes, getHomeById, deleteHomeById, updateHomeById } = require('../models/homes');
const { SensorSchema, getSensorById, insertNewSensor, updateSensorById, deleteSensorById, SensorReadingSchema } = require('../models/sensors');

// Creates new home
// Requires authentication
router.post('/', async function (req, res, next) {
    if (validateAgainstSchema(req.body, HomeSchema)) {
        try {
            const id = await insertNewHome(req.body)
            console.log("==== new home id: ", id)
            res.status(201).send({
                id: id
            })
        } catch (err) {
            console.error(err)
            res.status(500).send({
                error: "Error inserting home into DB. Please try again later."
            })
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid home object"
        })
    }
})

// Fetches all homes
// Requires admin auth
router.get('/', async function (req, res, next) {
    const allHomes = await getAllHomes()
    res.status(200).send(allHomes)
})

// Fetches specified home
// Requires admin or home member auth
router.get('/:homeid', async function (req, res, next) {
    const homeid = req.params.homeid
    const home = await getHomeById(homeid)
    if (home) {
        res.status(200).send(home)
    } else {
        next();
    }
})

// Updates specified home
// Requires admin or home admin auth
router.put('/:homeid', async function (req, res, next) {
    const homeid = req.params.homeid
    if (validateAgainstSchema(req.body, HomeSchema)) {
        const home = extractValidFields(req.body, HomeSchema)
        const successfulUpdate = await updateHomeById(homeid, home)
        
        if (successfulUpdate) {
            res.status(200).json({
                links: {
                    home: `/api/homes/${homeid}`
                }
            });
        } else {
            next();
        }
    } else {
        res.status(400).json({
            error: "Request body is not a valid home object"
        })
    }
})

// Deletes specified home
// Requires admin or home admin auth
router.delete('/:homeid', async function (req, res, next) {
    const homeid = req.params.homeid
    const successfulDeletion = await deleteHomeById(homeid)
    if (successfulDeletion) {
        res.status(204).send();
    } else {
        next();
    }
})

// Fetches all sensors for home
// Requires admin or home member auth
router.get('/:homeid/sensors', async function (req, res, next) {
    const homeid = req.params.homeid
    const home = await getHomeById(homeid)
    if (home) {
        res.status(200).send(home.sensors)
    } else {
        next();
    }
})

// Adds new sensor to home
// Requires admin or home admin auth
router.post('/:homeid/sensors', async function (req, res, next) {
    console.log("==== sensor: ", req.body)
    if (validateAgainstSchema(req.body, SensorSchema)) {
        try {
            const id = await insertNewSensor(req.body)
            res.status(201).send({
                id: id
            })
        } catch (err) {
            console.error(err)
            res.status(500).send({
                error: "Error inserting sensor into DB. Please try again later."
            })
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid sensor object"
        })
    }
})

// Fetches info for single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid', async function (req, res, next) {
    const sensorid = req.params.sensorid
    const sensor = await getSensorById(sensorid)
    if (sensor) {
        res.status(200).send(sensor)
    } else {
        next();
    }
})

// Updates info for single sensor
// Requires admin or home admin auth
router.put('/:homeid/sensors/:sensorid', async function (req, res, next) {
    const homeid = req.params.homeid
    const sensorid = req.params.sensorid
    if (validateAgainstSchema(req.body, SensorSchema)) {
            const sensor = extractValidFields(req.body, SensorSchema)
            const successfulUpdate = await updateSensorById(sensorid, sensor)
            
            if (successfulUpdate) {
                res.status(200).json({
                    links: {
                        home: `/api/homes/${homeid}/sensors/${sensorid}`
                    }
                });
            } else {
                next();
            }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid sensor object"
        })
    }
})

// Deletes sensor
// Requires admin or home admin auth
router.delete('/:homeid/sensors/:sensorid', async function (req, res, next) {
    const sensorid = req.params.sensorid
    const homeid = req.params.homeid
    const successfulDeletion = await deleteSensorById(sensorid, homeid)
    if (successfulDeletion) {
        res.status(204).send();
    } else {
        next();
    }
})

// Fetches readings from single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid/readings', async function (req, res, next) {
    const sensorid = req.params.sensorid
    const sensor = await getSensorById(sensorid)
    if (sensor) {
        res.status(200).send(sensor.readings)
    } else {
        next();
    }
})

// Adds readings from single sensor
// Requires admin or home member auth
// Optional: API key
router.put('/:homeid/sensors/:sensorid/readings', async function (req, res, next) {
    const sensorid = req.params.sensorid
    const homeid = req.params.homeid
    const readings = req.body
    const validReadings = readings.filter(reading => validateAgainstSchema(reading, SensorReadingSchema))
    if (validReadings.length > 0) {
        let sensor = await getSensorById(sensorid)
        sensor.readings.push(validReadings)

        const successfulUpdate = await updateSensorById(sensorid, sensor)
        if (successfulUpdate) {
            res.status(200).json({
                links: {
                    readings: `/api/homes/${homeid}/sensors/${sensorid}/readings`
                }
            });
        } else {
            next();
        }
    } else {
        res.status(400).json({
            error: "Request body does not contain an array of valid sensor reading objects"
        })
    }
})

exports.router = router;