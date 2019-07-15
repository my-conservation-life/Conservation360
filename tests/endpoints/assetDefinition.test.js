const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
describe('GET assetDefinitions', () => {
    beforeAll(async () => {
        await setup();
        await loadSQL('../schema/sample-data-1.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('returns HTTP 200 response', done => {
        request(app)
            .get('/api/v1/assetDefinitions')
            .end((err, res) => {
                expect(res.status).toBe(200);
                done();
            });
    });
});
