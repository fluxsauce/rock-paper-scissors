const id = require('./id');
const lastUpdated = require('./lastUpdated');
const Joi = require('joi');
const playerChoice = require('./playerChoice');
const gameState = require('./gameState');

module.exports = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: lastUpdated.required(),
  player1id: id.optional().allow(null),
  player1choice: playerChoice.optional().allow(null),
  player2id: id.optional().allow(null),
  player2choice: playerChoice.optional().allow(null),
  state: gameState.required(),
  playerWinnerId: id.optional().allow(null),
}).options({ abortEarly: false, stripUnknown: true });
