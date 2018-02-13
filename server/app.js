const express = require('express');
const requestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('./lib/logger');
const path = require('path');

const app = express();

app.set('x-powered-by', false);
app.set('etag', false);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(requestId);
app.use(morgan((tokens, req, res) => [
  req.id,
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' '), { stream: { write: message => logger.info(message.trim()) } }));

app.use(require('./router'));

app.route('/ping').get((req, res) => res.send('PONG'));

module.exports = app;
