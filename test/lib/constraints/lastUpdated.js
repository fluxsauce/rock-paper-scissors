const chai = require('chai');
const lastUpdated = require('../../../lib/constraints/lastUpdated');

const should = chai.should();

describe('server/lib/constraints/lastUpdated.js', function () {
  it('should accept valid input', function (done) {
    const date = new Date(2017, 6, 10, 6, 3);

    const result = lastUpdated.validate(date);

    result.value.should.equal(date);
    should.not.exist(result.error);

    done();
  });

  it('should reject invalid input', function (done) {
    const result = lastUpdated.validate('pants');

    result.error.should.be.an('error');
    result.error.message.should.equal('"value" must be a number of milliseconds or valid date string');

    done();
  });
});
