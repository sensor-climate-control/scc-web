const router = require('express').Router();
// const users = require('../data/users.json')
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const { UserSchema, insertNewUser, getAllUsers, getUserById, updateUserById, deleteUserById } = require('../models/users')

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
        res.status(200).send(user)
    } else {
        next();
    }
});

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

// // Returns login token if username/email and password match
// router.post('/login', async function (req, res) {
//     res.status(200).send({
//         userid: "user123",
//         token: "token123"
//     });
// });

exports.router = router;