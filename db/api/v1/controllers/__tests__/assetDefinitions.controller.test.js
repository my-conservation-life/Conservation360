const { findAssetTypes } = require('../assetDefinitions.controller');
const assetDefinitionsDb = require('../../db/assetDefinitions.db');

describe('assetDefinitions.controller.findAssetTypes', () => {
    let req;
    let res;
    let next;
    let expectedAssetTypes;
    let data;

    beforeEach(() => {
        req = {};
    
        res = {
            json: jest.fn()
        };

        next = jest.fn();
        expectedAssetTypes = [{}];
        data = { rows: expectedAssetTypes };
        assetDefinitionsDb.findAssetTypes = jest.fn(async () => data);
    });

    it('returns all asset types in DB', async () => {
        await findAssetTypes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(expectedAssetTypes);
    });
});

describe('assetDefinitions.controller.storeCSV', () => {
    let req;
    let res;
    let next;
    let assetTypeId;
    let expected;

    beforeEach(() => {
        req = {
            body: {},
            file: {}
        };

        // Clear the response
        res = {
            json: jest.fn()
        };

        next = jest.fn();

        expected = { success: true };
        assetTypeId = 1;
        assetDefinitionsDb.storeCSV = jest.fn(async () => expected);
    });

    // TODO - tests for storeCSV function in controller
});