const router = require('express').Router();

router.use('/users', require('./users').router);

module.exports = router