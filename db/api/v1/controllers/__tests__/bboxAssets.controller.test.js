const { get } = require('../bboxAssets.controller');
const bboxAssetsDb = require('../../db/bboxAssets.db');

describe('bboxAssets.controller.get', () => {
    let req;
    let res;
    let next;
    let expectedBbox;

    beforeEach(() => {
        req = {
            query: {}
        };

        res = {
            json: jest.fn()
        };

        next = jest.fn();

        expectedBbox = {
            latitude_min: -19.59,
            latitude_max: 20.01,
            longitude_min: -1.1,
            longitude_max: 0.5
        };

        bboxAssetsDb.get = jest.fn(async () => expectedBbox);
    });

    it('queries DB for bbox when no project_id is given', async () => {
        await get(req, res, next);
        expect(bboxAssetsDb.get).toHaveBeenCalledWith(undefined);
    });

    it('queries DB for bbox when project_id is 20', async () => {
        req.query.project_id = 20;
        await get(req, res, next);
        expect(bboxAssetsDb.get).toHaveBeenCalledWith(20);
    });

    it('sends the bounding box as JSON', async () => {
        await get(req, res, next);
        expect(res.json).toHaveBeenCalledWith(expectedBbox);
    });

    it('catches DB access exceptions to pass them to the Express', async () => {
        const DB_ERROR = new Error();
        bboxAssetsDb.get = jest.fn(async () => { throw DB_ERROR; });
        await get(req, res, next);
        expect(next).toHaveBeenCalledWith(DB_ERROR);
        expect(res.json).not.toHaveBeenCalled();
    });
});