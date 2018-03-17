const express = require('express');
const games = require('./lib/games');
const Game = require('./lib/Game');
const isEmpty = require('lodash/isEmpty');

const router = new express.Router();

router.route('/api/v1/games')
  .get(async (request, response) => {
    const game = await games.fetch(request.query);
    response.send(game);
  })
  .post(async (request, response) => {
    const game = await games.create(new Game(request.body));
    response.send(game);
  });

router.param('game_id', async (request, response, next, id) => {
  request.game = await games.get(id);
  next();
});

router.route('/api/v1/games/:game_id')
  .get((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    return response.json(request.game);
  })
  .patch(async (request, response) => {
    if (isEmpty(request.game)) {
      return response.status(404).send();
    }
    const result = await games.update(request.game, request.body);
    return response.json(result);
  });

router.route('/api/v1/games/:game_id/judge')
  .post(async (request, response) => {
    const outcome = request.game.determineOutcome();

    if (outcome.state !== 'final') {
      return response.status(304).end();
    }

    const result = await games.update(request.game, outcome);
    return response.json(result);
  });

module.exports = router;
