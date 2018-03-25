const merge = require('lodash/merge');
const util = require('util');
const request = util.promisify(require('request'));

module.exports = (userOptions) => {
  const options = merge({
    json: true,
  }, userOptions);
  return request(options);
};
