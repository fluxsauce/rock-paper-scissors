const httpClient = require('./httpClient');

module.exports = (config) => {
  /**
   * Create a player.
   *
   * @returns {Promise<Player>} New player.
   */
  function create() {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/players`,
      method: 'POST',
    });
  }

  /**
   * Get a player by ID.
   *
   * @param {integer} id - target identifier.
   * @returns {Promise<Player>} Player matched by id.
   */
  function get(id) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/players/${id}`,
      method: 'GET',
    });
  }

  return {
    create,
    get,
  };
};
