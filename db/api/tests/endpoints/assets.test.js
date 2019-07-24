const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
const { createTestAsset } = require('../utils');

const ENDPOINT = '/api/v1/assets';
/* global BigInt */
describe('GET assets', () => {
    const ASSET1 = { latitude: 1, longitude: 2 };
    const ASSET2 = { latitude: 3, longitude: 4 };
    const ASSET3 = { latitude: -2.1, longitude: 1.12 };

    const createTestAssets = () =>
        Promise.all([
            createTestAsset(ASSET1.latitude, ASSET1.longitude, 1),
            createTestAsset(ASSET2.latitude, ASSET2.longitude, 2),
            createTestAsset(ASSET3.latitude, ASSET3.longitude, 2)
        ]);

    beforeAll(async () => {
        await setup();
        await loadSQL('../schema/sample-data-emptyProjects.sql');
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
            .get(ENDPOINT)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([]);
            });
    });

    it('returns assets', async () => {
        await createTestAssets();
        await request(app)
            .get(ENDPOINT)
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(ASSET1),
                        expect.objectContaining(ASSET2),
                        expect.objectContaining(ASSET3)
                    ])
                );

                expect(res.body).toHaveLength(3);
            });
    });

    it('filters assets by project ID', async () => {
        await createTestAssets();
        await request(app)
            .get(ENDPOINT + '?project_id=2')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(ASSET2),
                        expect.objectContaining(ASSET3)
                    ])
                );

                expect(res.body).toHaveLength(4);
            });
    });

    it('validates the sponsor ID optional parameter', async () => {
        await request(app)
            .get(ENDPOINT + '?sponsor_id=z')
            .expect(400);
    });

    it('validates the project ID optional parameter', async () => {
        await request(app)
            .get(ENDPOINT + '?project_id=z')
            .expect(400);
    });

    it('validates the asset type ID optional parameter', async () => {
        await request(app)
            .get(ENDPOINT + '?asset_type_id=z')
            .expect(400);
    });

    it('able to create assets', async () => {
        const asset = {
            project: {
                id: 1
            },
            type: {
                id: 1
            },
            location: {
                lattitude: 1.5,
                longitude: -1.5
            },
            properties: [
                {
                    id: 1,
                    value: '5.5'
                },
                {
                    id: 2,
                    value: '07-01-2019'
                }
            ]
        };

        await request(app)
            .post(ENDPOINT)
            .send(asset)
            .expect(200)
            .then(response => {
                const data = BigInt(response.body);
                expect(data).toBeTruthy();
                expect(typeof data).toBe('bigint');
            });
    });

    it('returns assets with expected types', done => {
        request(app)
            .get(ENDPOINT)
            .expect(200)
            .then(response => {
                // response.body should contain the id of the created data_type
                const data = response.body;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('object');
                //"Randomly" checking that the data loaded from Sample-data-1.sql is present
                expect(contains(data, 'sponsor_name', 'Bronx Zoo'));
                expect(contains(data, 'sponsor_name', 'Seneca Park Zoo'));
                expect(contains(data, 'asset_id', '21'));
                expect(contains(data, 'asset_type', 'Bison'));
                done();
            });
    });
});
