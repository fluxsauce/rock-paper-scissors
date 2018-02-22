const express = require('express');

const router = new express.Router();

router.use('/v1', require('./v1'));

module.exports = router;
