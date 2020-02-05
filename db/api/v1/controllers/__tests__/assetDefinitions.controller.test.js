const { findAssetTypes, storeCSV } = require('../assetDefinitions.controller');
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

    it('gets all asset types in DB', async () => {
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
        // Try to create file object
        assetDefinitionsDb.storeCSV = jest.fn(async () => expected);
    });

    // it('accesses DB and sends successful response', async () => {
    //     req.body.assetTypeId = assetTypeId;
    //     // req.file = SOME SORT OF FILE

    //     await storeCSV(req, res, next);
    //     expect(assetDefinitionsDb.storeCSV).toHaveBeenCalledTimes(1);
    //     expect(assetDefinitionsDb.storeCSV).toHaveBeenCalledWith(assetTypeId, json);
    // });
});