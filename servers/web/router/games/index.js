const config = require('config');
const express = require('express');
const isEmpty = require('lodash/isEmpty');
const httpClient = require('../../../../lib/httpClient');
const toInteger = require('lodash/toInteger');

const router = new express.Router();

router.param('game_id', (request, response, next, id) => {
  const options = {
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'GET',
  };
  httpClient(options, request.id)
    .then((game) => {
      game.players = {};

      if (toInteger(game.player1id) > 0) {
        const playerOptions = {
          uri: `http://localhost:${config.get('players.port')}/api/v1/players/${game.player1id}`,
          method: 'GET',
        };
        return httpClient(playerOptions, request.id)
          .then((player) => {
            game.players[game.player1id] = player;
            return game;
          });
      }
      return game;
    })
    .then((game) => {
      if (toInteger(game.player2id) > 0) {
        const playerOptions = {
          uri: `http://localhost:${config.get('players.port')}/api/v1/players/${game.player2id}`,
          method: 'GET',
        };
        return httpClient(playerOptions, request.id)
          .then((player) => {
            game.players[game.player2id] = player;
            return game;
          });
      }
      return game;
    })
    .then((game) => {
      request.game = game;
      next();
    })
    .catch(error => response.status(500).send(error.message));
});

router.route('/:game_id')
  .get((req, res) => {
    if (isEmpty(req.game)) {
      return res.sendStatus(404);
    }
    return res.render('game', {
      game: req.game,
    });
  });

module.exports = router;
