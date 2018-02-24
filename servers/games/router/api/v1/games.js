const express = require('express');
const games = require('../../../../../lib/games');
const Game = require('../../../../../lib/Game');
const isEmpty = require('lodash/isEmpty');

const router = new express.Router();

router.route('/')
  .get((request, response) => {
    games.fetch(request.body)
      .then(result => response.send(result))
      .catch(error => response.status(500).send({ error: error.message }));
  })
  .post((request, response) => {
    games.create(new Game(request.body))
      .then(result => response.send(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

router.param('game_id', (request, response, next, id) => {
  games.get(id)
    .then((result) => {
      request.game = result;
      next();
    });
});

router.route('/:game_id')
  .get((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    return response.json(request.game);
  })
  .patch((request, response) => {
    if (isEmpty(request.game)) {
      return response.status(404).send();
    }
    return games.update(request.game, request.body)
      .then(result => response.json(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

router.route('/:game_id/judge')
  .post((request, response) => {
    if (isEmpty(request.game)) {
      return response.status(404).send();
    }

    const outcome = request.game.determineOutcome();

    if (outcome.playerWinnerId === request.game.playerWinnerId) {
      return response.status(304).end();
    }

    return games.update(request.game, outcome)
      .then(result => response.json(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

module.exports = router;
