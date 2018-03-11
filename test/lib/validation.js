const chai = require('chai');
const joiSchemas = require('../../lib/validation');

const should = chai.should();

describe('lib/validation.js', function () {
  context('playerChoice', function () {
    it('should accept valid input', function (done) {
      const result = joiSchemas.playerChoice.validate('rock');

      result.value.should.equal('rock');
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = joiSchemas.playerChoice.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.include('"value" must be one of');

      done();
    });
  });

  context('gameState', function () {
    it('should accept valid input', function (done) {
      const result = joiSchemas.gameState.validate('final');

      result.value.should.equal('final');
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = joiSchemas.gameState.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.include('"value" must be one of');

      done();
    });
  });

  context('id', function () {
    it('should accept valid input', function (done) {
      const result = joiSchemas.id.validate(1);

      result.value.should.equal(1);
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = joiSchemas.id.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.equal('"value" must be a number');

      done();
    });
  });

  context('lastUpdated', function () {
    it('should accept valid input', function (done) {
      const date = new Date(2017, 6, 10, 6, 3);

      const result = joiSchemas.lastUpdated.validate(date);

      result.value.should.equal(date);
      should.not.exist(result.error);

      done();
    });

    it('should reject invalid input', function (done) {
      const result = joiSchemas.lastUpdated.validate('pants');

      result.error.should.be.an('error');
      result.error.message.should.equal('"value" must be a number of milliseconds or valid date string');

      done();
    });
  });
});
