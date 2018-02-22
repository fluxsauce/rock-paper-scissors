const Joi = require('joi');

module.exports = Joi.date().raw().default(() => new Date(), 'current date');
