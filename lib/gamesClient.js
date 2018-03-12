const config = require('config');
const httpClient = require('./httpClient');

/**
 * Fetch games.
 *
 * @param {Object} criteria - criteria for filtering results.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function fetch(criteria, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
    method: 'GET',
    qs: criteria,
  }, requestId);
}

/**
 * Get a game by ID.
 *
 * @param {integer} id - target identifier.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function get(id, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'GET',
  }, requestId);
}

/**
 * Create a game.
 *
 * @param {integer} player1id - first player ID.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function create(player1id, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
    method: 'POST',
    body: {
      player1id,
    },
  }, requestId);
}

/**
 * Update a game.
 *
 * @param {integer} id - target identifier.
 * @param {object} body - fields to update.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function update(id, body, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
    method: 'PATCH',
    body,
  }, requestId);
}

/**
 * Judge the outcome of a game.
 *
 * @param {integer} id - target identifier.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function judge(id, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}/judge`,
    method: 'POST',
  }, requestId);
}

module.exports = {
  fetch,
  get,
  create,
  update,
  judge,
};
