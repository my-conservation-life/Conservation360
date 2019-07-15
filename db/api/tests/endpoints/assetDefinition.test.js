const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

describe('GET/POST assetDefinitions', () => {
    beforeAll(async () => {
        await setup();

        // FK relationship in assetDefinition requires dataTypes to exist
        await loadSQL('../schema/sample-data-dataTypes.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('returns HTTP 200 response', (done) => {
        request(app)
            .get('/api/v1/assetDefinitions')
            .expect(200, done);
    });

    it('able to create assetDefinitions', (done) => {
        const assetDefinition = {
            'assetDefinition': {
                'name': 'tname',
                'description': 'tdesc',
                'properties': [
                    {
                        'name': 'tprop1',
                        'data_type': 'number',
                        'required': true,
                        'is_private': false
                    },
                    {
                        'name': 'tprop2',
                        'data_type': 'boolean',
                        'required': false,
                        'is_private': true
                    }
                ]
            }
        };

        request(app)
            .post('/api/v1/assetDefinitions')
            .send(assetDefinition)
            .expect(200)
            .then((response) => {
                // response.body should contain the id of the created data_type
                const data = response.body;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('number');
                done();
            });
    });
});
