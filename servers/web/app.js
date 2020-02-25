const express = require('express');
const expressRequestId = require('express-request-id')();
const path = require('path');
const playersClient = require('./lib/playersClient')(require('./config').players);
const session = require('./session');
const logger = require('../shared/logger');
const requestLogger = require('../shared/requestLogger');

const app = express();

app.set('x-powered-by', false);
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Specify node_modules location if not set from environment variables.
if (!('NODE_PATH' in process.env)) {
  process.env.NODE_PATH = path.resolve(__dirname, '../../node_modules');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap/css', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/js')));
app.use('/jquery/js', express.static(path.join(process.env.NODE_PATH, '/jquery/dist')));
app.use('/popper/js', express.static(path.join(process.env.NODE_PATH, '/popper.js/dist/umd')));

app.use(session);
app.use(expressRequestId);

app.use(async (request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  const result = await playersClient.create(request.id);
  request.session.playerId = result.body.id;
  logger.info('New Session', request.session.playerId, request.session.id);
  return next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(requestLogger);

app.use(require('./router'));

app.use((request, response) => {
  logger.warn(new Date().toISOString(), request.method, request.originalUrl, '404');
  return response.status(404).render('404', {
    title: '404',
  });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  logger.error(error, request.session.playerId, request.session.id);
  return response.status(500).render('500', {
    title: '500',
  });
});

module.exports = app;
