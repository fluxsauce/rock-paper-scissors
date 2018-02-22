const Joi = require('joi');

module.exports = Joi.any().valid([
  'rock',
  'paper',
  'scissors',
]).required();
