const { find } = require('../assets.controller');
const assetsDb = require('../../db/assets.db');

describe('assets.controller.find', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            query: {}
        };

        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        }

        next = jest.fn();

        assetsDb.find = jest.fn();
    });

    it('calls assetsDb.find when no project_id is provided', async () => {
        await find(req, res, next);
        expect(assetsDb.find).toHaveBeenCalledWith(undefined);
    });

    it('sends JSON response when project_id is provided', async () => {
        req.query['project_id'] = '2';

        const EXPECTED_ASSETS = [{}];
        assetsDb.find = jest.fn(async () => EXPECTED_ASSETS);

        await find(req, res, next);
        expect(res.json).toHaveBeenCalledWith(EXPECTED_ASSETS);
    });

    it('sends 500 status response when project_id is text', async () => {
        req.query['project_id'] = 'a';
        await find(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('sends 500 status response when project_id is an invalid DB integer key', async () => {
        req.query['project_id'] = '0';
        await find(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('uses the Express error handler for database exceptions', async () => {
        assetsDb.find = jest.fn(async () => { throw new Error(); });
        await find(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});