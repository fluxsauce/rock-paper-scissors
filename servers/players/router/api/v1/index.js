const express = require('express');

const router = new express.Router();

router.use('/players', require('./players'));

module.exports = router;
