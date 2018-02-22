const Joi = require('joi');

module.exports = Joi.any().valid([
  'final',
  'pending',
]);
