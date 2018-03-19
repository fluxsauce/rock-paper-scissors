const config = require('config');
const express = require('express');
const knex = require('../../../../lib/knex')(config);
const mockKnex = require('mock-knex');
const request = require('supertest');
const proxyquire = require('proxyquire');
const chai = require('chai');

const should = chai.should();

describe('games API', function () {
  let tracker;
  let app;
  let override;

  before(function (done) {
    mockKnex.mock(knex);
    tracker = mockKnex.getTracker();

    override = { knex };
    override.knex['@global'] = true;

    done();
  });

  beforeEach(function (done) {
    app = express();
    app.use(express.json());

    const router = proxyquire('../../../../servers/games/router', override);

    app.use(router);
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

    context('POST', function () {
      it('should create a game', function (done) {
        const expected = {
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: null,
          player1id: null,
          player2choice: null,
          player2id: null,
          playerWinnerId: null,
          state: 'pending',
        };

        tracker.on('query', query => query.response([1]));

        request(app)
          .post('/api/v1/games')
          .send({ lastUpdated: '2018-03-17T20:33:36.000Z' })
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });
  });

  context('/api/v1/games/:game_id', function () {
    context('GET', function () {
      it('should return a game by id', function (done) {
        const expected = {
          id: 1,
          lastUpdated: '2018-03-17T20:33:36.000Z',
          player1choice: 'rock',
          player1id: 1,
          player2choice: 'scissors',
          player2id: 2,
          playerWinnerId: 1,
          state: 'final',
        };

        tracker.on('query', query => query.response([expected]));

        request(app)
          .get('/api/v1/games/1')
          .expect('Content-Type', /json/)
          .expect(200, expected, done);
      });
    });
  });
});
