module.exports = class {
  constructor() {
    this.training = {};
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
