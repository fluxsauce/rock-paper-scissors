const merge = require('lodash/merge');
const pify = require('pify');
const request = require('request');

module.exports = (userOptions, requestId) => {
  if (!requestId) {
    throw new TypeError('httpClient missing requestId!');
  }

  const options = merge({
    json: true,
    headers: {
      'X-Request-Id': requestId,
    },
  }, userOptions);
  return pify(request)(options);
};
