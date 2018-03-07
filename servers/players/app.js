const express = require('express');
const requestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('../../lib/logger');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(requestId);

app.use(morgan((tokens, req, res) => [
  req.id,
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' '), { stream: { write: message => logger.info(message.trim()) } }));

app.route('/ping').get((req, res) => res.send('PONG'));

app.use(require('./router'));

module.exports = app;
