const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

describe('GET assets', () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    function contains(arr, key, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) return true;
        }
        return false;
    }

    it('returns HTTP 200 response', () => {
        return request(app)
            .get('/api/v1/assets')
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.text).toBe('[]');
            });
    });

    it('returns assets with expected types', done => {
        loadSQL('../schema/sample-data-1.sql');
        request(app)
            .get('/api/v1/assets')
            .expect(200)
            .then(response => {
                // response.body should contain the id of the created data_type
                const data = response.body;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('object');
                expect(contains(data, 'sponsor_name', 'Bronx Zoo'));
                expect(contains(data, 'sponsor_name', 'Seneca Park Zoo'));
                expect(contains(data, 'asset_id', '21'));
                expect(contains(data, 'asset_type', 'Bison'));
                done();
            });
    });
});
