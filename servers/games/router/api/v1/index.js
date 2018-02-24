const express = require('express');

const router = new express.Router();

router.use('/games', require('./games'));

module.exports = router;
