const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
describe('GET assets', () => {
    beforeAll(() => {
        setup();
        loadSQL('../schema/sample-data-1.sql');
    });

    afterAll(() => {
        teardown();
    });

    it('returns HTTP 200 response', done => {
        request(app)
            .get('/api/v1/assets')
            .end((err, res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
