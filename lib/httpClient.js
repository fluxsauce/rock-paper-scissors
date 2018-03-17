const merge = require('lodash/merge');
const pify = require('pify');
const request = require('request');

module.exports = (userOptions) => {
  const options = merge({
    json: true,
  }, userOptions);
  return pify(request)(options);
};
