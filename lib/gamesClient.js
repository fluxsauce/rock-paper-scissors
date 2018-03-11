const httpClient = require('./httpClient');

module.exports = (config) => {
  function fetch(criteria, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
      method: 'GET',
      qs: criteria,
    }, requestId);
  }

  function get(id, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${id}`,
      method: 'GET',
    }, requestId);
  }

  function create(player1id, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games`,
      method: 'POST',
      body: {
        player1id,
      },
    }, requestId);
  }

  function update(gameId, body, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${gameId}`,
      method: 'PATCH',
      body,
    }, requestId);
  }

  function judge(gameId, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('games.port')}/api/v1/games/${gameId}/judge`,
      method: 'POST',
    }, requestId);
  }

  return {
    fetch,
    get,
    create,
    update,
    judge,
  };
};
