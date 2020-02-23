const { distanceFind, envelopeFind, polygonFind } = require('../geometrySearch.db');
const { makeLineString } = require('../../utils/db.utils');

describe('geometrySearch.db.distanceFind', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        };
    });

    it('executes the correct DB query', async () => {
        await distanceFind(1.2, 1.1, 2000);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_DWithin(ST_SetSRID(a.location, 4326)::geography,'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining([1.2, 1.1, 2000]));
    });
});


describe('geometrySearch.db.envelopeFind', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        };
    });

    it('executes the correct DB query', async () => {
        await envelopeFind(10, 11, 20, 21);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_Within(a.location, ST_MakeEnvelope($1, $2, $3, $4))'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining([10, 11, 20, 21]));
    });
});

describe('geometrySearch.db.polygonFind', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        };
    });

    it('executes the correct DB query', async () => {
        const points = [{latitude: 10, longitude: 10}, {latitude: 10, longitude: 15}, {latitude: 15, longitude: 13}];

        let polygonPoints = [];

        // Deep copy points into the polygon point list
        points.forEach(p => {
            polygonPoints.push(p);
        });

        // close the polygon
        polygonPoints.push(points[0]);

        // Create the linestring
        const lineString = makeLineString(polygonPoints);
        
        await polygonFind(points);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_Within(a.location, ST_MakePolygon(ST_GeomFromText($1)))'));
        expect(query.mock.calls[0][1][0]).toEqual(expect.stringContaining(lineString));
    });
});

