const httpClient = require('../lib/httpClient');

module.exports = (config) => {
  function get(id, requestId) {
    if (!requestId) {
      throw new TypeError('players.get missing requestId!');
    }

    return httpClient({
      uri: `http://localhost:${config.get('players.port')}/api/v1/players/${id}`,
      method: 'GET',
    }, requestId);
  }

  return {
    get,
  };
};
