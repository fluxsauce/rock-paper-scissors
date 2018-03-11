const express = require('express');
const knex = require('../../lib/knex');
const requestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('../../lib/logger');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(requestId);

app.use(morgan((tokens, req, res) => [
  req.id,
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' '), { stream: { write: message => logger.info(message.trim()) } }));

app.route('/ping').get((request, response) => {
  knex.raw('SELECT 1 = 1')
    .then(() => response.end('PONG'))
    .catch((err) => {
      logger.error(err.message);
      response.status(500).end(err.message);
    });
});

app.use(require('./router'));

module.exports = app;
