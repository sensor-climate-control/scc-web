const router = require('express').Router();
const users = require('../data/users.json')

router.post('/', async function (req, res, next) {
    res.status(201).send({
        userid: "user123"
    });
});

router.get('/', async function (req, res, next) {
    res.status(200).send({
        users: users
    });
});

router.get('/:userid', async function (req, res, next) {
    res.status(200).send({
        user: users[0]
    })
})

router.post('/login', async function (req, res) {
    res.status(200).send({
        userid: "user123",
        token: "token123"
    });
});

router.delete('/:userid', async function (req, res, next) {
    res.status(204).end();
});

exports.router = router;