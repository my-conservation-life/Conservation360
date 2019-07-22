const request = require('supertest');

const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/bbox-assets';

/**
 * The bounding box returned when there are no assets
 */
const NULL_BOX = {
    latitude_min: null,
    latitude_max: null,
    longitude_min: null,
    longitude_max: null
};

/**
 * @param {number} latitude latitude of the asset
 * @param {number} longitude longitude of the asset
 * @param {number} [projectId] project ID of the asset
 */
const createAsset = async (latitude, longitude, projectId = 1) =>
    global.dbPool.query(
        `INSERT INTO asset (project_id, asset_type_id, location)
         VALUES ($1, 1, ST_POINT($2, $3))`,
        [projectId, latitude, longitude]
    );

describe('GET bbox-assets', () => {
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

    it('returns null box when there are no assets', async () => {
        await request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(expect.objectContaining(NULL_BOX));
            });
    });

    it('returns location of asset with min = max when there is one asset', async () => {
        await createAsset(34, 27);

        const EXPECTED_BBOX = {
            latitude_min: 34,
            latitude_max: 34,
            longitude_min: 27,
            longitude_max: 27
        };

        await request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining(EXPECTED_BBOX)
                );
            });
    });

    it('returns bounding box of multiple assets', async () => {
        await Promise.all([
            createAsset(1, 3),
            createAsset(-1, -1),
            createAsset(-2, 0)
        ]);

        const EXPECTED_BBOX = {
            latitude_min: -2,
            latitude_max: 1,
            longitude_min: -1,
            longitude_max: 3
        };

        await request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining(EXPECTED_BBOX)
                );
            });
    });

    it('validates project ID argument if specified', async () => {
        await request(app)
            .get(ENDPOINT + '?project_id=a')
            .expect(400);
    });

    it('can filter assets by project ID', async () => {
        await Promise.all([createAsset(4, 5, 1), createAsset(7, 8, 2)]);

        const EXPECTED_BBOX = {
            latitude_min: 7,
            latitude_max: 7,
            longitude_min: 8,
            longitude_max: 8
        };

        await request(app)
            .get(ENDPOINT + '?project_id=2')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining(EXPECTED_BBOX)
                );
            });
    });

    it('returns null box if the project ID specified does not exist', async () => {
        await request(app)
            .get(ENDPOINT + '?project_id=39')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(expect.objectContaining(NULL_BOX));
            });
    });
});
