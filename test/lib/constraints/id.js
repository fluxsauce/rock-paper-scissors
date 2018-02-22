const chai = require('chai');
const id = require('../../../lib/constraints/id');

const should = chai.should();

describe('server/lib/constraints/id.js', function () {
  it('should accept valid input', function (done) {
    const result = id.validate(1);

    result.value.should.equal(1);
    should.not.exist(result.error);

    done();
  });

  it('should reject invalid input', function (done) {
    const result = id.validate('pants');

    result.error.should.be.an('error');
    result.error.message.should.equal('"value" must be a number');

    done();
  });
});
