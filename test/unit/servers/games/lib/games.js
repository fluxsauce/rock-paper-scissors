const chai = require('chai');

const config = require('config');
const knex = require('../../../../../lib/knex')(config);
const mockKnex = require('mock-knex');
const proxyquire = require('proxyquire');

const should = chai.should();

describe('servers/games/lib/games.js', function () {
  let tracker;
  let games;

  const validGame = {
    id: 1234,
    lastUpdated: new Date('2015-02-03 16:45:00'),
    player1id: 2,
    player1choice: 'rock',
    player2id: 3,
    player2choice: 'paper',
    state: 'final',
    playerWinnerId: 2,
  };

  before(function (done) {
    mockKnex.mock(knex);
    tracker = mockKnex.getTracker();

    games = proxyquire('../../../../../servers/games/lib/games', {
      '../../../lib/knex': () => knex,
    });

    done();
  });

  beforeEach(function (done) {
    tracker.install();
    done();
  });

  afterEach(function (done) {
    tracker.uninstall();
    done();
  });

  after(function (done) {
    mockKnex.unmock(knex);
    done();
  });

  context('get', function () {
    it('should get a record', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([validGame]);
      });

      return games.get(1234)
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal(1234);
          result.should.deep.equal(validGame);
          return result;
        });
    });

    it('should return null if there are no records', function () {
      let bindings;

      tracker.on('query', (query) => {
        ({ bindings } = query);
        query.response([]);
      });

      return games.get(1234)
        .then((result) => {
          bindings.length.should.equal(1);
          bindings[0].should.equal(1234);
          should.not.exist(result);
          return result;
        });
    });
  });
});
