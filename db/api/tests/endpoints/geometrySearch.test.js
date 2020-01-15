const request = require('supertest');

const querystring = require('querystring');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
const { createTestAsset } = require('../utils');

const ENDPOINT = '/api/v1/assets/geometrySearch/envelope';

describe('GET assets/geometrySearch/envelope', () => {
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

    it('returns 200 response', async () => {
        const envelopeQuery = querystring.encode({
            minimumLatitude: '-1.1',
            minimumLongitude: '-1.1',
            maximumLatitude: '1.1',
            maximumLongitude: '1.1'
        });

        await request(app)
            .get(ENDPOINT + `?${envelopeQuery}`)
            .expect(200);
    });

    it('returns only assets within envelope', async () => {
        await createTestAsset(.5, .25);
        await createTestAsset(5, 5);

        const envelopeQuery = querystring.encode({
            minimumLatitude: '-1.1',
            minimumLongitude: '-1.1',
            maximumLatitude: '1.1',
            maximumLongitude: '1.1'
        });

        await request(app)
            .get(ENDPOINT + `?${envelopeQuery}`)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
                let retAsset = res.body[0];
                expect(retAsset.lat).toBe(.5);
                expect(retAsset.lon).toBe(.25);
            });
    });
});
