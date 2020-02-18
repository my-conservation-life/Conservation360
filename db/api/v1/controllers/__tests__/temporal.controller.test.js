const { temporalSearch } = require('../temporal.controller');
const temporalDb = require('../../db/temporal.db');
const moment = require('moment');

describe('temporal.controller.temporalSearch', () => {

    let req;
    let res;
    let next;
    let expected;

    beforeEach(() => {
        req = {
            valid: {geometry: {coordinates: [1, 2], type: 'Circle', radius: 500}},
            query: {}
        };

        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();
        expected = [{}];
        temporalDb.temporalSearch = jest.fn(async () => expected);
    });


    it('jsonifies results', async () => {
        await temporalSearch(req, res, next);
        expect(temporalDb.temporalSearch).toHaveBeenCalledWith(
            req.valid.geometry, undefined, undefined, undefined, undefined, undefined, undefined
        );
        expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('accesses DB with valid parameters', async () => {

        const validAssetId = 1;
        const validSponsorName = 'SponsorName';
        const validProjectName = 'ProjectName';
        const validAssetTypeName = 'AssetTypeName';
        const validStartDate = moment('2020-05-20', 'YYYY-MM-DD', true);
        const validEndDate = moment('2020-05-22', 'YYYY-MM-DD', true);

        req.valid['asset_id'] = validAssetId;
        req.valid['sponsor_name'] = validSponsorName;
        req.valid['project_name'] = validProjectName;
        req.valid['asset_type_name'] = validAssetTypeName;
        req.valid['start_date'] = validStartDate;
        req.valid['end_date'] = validEndDate;

        await temporalSearch(req, res, next);
        expect(temporalDb.temporalSearch).toHaveBeenCalledWith(
            req.valid.geometry, 
            validAssetId, 
            validSponsorName, 
            validProjectName, 
            validAssetTypeName, 
            validStartDate, 
            validEndDate
        );
        expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('catches DB access exceptions and passes errors to the Express error handler', async () => {
        const DB_ERROR = new Error();
        temporalDb.temporalSearch = jest.fn(async () => { throw DB_ERROR; });
        await temporalSearch(req, res, next);
        expect(next).toHaveBeenCalledWith(DB_ERROR);
        expect(res.json).not.toHaveBeenCalled();
    });
});
