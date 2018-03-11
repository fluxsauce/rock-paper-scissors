const config = require('config');
const knex = require('../../lib/knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

module.exports = session({
  store: new KnexSessionStore({ knex }),
  secret: config.get('session.secret'),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
});