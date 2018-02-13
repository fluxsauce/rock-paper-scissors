const config = require('config');

module.exports = {
  development: config.get('database'),
};
