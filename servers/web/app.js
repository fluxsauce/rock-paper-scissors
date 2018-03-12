const compression = require('compression');
const express = require('express');
const playersClient = require('../../lib/playersClient');
const requestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('../../lib/logger');
const path = require('path');
const session = require('./session');

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
app.use('/socket/js', express.static('./node_modules/socket.io-client/dist', staticConfig));

app.use(requestId);

app.use(session);

app.use((request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  return playersClient.create(request.id)
    .then((result) => {
      request.session.playerId = result.body.id;
      request.session.playerName = result.body.name;
      return next();
    });
});

app.use(morgan((tokens, req, res) => [
  // req.id,
  req.session.id,
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

app.use((request, response) => response.status(404).render('404', { title: '404' }));

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  logger.error(error);
  return response.status(500).render('500', {
    title: '500',
  });
});

module.exports = app;
