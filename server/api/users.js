const router = require('express').Router();
const bcrypt = require('bcryptjs')
const { generateAuthToken, requireAuthentication, getTokenExpiration } = require('../lib/auth')
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { UserSchema, insertNewUser, getAllUsers, getUserById, deleteUserById, updateUserById, getUserByEmail, addApiKey, getUserApiKeysById, removeApiKey, ApiKeySchema } = require('../models/users');


// Creates new user
router.post('/', async function (req, res, next) {
    if (validateAgainstSchema(req.body, UserSchema)) {
        try {
            const id = await insertNewUser(req.body)
            console.log("==== new user id: ", id)
            res.status(201).send({
                id: id
            })
        } catch (err) {
            console.error(err)
            res.status(500).send({
                error: "Error inserting user into DB. Please try again later."
            })
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid user object"
        })
    }
});

// Returns all the users
// Requres admin auth
router.get('/', async function (req, res, next) {
    const allUsers = await getAllUsers()
    res.status(200).send(allUsers)
});

// Returns requested user details
// Requires auth from requested user or admin
router.get('/:userid', async function (req, res, next) {
    const userid = req.params.userid
    const user = await getUserById(userid)
    if (user) {
        console.log("==== user: ", user)
        res.status(200).send(user)
    } else {
        next();
    }
});

// Creates a persistent auth token for a user, with custom duration
// Requires auth from requested user or admin
router.post('/:userid/tokens', requireAuthentication, async function (req, res) {
    const userid = req.params.userid
    const user = await getUserById(userid, true)
    if (req.body && req.body.duration && req.body.name && user) {
        const duration = req.body.duration
        const token = generateAuthToken(user._id, duration)
        const exp = getTokenExpiration(token)
        const api_key = {
            name: req.body.name,
            token: token,
            expires: exp,
            created: Date.now()
        }
        const result = await addApiKey(user, api_key)
        if (result) {
            res.status(201).send(api_key)
        } else {
            res.status(500).send({
                error: "Error adding API key"
            })
        }
    } else {
        res.status(400).json({
            error: "userid is incorrect or request body does not contain name and duration"
        })
    }
});

// Gets all persistent auth tokens for a user
// Requires auth from requested user or admin
router.get('/:userid/tokens', requireAuthentication, async function (req, res) {
    const userid = req.params.userid
    const api_keys = await getUserApiKeysById(userid)
    console.log("==== api_keys", api_keys)

    if(api_keys) { 
        res.status(200).send(api_keys)
    } else {
        res.status(500).send({
            error: "Error getting API keys"
        })
    }
});

// Deletes a persistent auth token for a user
// Requires auth from requested user or admin
router.delete('/:userid/tokens', requireAuthentication, async function (req, res, next) {
    const userid = req.params.userid
    const user = await getUserById(userid, true)
    if ( req.body && validateAgainstSchema(req.body, ApiKeySchema)) {
        const result = await removeApiKey(user, req.body.api_key)
        if (result) {
            res.status(204).send()
        } else {
            next()
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid api key object"
        })
    }
})

// Update user details
// Requires auth from requested user or admin
router.put('/:userid', async function (req, res, next) {
    const userid = req.params.userid
    if (validateAgainstSchema(req.body, UserSchema)) {
        const user = extractValidFields(req.body, UserSchema)
        const successfulUpdate = await updateUserById(userid, user)
        
        if (successfulUpdate) {
            res.status(200).json({
                links: {
                    user: `/api/users/${userid}`
                }
            });
        } else {
            next();
        }
    } else {
        res.status(400).json({
            error: "Request body is not a valid user object"
        })
    }
});

// Add homeid to user
// Requires auth from requested user or admin
router.put('/:userid/homes', async function (req, res, next) {
    const userid = req.params.userid
    const requestBody = req.body

    if(requestBody.homeid) {
        const homeid = requestBody.homeid

        const user = await getUserById(userid, true)
        console.log("==== user: ", user)
        if(!user.homes) {
            user.homes = []
        }
        user.homes.push(homeid)
        const successfulUpdate = await updateUserById(userid, user, true)
    
        if(successfulUpdate) {
            res.status(200).json({
                links: {
                    user: `/api/users/${userid}`
                }
            })
        } else {
            next();
        }
    } else {
        res.status(400).json({
            error: "Request body does not contain a homeid"
        })
    }
})

// Deletes user
// Requires admin auth
router.delete('/:userid', async function (req, res, next) {
    const userid = req.params.userid
    const successfulDeletion = await deleteUserById(userid)
    if (successfulDeletion) {
        res.status(204).send();
    } else {
        next();
    }
});

// Returns login token if username/email and password match
router.post('/login', async function (req, res) {
    if (req.body && req.body.email && req.body.password) {
        const user = await getUserByEmail(req.body.email, true)
        const authenticated = user && await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (authenticated) {
            const token = generateAuthToken(user._id)
            res.status(200).send({
                token: token,
                userid: user._id
            })
        } else {
            res.status(401).send({
                error: "Invalid credentials"
            })
        }
    } else {
        res.status(400).send({
            error: "Request needs email and password."
        })
    }
})

exports.router = router;