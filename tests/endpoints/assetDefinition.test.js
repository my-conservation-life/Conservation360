const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

describe('GET/POST assetDefinitions', () => {
    beforeAll(async () => {
        jest.setTimeout(30000)
        await setup();

        // create some default asset definitions
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('able to get assetDefinitions', (done) => {
        request(app)
            .get('/api/v1/assetDefinitions')
            .expect(200)
            .then((response) => {
                const assetDefinition = response.body[0];
                expect(assetDefinition).toHaveProperty('assetType');
                expect(assetDefinition).toHaveProperty('properties');
                done();
            });
    });

    it('able to create assetDefinitions', async () => {
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

        await request(app)
            .post('/api/v1/assetDefinitions')
            .send(assetDefinition)
            //.expect(200)
            .then((response) => {
                // response.body should contain the id of the created data_type
                const data = response.body;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('number');
            });
    });
});
