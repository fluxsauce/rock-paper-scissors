const express = require('express');
const expressRequestId = require('express-request-id')();
const requestLogger = require('../shared/requestLogger');

const app = express();

app.set('x-powered-by', false);

app.use(express.json());

app.use(expressRequestId);
app.use(requestLogger);

app.use(require('./router'));

module.exports = app;
