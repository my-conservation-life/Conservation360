const request = require('supertest');

const app = require('../../app');
const { setup, teardown } = require('../setup');

describe('GET assets', () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    it('returns HTTP 200 response', () => {
        return request(app)
            .get('/api/v1/assets')
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.text).toBe('[]');
            });
    });
});
