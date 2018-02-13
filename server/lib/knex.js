const config = require('config');
const knex = require('knex');

module.exports = knex(config.get('database'));
