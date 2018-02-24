const express = require('express');
const Game = require('../../../../../lib/Game');
const isEmpty = require('lodash/isEmpty');

const router = new express.Router();

router.route('/')
  .post((request, response) => {
    new Game(request.body)
      .create()
      .then(result => response.send(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

router.param('game_id', (request, response, next, id) => {
  new Game({ id })
    .get()
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
    return request.game.update(request.body)
      .then(result => response.json(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

router.route('/:game_id/judge')
  .post((request, response) => {
    if (isEmpty(request.game)) {
      return response.status(404).send();
    }
    return request.game.judge(request.id)
      .then(result => response.json(result))
      .catch(error => response.status(500).send({ error: error.message }));
  });

module.exports = router;
