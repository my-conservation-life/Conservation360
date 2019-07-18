const request = require('supertest');

const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
const { createTestAsset } = require('../utils');

const ENDPOINT = '/api/v1/assets';

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

    afterEach(async () => {
        await global.dbPool.query('DELETE FROM asset');
    });

    it('returns empty list of assets', () => {
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
                expect(res.body).toEqual(expect.arrayContaining([
                    expect.objectContaining(ASSET1),
                    expect.objectContaining(ASSET2),
                    expect.objectContaining(ASSET3)
                ]));

                expect(res.body).toHaveLength(3);
            });
    });

    it('filters assets by project ID', async () => {
        await createTestAssets();
        await request(app)
            .get(ENDPOINT + '?project_id=2')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(expect.arrayContaining([
                    expect.objectContaining(ASSET2),
                    expect.objectContaining(ASSET3)
                ]));

                expect(res.body).toHaveLength(2);
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
});
