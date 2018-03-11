const httpClient = require('./httpClient');

module.exports = (config) => {
  function create(sessionId, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('players.port')}/api/v1/players`,
      method: 'POST',
      body: {
        sessionId,
      },
    }, requestId);
  }

  function get(id, requestId) {
    return httpClient({
      uri: `http://localhost:${config.get('players.port')}/api/v1/players/${id}`,
      method: 'GET',
    }, requestId);
  }

  return {
    create,
    get,
  };
};
