const router = require('express').Router();
const homes = require('../data/homes.json')
const sensors = require('../data/sensors.json');
const { validateAgainstSchema } = require('../lib/validation');
const { HomeSchema, insertNewHome, getAllHomes, getHomeById } = require('../models/homes');

// Creates new home
// Requires authentication
router.post('/', async function (req, res, next) {
    if (validateAgainstSchema(req.body, HomeSchema)) {
        try {
            const id = await insertNewHome(req.body)
            res.sendStatus(201).send({
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
    const allHomes = await getHomeById(req.query.homeid)
    res.status(200).send(homes[0])
})

// Updates specified home
// Requires admin or home admin auth
router.put('/:homeid', async function (req, res, next) {
    res.status(200).send(homes[0])
})

// Deletes specified home
// Requires admin or home admin auth
router.delete('/:homeid', async function (req, res, next) {
    res.status(204).send()
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