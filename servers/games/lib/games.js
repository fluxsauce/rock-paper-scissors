const config = require('config');
const knex = require('../../../lib/knex')(config);
const merge = require('lodash/merge');
const Game = require('./Game');
const validation = require('../../../lib/validation');

/**
 * Fetch games.
 *
 * @param {Object} criteria - criteria for filtering results.
 * @returns {Promise<*>} Database result.
 */
function fetch(criteria) {
  const query = knex.select().from('games');
  if (criteria.state) {
    query.where('state', criteria.state);
  }
  if (criteria.limit) {
    query.limit(criteria.limit);
  }
  if (criteria.order) {
    query.orderBy('id', criteria.order);
  }
  return query;
}

/**
 * Create a game.
 *
 * @param {Object} raw - game to be created.
 * @returns {Promise<Game>} Game populated with an id.
 */
function create(raw) {
  let game;

  return validation.Game.validate(raw)
    .then((validated) => {
      game = validated;

      return knex
        .insert(game)
        .into('games');
    })
    .then((result) => {
      game.id = result.pop();
      return new Game(game);
    });
}

/**
 * Get a game by ID.
 *
 * @param {integer} id - target identifier.
 * @returns {Promise<Game>} Database result.
 */
function get(id) {
  return knex.select().from('games')
    .where({ id })
    .select()
    .then((result) => {
      if (result.length > 0) {
        return new Game(result.pop());
      }
      return null;
    });
}

/**
 * Update a game.
 *
 * @param {Game} original - the game to be updated.
 * @param {Object} raw - fields to update.
 * @returns {Promise<*>} Database result.
 */
function update(original, raw) {
  let game = merge(original, raw);
  game.lastUpdated = new Date();

  return validation.Game.validate(game)
    .then((validated) => {
      game = validated;

      return knex.update(game).from('games')
        .where({ id: game.id });
    })
    .then(() => new Game(game));
}

module.exports = {
  fetch,
  create,
  get,
  update,
};
