const router = require('express').Router();
const users = require('../data/users.json')

// Creates new user
router.post('/', async function (req, res, next) {
    res.status(201).send({
        userid: "user123"
    });
});

// Returns all the users
// Requres admin auth
router.get('/', async function (req, res, next) {
    res.status(200).send({
        users: users
    });
});

// Returns requested user details
// Requires auth from requested user or admin
router.get('/:userid', async function (req, res, next) {
    res.status(200).send(users[0])
})

// Returns login token if username/email and password match
router.post('/login', async function (req, res) {
    res.status(200).send({
        userid: "user123",
        token: "token123"
    });
});

// Deletes user
// Requires admin auth
router.delete('/:userid', async function (req, res, next) {
    res.status(204).end();
});

exports.router = router;