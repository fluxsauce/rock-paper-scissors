const id = require('./id');
const lastUpdated = require('./lastUpdated');
const Joi = require('joi');
const playerName = require('./playerName');

module.exports = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: lastUpdated.required(),
  name: playerName.required(),
}).options({ abortEarly: false, stripUnknown: true });
