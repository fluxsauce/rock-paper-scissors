const Knex = require('knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const config = require('./config');

const knex = Knex(config.database);

module.exports = session({
  store: new KnexSessionStore({ knex }),
  secret: config.session.secret,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
});
