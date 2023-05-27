const router = require('express').Router();
const { whatShouldYouDoWithTheWindows, sendNotification } = require('../lib/recommendations');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { requireAuthentication, authorizedToAccessHomeEndpoint } = require('../lib/auth')
const { HomeSchema, insertNewHome, getAllHomes, getHomeById, deleteHomeById, updateHomeById, WindowSchema, addWindowToHome, removeWindowFromHome } = require('../models/homes');
const { SensorSchema, getSensorById, insertNewSensor, updateSensorById, deleteSensorById, SensorReadingSchema } = require('../models/sensors');

// Creates new home
// Requires authentication
router.post('/', requireAuthentication, async function (req, res, next) {
    if (validateAgainstSchema(req.body, HomeSchema)) {
        try {
            const id = await insertNewHome(req.body)
            // console.log("==== new home id: ", id)
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
router.get('/', requireAuthentication, async function (req, res, next) {
    if(await authorizedToAccessHomeEndpoint(req.user)) {
        const allHomes = await getAllHomes()
        res.status(200).send(allHomes)
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Fetches specified home
// Requires admin or home member auth
router.get('/:homeid', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const home = await getHomeById(homeid)
        if (home) {
            res.status(200).send(home)
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

router.get('/:homeid/rec', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const result = await whatShouldYouDoWithTheWindows(homeid)
        const home = await getHomeById(homeid)
        const info = await sendNotification(home, result)
        res.status(200).send({recommendation: result, notifications: info})
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Updates specified home
// Requires admin or home admin auth
router.put('/:homeid', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
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
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Deletes specified home
// Requires admin or home admin auth
router.delete('/:homeid', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const successfulDeletion = await deleteHomeById(homeid)
        if (successfulDeletion) {
            res.status(204).send();
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Fetches all sensors for home
// Requires admin or home member auth
router.get('/:homeid/sensors', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const home = await getHomeById(homeid)
        if (home) {
            let sensorDetails = []
            const sensors = home.sensors
            if (sensors) {
                for (let i = 0; i < sensors.length; i++) {
                    const details = await getSensorById(sensors[i])
                    if(details) {
                        sensorDetails.push(details)
                    }
                }
            }
            res.status(200).send(sensorDetails)
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Adds new sensor to home
// Requires admin or home admin auth
router.post('/:homeid/sensors', requireAuthentication, async function (req, res, next) {
    if(await authorizedToAccessHomeEndpoint(req.user, req.params.homeid)) {
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
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Fetches info for single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid', requireAuthentication, async function (req, res, next) {
    if(await authorizedToAccessHomeEndpoint(req.user, req.params.homeid)) {
        const sensorid = req.params.sensorid
        const sensor = await getSensorById(sensorid)
        if (sensor) {
            res.status(200).send(sensor)
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Updates info for single sensor
// Requires admin or home admin auth
router.put('/:homeid/sensors/:sensorid', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
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
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Deletes sensor
// Requires admin or home admin auth
router.delete('/:homeid/sensors/:sensorid', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const sensorid = req.params.sensorid
        const successfulDeletion = await deleteSensorById(sensorid, homeid)
        if (successfulDeletion) {
            res.status(204).send();
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Fetches readings from single sensor
// Requires admin or home member auth
router.get('/:homeid/sensors/:sensorid/readings', requireAuthentication, async function (req, res, next) {
    if(await authorizedToAccessHomeEndpoint(req.user, req.params.homeid)) {
        const sensorid = req.params.sensorid
        const sensor = await getSensorById(sensorid)
        if (sensor) {
            res.status(200).send(sensor.readings)
        } else {
            next();
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Adds readings from single sensor
// Requires admin or home member auth
// Optional: API key
router.put('/:homeid/sensors/:sensorid/readings', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        const sensorid = req.params.sensorid
        let validReadings = []
        if (req.body && req.body.length > 0) {
            const readings = req.body
            validReadings = readings.filter(reading => validateAgainstSchema(reading, SensorReadingSchema))
            if (validReadings.length > 0) {
                let sensor = await getSensorById(sensorid)
                if (!sensor.readings) {
                    sensor.readings = []
                }

                for(const reading of validReadings) {
                    if (!reading.date_time) {
                        reading.date_time = Date.now()
                    }
                    sensor.readings.push(reading)
                }

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
        } else {
            res.status(400).json({
                error: "Request body does not contain an array of valid sensor reading objects"
            })
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to modify this resource"
        })
    }
})

// Adds new window to home
// Requires admin or home admin auth
router.post('/:homeid/windows', requireAuthentication, async function (req, res, next) {
    if(await authorizedToAccessHomeEndpoint(req.user, req.params.homeid)) {
        if (validateAgainstSchema(req.body, WindowSchema)) {
            try {
                await addWindowToHome(req.params.homeid, req.body)
                res.status(201).send({
                    result: "Successfully added window"
                })
            } catch (err) {
                console.error(err)
                res.status(500).send({
                    error: "Error adding window to home. Please try again later."
                })
            }
        } else {
            res.status(400).send({
                error: "Request body does not contain a valid window object"
            })
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

// Deletes window
// Requires admin or home admin auth
router.delete('/:homeid/windows', requireAuthentication, async function (req, res, next) {
    const homeid = req.params.homeid
    if(await authorizedToAccessHomeEndpoint(req.user, homeid)) {
        try {
            const result = await removeWindowFromHome(homeid, req.body)
            if (result) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    error: "Error removing window from home"
                })
            }
        } catch (err) {
            console.error(err)
            res.status(500).send({
                error: "Error removing window from home. Please try again later."
            })
        }
    } else {
        res.status(403).send({
            error: "You are not authorized to access this resource"
        })
    }
})

exports.router = router;
