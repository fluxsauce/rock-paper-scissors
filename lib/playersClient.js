const httpClient = require('./httpClient');

module.exports = (config) => {
  /**
   * Create a player.
   *
   * @returns {Promise<*>} API result.
   */
  function create() {
    return httpClient({
      uri: `http://localhost:${config.get('players.port')}/api/v1/players`,
      method: 'POST',
    });
  }

  /**
   * Get a player by ID.
   *
   * @param {integer} id - target identifier.
   * @returns {Promise<*>} API result.
   */
  function get(id) {
    return httpClient({
      uri: `http://localhost:${config.get('players.port')}/api/v1/players/${id}`,
      method: 'GET',
    });
  }

  return {
    create,
    get,
  };
};
