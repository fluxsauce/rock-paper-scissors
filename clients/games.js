const httpClient = require('../lib/httpClient');

module.exports = (config) => {
  function get(id, requestId) {
    if (!requestId) {
      throw new TypeError('games.get missing requestId!');
    }

    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
      method: 'GET',
    }, requestId);
  }

  function create(player1id, requestId) {
    if (!requestId) {
      throw new TypeError('games.create missing requestId!');
    }

    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
      method: 'POST',
      body: {
        player1id,
      },
    }, requestId);
  }

  function update(gameId, body, requestId) {
    if (!requestId) {
      throw new TypeError('games.update missing requestId!');
    }

    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${gameId}`,
      method: 'PATCH',
      body,
    }, requestId);
  }

  return {
    get,
    create,
    update,
  };
};
