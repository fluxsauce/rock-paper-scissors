const compression = require('compression');
const config = require('config');
const express = require('express');
const httpClient = require('../../lib/httpClient');
const knex = require('../../lib/knex');
const requestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('../../lib/logger');
const path = require('path');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const app = express();

app.set('x-powered-by', false);

app.use(compression());

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

const staticConfig = { maxAge: '30d' };

app.use(express.static(path.join(__dirname, 'public'), staticConfig));
app.use('/bootstrap/css', express.static('./node_modules/bootstrap/dist/css', staticConfig));
app.use('/bootstrap/js', express.static('./node_modules/bootstrap/dist/js', staticConfig));
app.use('/jquery/js', express.static('./node_modules/jquery/dist', staticConfig));
app.use('/popper/js', express.static('./node_modules/popper.js/dist/umd', staticConfig));

app.use(requestId);

app.use(session({
  store: new KnexSessionStore({ knex }),
  secret: config.get('session.secret'),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
}));

app.use((request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  const options = {
    uri: `http://localhost:${config.get('players.port')}/api/v1/players`,
    method: 'POST',
  };
  return httpClient(options, request.id)
    .then((player) => {
      request.session.playerId = player.id;
      request.session.playerName = player.name;
      return next();
    });
});

app.use(morgan((tokens, req, res) => [
  // req.id,
  // req.session.id,
  req.session.playerName,
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' '), { stream: { write: message => logger.info(message.trim()) } }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.route('/ping').get((req, res) => res.send('PONG'));

app.use(require('./router'));

module.exports = app;
