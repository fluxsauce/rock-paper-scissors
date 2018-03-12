const config = require('config');
const httpClient = require('./httpClient');

/**
 * Create a player.
 *
 * @param {string} sessionId - player session ID.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function create(sessionId, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('players.port')}/api/v1/players`,
    method: 'POST',
    body: {
      sessionId,
    },
  }, requestId);
}

/**
 * Get a player by ID.
 *
 * @param {integer} id - target identifier.
 * @param {string} requestId - X-Request-Id.
 * @returns {Promise<*>} API result.
 */
function get(id, requestId) {
  return httpClient({
    uri: `http://localhost:${config.get('players.port')}/api/v1/players/${id}`,
    method: 'GET',
  }, requestId);
}

module.exports = {
  create,
  get,
};
