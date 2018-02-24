const isNull = require('lodash/isNull');
const Referee = require('./Referee');

const referee = new Referee();

module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = new Date();
    this.player1id = input.player1id || null;
    this.player1choice = input.player1choice || null;
    this.player2id = input.player2id || null;
    this.player2choice = input.player2choice || null;
    this.state = input.state || 'pending';
    this.playerWinnerId = input.playerWinnerId || null;
  }

  determineOutcome() {
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

    if (!isNull(judgement)) {
      outcome.playerWinnerId = judgement ? this.player1id : this.player2id;
    }

    return outcome;
  }
};
