const { find } = require('../assets.controller');
const assetsDb = require('../../db/assets.db');

describe('assets.controller.find', () => {
    let req;
    let res;
    let next;

    let EXPECTED_ASSETS;

    beforeEach(() => {
        req = {
            valid: {},
            query: {}
        };

        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();

        EXPECTED_ASSETS = [{}];
        assetsDb.find = jest.fn(async () => EXPECTED_ASSETS);
    });

    it('accesses DB and sends JSON response when no project_id is provided', async () => {
        await find(req, res, next);
        expect(assetsDb.find).toHaveBeenCalledWith(undefined);
        expect(res.json).toHaveBeenCalledWith(EXPECTED_ASSETS);
    });

    it('accesses DB and sends JSON response when project_id is provided', async () => {
        req.valid['project_id'] = 2;
        await find(req, res, next);
        expect(assetsDb.find).toHaveBeenCalledWith(2);
        expect(res.json).toHaveBeenCalledWith(EXPECTED_ASSETS);
    });

    it('ignores unvalidated project_id', async () => {
        const getProjectId = jest.fn(() => 'a');
        Object.defineProperty(req.query, 'project_id', { get: getProjectId });
        await find(req, res, next);
        expect(getProjectId).not.toHaveBeenCalled();
    });

    it('uses the Express error handler for database exceptions', async () => {
        assetsDb.find = jest.fn(async () => { throw new Error(); });
        await find(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});