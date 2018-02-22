const chai = require('chai');
const playerChoice = require('../../../../server/lib/constraints/playerChoice');

const should = chai.should();

describe('server/lib/constraints/playerChoice.js', function () {
  it('should accept valid input', function (done) {
    const result = playerChoice.validate('rock');

    result.value.should.equal('rock');
    should.not.exist(result.error);

    done();
  });

  it('should reject invalid input', function (done) {
    const result = playerChoice.validate('pants');

    result.error.should.be.an('error');
    result.error.message.should.include('"value" must be one of');

    done();
  });
});
