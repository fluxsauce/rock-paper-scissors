const express = require('express');
const isEmpty = require('lodash/isEmpty');
const isNull = require('lodash/isNull');
const gamesClient = require('../../lib/gamesClient');
const playersClient = require('../../lib/playersClient');
const Referee = require('../games/lib/Referee');

const referee = new Referee();
const router = new express.Router();

/**
 * Decorate a game with players, if any.
 *
 * @param {Game} game - target.
 * @returns {Promise<Game>} with property players
 */
function getPlayers(game) {
  game.players = {};
  const promises = [];
  if (!isNull(game.player1id)) {
    promises.push(playersClient.get(game.player1id).then(result => result.body));
  }
  if (!isNull(game.player2id)) {
    promises.push(playersClient.get(game.player2id).then(result => result.body));
  }
  return Promise.all(promises)
    .then((players) => {
      players.forEach((player) => {
        if (player.id) {
          game.players[player.id] = player;
        }
      });
      return game;
    });
}

router.param('game_id', (req, response, next, id) => {
  gamesClient.get(id)
    .then((result) => {
      if (result.statusCode === 404) {
        throw new Error('404');
      }
      return result.body;
    })
    .then(game => getPlayers(game))
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
    gamesClient.create(req.session.playerId)
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
        return gamesClient.update(req.game.id, body)
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
      return gamesClient.update(req.game.id, { player2id: req.session.playerId }, req.game.id)
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
    return gamesClient.judge(req.game.id)
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
    gamesClient.fetch({ state: 'pending', limit: 3, order: 'asc' }),
    gamesClient.fetch({ state: 'final', limit: 3, order: 'desc' }),
  ]).then(([pendingFetch, finalFetch]) => [
    pendingFetch.body,
    finalFetch.body,
  ]).then(([pending, final]) => Promise.all([
    Promise.all(pending.map(game => getPlayers(game))),
    Promise.all(final.map(game => getPlayers(game))),
  ])).then(([pending, final]) => response.render('index', {
    title: 'Home',
    pending,
    final,
  }))
    .catch(error => next(error)));

module.exports = router;
