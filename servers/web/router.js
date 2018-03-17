const config = require('config');
const express = require('express');
const isNull = require('lodash/isNull');
const gamesClient = require('../../lib/gamesClient')(config);
const playersClient = require('../../lib/playersClient')(config);
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

router.param('game_id', async (request, response, next, id) => {
  const result = await gamesClient.get(id);
  request.game = await getPlayers(result.body);
  next();
});

router.route('/games')
  .post((request, response) => gamesClient.create(request.session.playerId)
    .then(result => response.redirect(`/games/${result.body.id}`)));

router.route('/games/:game_id')
  .get((request, response) => {
    const messages = [];
    if (request.session.message) {
      messages.push(request.session.message);
      delete request.session.message;
    }

    return response.render('game', {
      title: `Game #${request.game.id}`,
      viewerPlayerId: request.session.playerId,
      game: request.game,
      rules: referee.rules(),
      messages,
    });
  });

router.route('/games/:game_id/choice')
  .post(async (request, response) => {
    const body = {};

    // Determine which player you are.
    if (request.session.playerId === request.game.player1id) {
      body.player1choice = request.body.choice;
    } else if (request.session.playerId === request.game.player2id) {
      body.player2choice = request.body.choice;
    }

    const result = await gamesClient.update(request.game.id, body);
    if (result.body.state === 'pending' && result.body.player1choice !== null && result.body.player2choice !== null) {
      return response.redirect(307, `/games/${result.body.id}/judge`);
    }
    return response.redirect(`/games/${result.body.id}`);
  });

router.route('/games/:game_id/join')
  .post(async (request, response, next) => {
    if (isNull(request.game.player2id)) {
      const result = await gamesClient.update(request.game.id, {
        player2id: request.session.playerId,
      });
      return response.redirect(`/games/${result.body.id}`);
    }
    return next(new TypeError('Missing player2Id'));
  });

router.route('/games/:game_id/judge')
  .post(async (request, response) => {
    const result = await gamesClient.judge(request.game.id);
    const game = result.body;
    if (isNull(game.playerWinnerId) && game.state === 'final') {
      request.session.message = { level: 'warning', body: 'You have tied.' };
    } else if (game.playerWinnerId === request.session.playerId) {
      request.session.message = { level: 'success', body: 'You have succeeded.' };
    } else {
      request.session.message = { level: 'danger', body: 'You were defeated.' };
    }

    return response.redirect(`/games/${game.id}`);
  });

router.route('/')
  .get((request, response) =>
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
    })));

module.exports = router;
