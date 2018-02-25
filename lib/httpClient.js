const merge = require('lodash/merge');
const rp = require('request-promise');

module.exports = (userOptions, requestId) => {
  const options = merge({
    json: true,
    headers: {
      'X-Request-Id': requestId,
    },
  }, userOptions);
  return rp(options);
};
