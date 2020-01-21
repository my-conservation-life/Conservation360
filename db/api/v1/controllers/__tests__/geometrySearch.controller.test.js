const { distanceFind, envelopeFind, polygonFind } = require('../geometrySearch.controller');
const geomDb = require('../../db/geometrySearch.db');

describe('geometrySearch.controller.envelopeFind', () => {
    let req;
    let res;
    let next;
    let expected;

    beforeEach(() => {
        // Clear the request
        req = {
            valid: {},
            query: {}
        };

        // Clear the response
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();
        expected = [{}];
        geomDb.envelopeFind = jest.fn(async () => expected);
    });

    it('queries the database with the correct parameters', async () =>{
        req.valid['minimumLatitude'] = 10;
        req.valid['minimumLongitude'] = 11;
        req.valid['maximumLatitude'] = 20;
        req.valid['maximumLongitude'] = 21;

        await envelopeFind(req, res, next);
        expect(geomDb.envelopeFind).toHaveBeenCalledWith(10, 11, 20, 21);
        expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('catches database access exceptions to pass them to the error handler', async () => {
        const DB_ERROR = new Error();
        geomDb.envelopeFind = jest.fn(async () => { throw DB_ERROR; });
        await envelopeFind(req, res, next);
        expect(next).toHaveBeenCalledWith(DB_ERROR);
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe('geometrySearch.controller.distanceFind', () => {
    let req;
    let res;
    let next;
    let expected;

    beforeEach(() => {
        // Clear request
        req = {
            valid: {},
            query: {}
        };

        // Clear response
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();
        expected = [{}];
        geomDb.distanceFind = jest.fn(async () => expected);
    });

    it('queries the database with the correct parameters', async () =>{
        req.valid['latitude'] = 49.3;
        req.valid['longitude'] = 30.1;
        req.valid['radiusMeters'] = 20000;

        await distanceFind(req, res, next);
        expect(geomDb.distanceFind).toHaveBeenCalledWith(49.3, 30.1, 20000);
        expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('catches database access exceptions to pass them to the error handler', async () => {
        const DB_ERROR = new Error();
        geomDb.distanceFind = jest.fn(async () => { throw DB_ERROR; });
        await distanceFind(req, res, next);
        expect(next).toHaveBeenCalledWith(DB_ERROR);
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe('geometrySearch.controller.polygonFind', () => {
    let req;
    let res;
    let next;
    let expected;

    beforeEach(() => {
        // Clear request
        req = {
            valid: {},
            query: {}
        };

        // Clear response
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();
        expected = [{}];
        geomDb.polygonFind = jest.fn(async () => expected);
    });

    it('TODO: Needs tests', async () => {
        expect(false).toBeTruthy();
    });
});