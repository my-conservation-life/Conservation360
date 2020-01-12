const request = require('supertest');

const querystring = require('querystring');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/assets/geometrySearch/envelope';

describe('GET assets/geometrySearch/envelope', () => {


    it('TODO: Write tests for endpoint', async () => {
        expect(false).toBeTruthy();
    });
});