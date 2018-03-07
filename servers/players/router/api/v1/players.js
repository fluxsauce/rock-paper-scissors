const express = require('express');
const Player = require('../../../../../lib/Player');
const players = require('../../../lib/players');
const isEmpty = require('lodash/isEmpty');

const router = new express.Router();

router.route('/')
  .post((request, response) => {
    const player = new Player(request.body);
    players.create(player)
      .then(result => response.send(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

router.param('player_id', (request, response, next, id) => {
  players.get(id)
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
