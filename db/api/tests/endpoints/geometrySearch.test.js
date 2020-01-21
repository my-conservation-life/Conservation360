const request = require('supertest');

const querystring = require('querystring');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');
const { createTestAsset } = require('../utils');

const GEOMETRY_ENDPOINT = '/api/v1/assets/geometrySearch';
const ENVELOPE_ENDPOINT = `${GEOMETRY_ENDPOINT}/envelope`;
const DISTANCE_ENDPOINT = `${GEOMETRY_ENDPOINT}/distance`;
const POLYGON_ENDPOINT = `${GEOMETRY_ENDPOINT}/polygon`;


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
            .get(ENVELOPE_ENDPOINT + `?${envelopeQuery}`)
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
            .get(ENVELOPE_ENDPOINT + `?${envelopeQuery}`)
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(1);
                let retAsset = res.body[0];
                expect(retAsset.lat).toBe(.5);
                expect(retAsset.lon).toBe(.25);
            });
    });
});

describe('GET assets/geometrySearch/distance', () => {
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
        const distanceQuery = querystring.encode({
            latitude: '-1.1',
            longitude: '-1.1',
            radiusMeters: '1000',
        });

        await request(app)
            .get(DISTANCE_ENDPOINT + `?${distanceQuery}`)
            .expect(200);
    });
});

describe('GET assets/geometrySearch/polygon', () => {

    // Helper function
    let pack = (lat, lon) => { return { latitude: lat, longitude: lon}; };

    beforeAll(async () => {
        await setup();
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    afterAll(async () => {
        teardown();
    });

    
    afterEach(async () => {
        await global.dbPool.query('DELETE FROM asset');
    });

    it('returns 200 response', async () => {

        const validBody = { coordinates : [pack('13.3', '33'), pack('12', '44'), pack('12', '3')]};
        await request(app)
            .get(POLYGON_ENDPOINT)
            .send(validBody)
            .expect(200);
    });
});
