const chai = require('chai');
const gameState = require('../../../lib/constraints/gameState');

const should = chai.should();

describe('server/lib/constraints/gameState.js', function () {
  it('should accept valid input', function (done) {
    const result = gameState.validate('final');

    result.value.should.equal('final');
    should.not.exist(result.error);

    done();
  });

  it('should reject invalid input', function (done) {
    const result = gameState.validate('pants');

    result.error.should.be.an('error');
    result.error.message.should.include('"value" must be one of');

    done();
  });
});
