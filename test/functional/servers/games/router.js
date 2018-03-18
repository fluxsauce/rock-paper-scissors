const config = require('config');
const express = require('express');
const knex = require('../../../../lib/knex')(config);
const mockKnex = require('mock-knex');
const request = require('supertest');
const router = require('../../../../servers/games/router');
const chai = require('chai');

const should = chai.should();

describe('games API', function () {
  let tracker;
  const app = express();
  app.use(express.json());
  app.use(router);

  before(function (done) {
    mockKnex.mock(knex);
    tracker = mockKnex.getTracker();
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

  context('/api/v1/games', function () {
    context('GET', function () {
      it('should return all games', function (done) {
        const expected = [
          {
            id: 1,
            lastUpdated: '2018-03-17T20:33:36.000Z',
            player1choice: 'rock',
            player1id: 1,
            player2choice: 'scissors',
            player2id: 2,
            playerWinnerId: 1,
            state: 'final',
          },
        ];

        tracker.on('query', query => query.response(expected));

        request(app)
          .get('/api/v1/games')
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });
  });
});
