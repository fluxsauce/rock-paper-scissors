const config = require('config');
const express = require('express');
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
      .then((result) => {
        game.players[playerId] = result.body;
        return game;
      });
  }
  return game;
}

router.param('game_id', (req, response, next, id) => {
  gamesClient.get(id, req.id)
    .then((result) => {
      if (result.statusCode === 404) {
        throw new Error('404');
      }
      const game = result.body;
      game.players = {};
      return game;
    })
    .then(game => getPlayer(game, game.player1id, req.id))
    .then(game => getPlayer(game, game.player2id, req.id))
    .then((game) => {
      req.game = game;
      return next();
    })
    .catch((error) => {
      if (error.message === '404') {
        return response.status(404).render('404', {
          title: '404',
        });
      }
      return next(error);
    });
});

router.route('/games')
  .post((req, response, next) => {
    gamesClient.create(req.session.playerId, req.id)
      .then(result => response.redirect(`/games/${result.body.id}`))
      .catch(error => next(error));
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
          .then((result) => {
            if (result.body.state === 'pending' && result.body.player1choice !== null && result.body.player2choice !== null) {
              return response.redirect(307, `/games/${result.body.id}/judge`);
            }
            return response.redirect(`/games/${result.body.id}`);
          });
      }
      return response.status(400).send('what');
    }
    return response.status(500).send('nope');
  });

router.route('/games/:game_id/join')
  .post((req, response, next) => {
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
        .then(result => response.redirect(`/games/${result.body.id}`))
        .catch(error => next(error));
    }
    return next(new TypeError('Missing player2Id'));
  });

router.route('/games/:game_id/judge')
  .post((req, response, next) => {
    if (isEmpty(req.game)) {
      return response.sendStatus(404);
    }
    const options = {
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${req.game.id}/judge`,
      method: 'POST',
    };
    return httpClient(options, req.id)
      .then((result) => {
        const game = result.body;
        if (isNull(game.playerWinnerId) && game.state === 'final') {
          req.session.message = { level: 'warning', body: 'You have tied.' };
        } else if (game.playerWinnerId === req.session.playerId) {
          req.session.message = { level: 'success', body: 'You have succeeded.' };
        } else {
          req.session.message = { level: 'danger', body: 'You were defeated.' };
        }

        return response.redirect(`/games/${game.id}`);
      })
      .catch(error => next(error));
  });

router.get('/', (req, response, next) =>
  Promise.all([
    gamesClient.fetch({ state: 'pending', limit: 3, order: 'asc' }, req.id),
    gamesClient.fetch({ state: 'final', limit: 3, order: 'desc' }, req.id),
  ]).then(([pending, final]) => response.render('index', {
    title: 'Home',
    pending: pending.body,
    final: final.body,
  })).catch(error => next(error)));

module.exports = router;
