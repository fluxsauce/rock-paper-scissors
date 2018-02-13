const express = require('express');
const Player = require('../../../lib/Player');
const isEmpty = require('lodash/isEmpty');

const router = new express.Router();

router.route('/')
  .post((request, response) => {
    new Player({})
      .create()
      .then(result => response.send(result));
  });

router.param('player_id', (request, response, next, id) => {
  new Player({ id })
    .get()
    .then((result) => {
      request.player = result;
      next();
    });
});

router.route('/:player_id')
  .get((request, response) => {
    if (isEmpty(request.player)) {
      return response.sendStatus(404);
    }
    return response.json(request.player);
  });

module.exports = router;
