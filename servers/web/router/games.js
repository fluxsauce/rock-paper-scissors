const config = require('config');
const express = require('express');
const isEmpty = require('lodash/isEmpty');
const isNull = require('lodash/isNull');
const httpClient = require('../../../lib/httpClient');
const Referee = require('../../../lib/Referee');
const toInteger = require('lodash/toInteger');

const referee = new Referee();
const router = new express.Router();

router.param('game_id', (request, response, next, id) => {
  const options = {
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'GET',
  };
  return httpClient(options, request.id)
    .then((game) => {
      game.players = {};

      // @todo: abstract this stuff out
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
      return next();
    })
    .catch(error => response.status(500).send(error.message));
});

router.route('/')
  .post((request, response) => {
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
      method: 'POST',
      body: {
        player1id: request.session.playerId,
      },
    };
    httpClient(options, request.id)
      .then((game) => {
        response.redirect(`/games/${game.id}`);
      });
  });

router.route('/:game_id')
  .get((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    const messages = [];
    if (request.session.message) {
      messages.push(request.session.message);
      delete request.session.message;
    }
    return response.render('game', {
      viewerPlayerId: request.session.playerId,
      game: request.game,
      rules: referee.rules(),
      messages,
    });
  });

router.route('/:game_id/choice')
  .post((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    if (request.body.choice) {
      const body = {};

      // Determine which player you are.
      // @todo do this in a less horrible way
      if (request.session.playerId === request.game.player1id) {
        body.player1choice = request.body.choice;
      } else if (request.session.playerId === request.game.player2id) {
        body.player2choice = request.body.choice;
      }

      if (!isEmpty(body)) {
        const options = {
          uri: `http://localhost:${config.get('games.port')}/api/v1/games/${request.game.id}`,
          method: 'PATCH',
          body,
        };
        return httpClient(options, request.id)
          .then((game) => {
            if (game.state === 'pending' && game.player1choice !== null && game.player2choice !== null) {
              return response.redirect(307, `/games/${game.id}/judge`);
            }
            return response.redirect(`/games/${game.id}`);
          });
      }
      return response.status(400).send('what');
    }
    return response.status(500).send('nope');
  });

router.route('/:game_id/join')
  .post((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    if (isNull(request.game.player2id)) {
      const options = {
        uri: `http://localhost:${config.get('games.port')}/api/v1/games/${request.game.id}`,
        method: 'PATCH',
        body: {
          player2id: request.session.playerId,
        },
      };
      return httpClient(options, request.id)
        .then((game) => {
          response.redirect(`/games/${game.id}`);
        });
    }
    return response.sendStatus(500);
  });

router.route('/:game_id/judge')
  .post((request, response) => {
    if (isEmpty(request.game)) {
      return response.sendStatus(404);
    }
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${request.game.id}/judge`,
      method: 'POST',
    };
    return httpClient(options, request.id)
      .then((game) => {
        if (isNull(game.playerWinnerId) && game.state === 'final') {
          request.session.message = { level: 'warning', body: 'You have tied.' };
        } else if (game.playerWinnerId === request.session.playerId) {
          request.session.message = { level: 'success', body: 'You have succeeded.' };
        } else {
          request.session.message = { level: 'danger', body: 'You were defeated.' };
        }

        response.redirect(`/games/${game.id}`);
      });
  });

module.exports = router;
