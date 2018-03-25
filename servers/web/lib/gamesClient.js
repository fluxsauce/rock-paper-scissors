const httpClient = require('./httpClient');

module.exports = (config) => {
  /**
   * Create a game.
   *
   * @param {integer} player1id - first player ID.
   * @returns {Promise<Game>} New game.
   */
  function create(player1id) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/games`,
      method: 'POST',
      body: {
        player1id,
      },
    });
  }

  /**
   * Get a game by ID.
   *
   * @param {integer} id - target identifier.
   * @returns {Promise<Game>} Game matched by id.
   */
  function get(id) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/games/${id}`,
      method: 'GET',
    });
  }

  /**
   * Fetch config.
   *
   * @param {Object} criteria - criteria for filtering results.
   * @returns {Promise<Array.<Game>>} Games matching criteria.
   */
  function fetch(criteria) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/games`,
      method: 'GET',
      qs: criteria,
    });
  }

  /**
   * Update a game.
   *
   * @param {integer} id - target identifier.
   * @param {object} body - fields to update.
   * @returns {Promise<Game>} Updated game.
   */
  function update(id, body) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/games/${id}`,
      method: 'PATCH',
      body,
    });
  }

  /**
   * Judge the outcome of a game.
   *
   * @param {integer} id - target identifier.
   * @returns {Promise<Game>} Game with updated state and playerWinnerId.
   */
  function judge(id) {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/games/${id}/judge`,
      method: 'POST',
    });
  }

  /**
   * Get the game rules.
   *
   * @returns {Promise<Array>} Collection of rules.
   */
  function rules() {
    return httpClient({
      uri: `${config.protocol}://${config.host}:${config.port}/api/v1/rules`,
      method: 'GET',
    });
  }

  return {
    create,
    get,
    fetch,
    update,
    judge,
    rules,
  };
};
