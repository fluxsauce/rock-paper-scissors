const express = require('express');

const router = new express.Router();

router.use('/api', require('./api'));

module.exports = router;
