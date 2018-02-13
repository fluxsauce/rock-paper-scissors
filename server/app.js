const config = require('config');
const express = require('express');
const morgan = require('morgan');
const logger = require('./lib/logger');
const path = require('path');

const app = express();

app.set('x-powered-by', false);
app.set('etag', false);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(morgan(config.get('logger.format'), { stream: { write: message => logger.info(message.trim()) } }));

app.use(require('./router'));

app.route('/ping').get((req, res) => res.send('PONG'));

module.exports = app;
