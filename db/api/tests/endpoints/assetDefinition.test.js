const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const EXPECTED_ASSET_TYPE1 = { id: 1, name: 'Tree', description: null };
const EXPECTED_ASSET_TYPE2 = { id: 2, name: 'Lemur', description: 'Mammals of the order Primates, divided into 8 families and consisting of 15 genera and around 100 existing species. They are native only to the island of Madagascar.' };
const EXPECTED_ASSET_TYPE3 = { id: 3, name: 'Bison', description: 'Bison are large, even-toed ungulates in the genus Bison within the subfamily Bovinae.' };

describe('GET/POST assetDefinitions', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
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

describe('GET assetTypes', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();

        // create some default asset types
        await loadSQL('../schema/sample-data-assetTypes.sql');
    });

    // Clean up after the tests are finished.
    afterAll(async () => {
        await teardown();
    });

    it('gets all asset types', async () => {
        await request(app)
            .get('/api/v1/assetTypes')
            .expect(200)
            .then((res) => {
                expect(res.body.rows).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_ASSET_TYPE1),
                        expect.objectContaining(EXPECTED_ASSET_TYPE2),
                        expect.objectContaining(EXPECTED_ASSET_TYPE3)
                    ])
                );
                expect(res.body.rows).toHaveLength(3);
            });
    });
});

describe('POST assetPropTypes', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();

        // create some default asset types
        await loadSQL('../schema/sample-data-assetTypes.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('gets all asset property types', async () => {
        await request(app)
            .post('/api/v1/assetPropTypes')
            .send({'assetTypeID' : '1'})
            .expect(200)
            .then((res) => {
                expect(res.body.rows).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_ASSET_TYPE1),
                        expect.objectContaining(EXPECTED_ASSET_TYPE2),
                        expect.objectContaining(EXPECTED_ASSET_TYPE3)
                    ])
                );
                expect(res.body.rows).toHaveLength(1);
            });
    });
});

describe('POST assetPropsByTypeID', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();

        // create some default asset types
        await loadSQL('../schema/sample-data-assetTypes.sql');
    });

    afterAll(async () => {
        await teardown();
    });

    it('gets all asset property types', async () => {
        await request(app)
            .post('/api/v1/assetPropsByTypeID')
            .send({'assetTypeID' : '1'})
            .expect(200)
            .then((res) => {
                expect(res.body.rows).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_ASSET_TYPE1),
                        expect.objectContaining(EXPECTED_ASSET_TYPE2),
                        expect.objectContaining(EXPECTED_ASSET_TYPE3)
                    ])
                );
                expect(res.body.rows).toHaveLength(3);
            });
    });
});


// TODO - tests for PUT CSV endpoint
describe('PUT CSV', () => {
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();

        // create some default asset definitions
        await loadSQL('../schema/sample-data-assetTypes.sql');
    });

    // Clean up after the tests are finished.
    afterAll(async () => {
        await teardown();
    });
});
