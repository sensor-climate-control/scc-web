const router = require('express').Router();

router.use('/users', require('./users').router);
router.use('/weather', require('./weather').router);

module.exports = router