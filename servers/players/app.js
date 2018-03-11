const express = require('express');
const requestId = require('express-request-id')();
const morgan = require('morgan');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());
app.use(requestId);

app.use(morgan('combined'));

app.route('/ping').get((req, res) => res.send('PONG'));

app.use(require('./router'));

module.exports = app;
