const Joi = require('joi');

const lastUpdated = Joi.date();

const gameState = Joi.any().valid([
  'final',
  'pending',
]);

const playerChoice = Joi.any().valid([
  'rock',
  'paper',
  'scissors',
]);

const id = Joi.number().integer().positive();

const playerName = Joi.string().max(32, 'utf8');

const Game = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: lastUpdated.required(),
  player1id: id.optional().allow(null),
  player1choice: playerChoice.optional().allow(null),
  player2id: id.optional().allow(null),
  player2choice: playerChoice.optional().allow(null),
  state: gameState.required(),
  playerWinnerId: id.optional().allow(null),
}).options({ abortEarly: false, stripUnknown: true });

const Player = Joi.object({
  id: id.optional().allow(null),
  lastUpdated: lastUpdated.required(),
  name: playerName.required(),
}).options({ abortEarly: false, stripUnknown: true });

module.exports = {
  Game,
  gameState,
  id,
  lastUpdated,
  Player,
  playerChoice,
  playerName,
};
