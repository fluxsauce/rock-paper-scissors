const forEach = require('lodash/forEach');

module.exports = class {
  constructor() {
    this.training = {};

    this.train('rock', 'scissors');
    this.train('paper', 'rock');
    this.train('scissors', 'paper');
  }

  judge(choice1, choice2) {
    if (choice1 === choice2) {
      return null;
    }

    return this.training[choice1][choice2] === true;
  }

  train(winner, loser) {
    this.training[winner] = {};
    this.training[winner][loser] = true;
  }

  rules() {
    const rules = [];

    forEach(this.training, (rule, winner) => {
      forEach(rule, (boolean, loser) => {
        rules.push(`${winner} beats ${loser}`);
      });
    });

    return rules;
  }
};
