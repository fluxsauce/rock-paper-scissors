const Joi = require('joi');

module.exports = Joi.number().integer().positive();
