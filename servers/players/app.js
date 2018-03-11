const express = require('express');
const knex = require('../../lib/knex');
const logger = require('../../lib/logger');
const requestId = require('express-request-id')();
const morgan = require('morgan');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(requestId);

app.use(morgan('combined'));

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
