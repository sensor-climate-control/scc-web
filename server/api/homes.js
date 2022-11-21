const router = require('express').Router();
const homes = require('../data/homes.json')
const sensors = require('../data/sensors.json');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { HomeSchema, insertNewHome, getAllHomes, getHomeById, deleteHomeById, updateHomeById } = require('../models/homes');

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
                error: "Error inserting business into DB. Please try again later."
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
        console.log("=== good input")
        const home = extractValidFields(req.body, HomeSchema)
        const successfulUpdate = await updateHomeById(homeid, home)
        console.log("==== successfulUpdate: ", successfulUpdate)
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
    res.status(200).send(homes[0].sensors)
})

// Adds new sensor to home
// Requires admin or home admin auth
router.post('/:homeid/sensors', async function (req, res, next) {
    res.status(201).send({
        sensorid: "sensor1234"
    })
})

// Fetches info for single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid', async function (req, res, next) {
    res.status(200).send(sensors[0])
})

// Updates info for single sensor
// Requires admin or home admin auth
router.put('/:homeid/sensors/:sensorid', async function (req, res, next) {
    res.status(200).send(sensors[0])
})

// Deletes sensor
// Requires admin or home admin auth
router.delete('/:homeid/sensors/:sensorid', async function (req, res, next) {
    res.status(204).send()
})

// Fetches readings from single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid/readings', async function (req, res, next) {
    res.status(200).send(sensors[0].readings)
})

// Adds readings from single sensor
// Requires admin or home member auth
// Optional: API key
router.post('/:homeid/sensors/:sensorid/readings', async function (req, res, next) {
    res.status(200).send({
        "readings_added": sensors[0].readings
    })
})

exports.router = router;