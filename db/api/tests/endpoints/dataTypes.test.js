const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

describe('GET dataTypes', () => {
    beforeAll(async () => {
        await setup();
        await loadSQL('../schema/sample-data-dataTypes.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('returns the correct data', (done) => {
        request(app)
            .get('/api/v1/dataTypes')
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
