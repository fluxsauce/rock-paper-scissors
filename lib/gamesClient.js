const config = require('config');
const httpClient = require('./httpClient');

/**
 * Fetch games.
 *
 * @param {Object} criteria - criteria for filtering results.
 * @returns {Promise<*>} API result.
 */
function fetch(criteria) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
    method: 'GET',
    qs: criteria,
  });
}

/**
 * Get a game by ID.
 *
 * @param {integer} id - target identifier.
 * @returns {Promise<*>} API result.
 */
function get(id) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'GET',
  });
}

/**
 * Create a game.
 *
 * @param {integer} player1id - first player ID.
 * @returns {Promise<*>} API result.
 */
function create(player1id) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
    method: 'POST',
    body: {
      player1id,
    },
  });
}

/**
 * Update a game.
 *
 * @param {integer} id - target identifier.
 * @param {object} body - fields to update.
 * @returns {Promise<*>} API result.
 */
function update(id, body) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'PATCH',
    body,
  });
}

/**
 * Judge the outcome of a game.
 *
 * @param {integer} id - target identifier.
 * @returns {Promise<*>} API result.
 */
function judge(id) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}/judge`,
    method: 'POST',
  });
}

module.exports = {
  fetch,
  get,
  create,
  update,
  judge,
};
