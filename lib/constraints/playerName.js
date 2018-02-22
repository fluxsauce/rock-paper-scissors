const Joi = require('joi');

module.exports = Joi.string().max(32, 'utf8');
