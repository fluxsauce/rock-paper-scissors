/* eslint-disable global-require,no-console */

const endpoints = require('express-list-endpoints');
const knex = require('./lib/knex');

[
  { name: 'players', app: require('./servers/players/app') },
  { name: 'games', app: require('./servers/games/app') },
  { name: 'web', app: require('./servers/web/app') },
].forEach((application) => {
  console.log(application.name);
  console.log(endpoints(application.app));
});

knex.destroy();
