const config = require('config');
const express = require('express');
const logger = require('../../lib/logger');
const request = require('request');
const isEmpty = require('lodash/isEmpty');
const isNull = require('lodash/isNull');
const httpClient = require('../../lib/httpClient');
const gamesClient = require('../../clients/games')(config);
const playersClient = require('../../clients/players')(config);
const Referee = require('../../lib/Referee');

const referee = new Referee();
const router = new express.Router();

function getPlayer(game, playerId, requestId) {
  if (playerId > 0) {
    return playersClient.get(playerId, requestId)
      .then((player) => {
        game.players[playerId] = player;
        return game;
      });
  }
  return game;
}

router.param('game_id', (req, response, next, id) => {
  gamesClient.get(id, req.id)
    .then((game) => {
      game.players = {};
      return game;
    })
    .then(game => getPlayer(game, game.player1id, req.id))
    .then(game => getPlayer(game, game.player2id, req.id))
    .then((game) => {
      req.game = game;
      next();
      return game;
    })
    .catch((error) => {
      logger.error(error);
      return response.status(500).send(error.message);
    });
});

router.route('/games')
  .post((req, response) => {
    gamesClient.create(req.session.playerId, req.id)
      .then(game => response.redirect(`/games/${game.id}`))
      .catch(error => response.status(500).send(error.message));
  });

router.route('/games/:game_id')
  .get((req, response) => {
    if (isEmpty(req.game)) {
      return response.sendStatus(404);
    }

    const messages = [];
    if (req.session.message) {
      messages.push(req.session.message);
      delete req.session.message;
    }

    return response.render('game', {
      title: `Game #${req.game.id}`,
      viewerPlayerId: req.session.playerId,
      game: req.game,
      rules: referee.rules(),
      messages,
    });
  });

router.route('/games/:game_id/choice')
  .post((req, response) => {
    if (isEmpty(req.game)) {
      return response.sendStatus(404);
    }
    if (req.body.choice) {
      const body = {};

      // Determine which player you are.
      // @todo do this in a less horrible way
      if (req.session.playerId === req.game.player1id) {
        body.player1choice = req.body.choice;
      } else if (req.session.playerId === req.game.player2id) {
        body.player2choice = req.body.choice;
      }

      if (!isEmpty(body)) {
        return gamesClient.update(req.game.id, body, req.id)
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
  .post((req, response) => {
    if (isEmpty(req.game)) {
      return response.sendStatus(404);
    }
    if (isNull(req.game.player2id)) {
      const options = {
        uri: `http://localhost:${config.get('games.port')}/api/v1/games/${req.game.id}`,
        method: 'PATCH',
        body: {
          player2id: req.session.playerId,
        },
      };
      return httpClient(options, req.id)
        .then(game => response.redirect(`/games/${game.id}`))
        .catch(error => response.status(500).send(error.message));
    }
    return response.sendStatus(500);
  });

router.route('/games/:game_id/judge')
  .post((req, response) => {
    if (isEmpty(req.game)) {
      return response.sendStatus(404);
    }
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${req.game.id}/judge`,
      method: 'POST',
    };
    return httpClient(options, req.id)
      .then((game) => {
        if (isNull(game.playerWinnerId) && game.state === 'final') {
          req.session.message = { level: 'warning', body: 'You have tied.' };
        } else if (game.playerWinnerId === req.session.playerId) {
          req.session.message = { level: 'success', body: 'You have succeeded.' };
        } else {
          req.session.message = { level: 'danger', body: 'You were defeated.' };
        }

        return response.redirect(`/games/${game.id}`);
      }).catch(error => response.status(500).send(error.message));
  });

router.get('/', (req, response) => {
  const options = {
    method: 'GET',
    headers: {
      'X-Request-Id': req.id,
    },
  };
  request(`http://localhost:${config.get('games.port')}/api/v1/games`, options, (error, res, body) => {
    try {
      const games = JSON.parse(body);
      response.render('index', {
        title: 'Home',
        games,
      });
    } catch (e) {
      response.status(500).send(error.message);
    }
  });
});

module.exports = router;
