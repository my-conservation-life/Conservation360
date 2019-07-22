const request = require('supertest');
const app = require('../../app');
const { setup, teardown } = require('../setup');

const ENDPOINT = '/api/v1/dataTypes';

describe('GET dataTypes', () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    it('returns the correct data', (done) => {
        request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((response) => {
                const data = response.body;
                expect(data instanceof Array).toBe(true);
                expect(data.length).toBeGreaterThan(0);
                expect(typeof data[0]).toBe('string');
                done();
            });
    });
});
