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
    if (!this.training[winner]) {
      this.training[winner] = {};
    }
    this.training[winner][loser] = true;
  }
};
