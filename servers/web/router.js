const config = require('config');
const express = require('express');
const request = require('request');
const isEmpty = require('lodash/isEmpty');
const isNull = require('lodash/isNull');
const httpClient = require('../../lib/httpClient');
const Referee = require('../../lib/Referee');
const toInteger = require('lodash/toInteger');

const referee = new Referee();
const router = new express.Router();

router.param('game_id', (res, response, next, id) => {
  const options = {
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'GET',
  };
  return httpClient(options, res.id)
    .then((game) => {
      game.players = {};

      // @todo: abstract this stuff out
      if (toInteger(game.player1id) > 0) {
        const playerOptions = {
          uri: `http://localhost:${config.get('players.port')}/api/v1/players/${game.player1id}`,
          method: 'GET',
        };
        return httpClient(playerOptions, res.id)
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
        return httpClient(playerOptions, res.id)
          .then((player) => {
            game.players[game.player2id] = player;
            return game;
          });
      }
      return game;
    })
    .then((game) => {
      res.game = game;
      return next();
    })
    .catch(error => response.status(500).send(error.message));
});

router.route('/')
  .post((res, response) => {
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
      method: 'POST',
      body: {
        player1id: res.session.playerId,
      },
    };
    httpClient(options, res.id)
      .then((game) => {
        response.redirect(`/games/${game.id}`);
      });
  });

router.route('/games/:game_id')
  .get((res, response) => {
    if (isEmpty(res.game)) {
      return response.sendStatus(404);
    }
    const messages = [];
    if (res.session.message) {
      messages.push(res.session.message);
      delete res.session.message;
    }
    return response.render('game', {
      viewerPlayerId: res.session.playerId,
      game: res.game,
      rules: referee.rules(),
      messages,
    });
  });

router.route('/games/:game_id/choice')
  .post((res, response) => {
    if (isEmpty(res.game)) {
      return response.sendStatus(404);
    }
    if (res.body.choice) {
      const body = {};

      // Determine which player you are.
      // @todo do this in a less horrible way
      if (res.session.playerId === res.game.player1id) {
        body.player1choice = res.body.choice;
      } else if (res.session.playerId === res.game.player2id) {
        body.player2choice = res.body.choice;
      }

      if (!isEmpty(body)) {
        const options = {
          uri: `http://localhost:${config.get('games.port')}/api/v1/games/${res.game.id}`,
          method: 'PATCH',
          body,
        };
        return httpClient(options, res.id)
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

router.route('/games/:game_id/join')
  .post((res, response) => {
    if (isEmpty(res.game)) {
      return response.sendStatus(404);
    }
    if (isNull(res.game.player2id)) {
      const options = {
        uri: `http://localhost:${config.get('games.port')}/api/v1/games/${res.game.id}`,
        method: 'PATCH',
        body: {
          player2id: res.session.playerId,
        },
      };
      return httpClient(options, res.id)
        .then((game) => {
          response.redirect(`/games/${game.id}`);
        });
    }
    return response.sendStatus(500);
  });

router.route('/games/:game_id/judge')
  .post((res, response) => {
    if (isEmpty(res.game)) {
      return response.sendStatus(404);
    }
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${res.game.id}/judge`,
      method: 'POST',
    };
    return httpClient(options, res.id)
      .then((game) => {
        if (isNull(game.playerWinnerId) && game.state === 'final') {
          res.session.message = { level: 'warning', body: 'You have tied.' };
        } else if (game.playerWinnerId === res.session.playerId) {
          res.session.message = { level: 'success', body: 'You have succeeded.' };
        } else {
          res.session.message = { level: 'danger', body: 'You were defeated.' };
        }

        response.redirect(`/games/${game.id}`);
      });
  });

router.get('/', (req, res) => {
  const options = {
    method: 'GET',
    headers: {
      'X-Request-Id': req.id,
    },
  };
  request(`http://localhost:${config.get('games.port')}/api/v1/games`, options, (error, response, body) => {
    try {
      const games = JSON.parse(body);
      res.render('index', {
        games,
      });
    } catch (e) {
      res.status(500).send(error.message);
    }
  });
});

module.exports = router;
