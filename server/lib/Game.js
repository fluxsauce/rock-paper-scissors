const GameConstraint = require('./constraints/Game');
const isNull = require('lodash/isNull');
const logger = require('./logger');
const knex = require('./knex');
const merge = require('lodash/merge');
const Referee = require('./Referee');

const referee = new Referee();

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.player1id = input.player1id || null;
    this.player1choice = input.player1choice || null;
    this.player2id = input.player1id || null;
    this.player2choice = input.player2choice || null;
    this.state = input.state || 'pending';
    this.playerWinnerId = input.playerWinnerId || null;
  }

  create() {
    return GameConstraint.validate(this)
      .then(validated => knex
        .insert(validated)
        .into('games'))
      .then((result) => {
        this.id = result.pop();
        return this;
      });
  }

  get() {
    return knex('games')
      .where({ id: this.id })
      .select()
      .then((result) => {
        merge(this, result.pop());
        return this;
      });
  }

  update(input) {
    merge(this, input);
    this.lastUpdated = new Date();

    return GameConstraint.validate(this)
      .then(validated => knex('games')
        .where({ id: this.id })
        .update(validated))
      .then(() => this);
  }

  determineOutcome(requestId) {
    const outcome = {
      state: 'pending',
      playerWinnerId: null,
    };

    if (!this.player1id && !this.player2id) {
      return outcome;
    }

    if (!this.player1choice && !this.player1choice) {
      return outcome;
    }

    outcome.state = 'final';

    const judgement = referee.judge(this.player1choice, this.player2choice);
    logger.debug({
      requestId, action: 'game-outcome', id: this.id, judgement,
    });

    if (!isNull(judgement)) {
      outcome.playerWinnerId = judgement ? this.player1id : this.player2id;
    }

    return outcome;
  }

  judge(requestId) {
    const outcome = this.determineOutcome(requestId);
    logger.debug({ requestId, action: 'game-judge-outcome', outcome });
    return this.update(outcome);
  }
};
