const router = require('express').Router();
const homes = require('../data/homes.json')
const sensors = require('../data/sensors.json')

// Creates new home
// Requires authentication
router.post('/', async function (req, res, next) {
    res.status(201).send({
        homeid: homes[0].name
    })
})

// Fetches all homes
// Requires admin auth
router.get('/', async function (req, res, next) {
    res.status(200).send(homes)
})

// Fetches specified home
// Requires admin or home member auth
router.get('/:homeid', async function (req, res, next) {
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