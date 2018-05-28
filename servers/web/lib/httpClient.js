const merge = require('lodash/merge');
const util = require('util');
const request = util.promisify(require('request'));

module.exports = (userOptions, requestId) => {
  const options = merge({
    json: true,
  }, userOptions);
  if (requestId) {
    options.headers = merge(options.headers, { 'X-Request-Id': requestId });
  }
  return request(options);
};
