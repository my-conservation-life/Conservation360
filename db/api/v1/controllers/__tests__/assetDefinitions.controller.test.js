const { getAssetTypes, getAssetPropsByTypeID, getAssetPropTypes } = require('../assetDefinitions.controller');
const assetDefinitionsDb = require('../../db/assetDefinitions.db');

describe('assetDefinitions.controller.getAssetTypes', () => {
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
        await getAssetTypes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(data);
    });
});

describe('assetDefinitions.controller.getAssetPropsByTypeID', () => {
    let req;
    let res;
    let next;
    let expectedAssetTypes;
    let data;

    beforeEach(() => {
        req = { valid : { assetTypeID: 1 } };
    
        res = {
            json: jest.fn()
        };

        next = jest.fn();
        expectedAssetTypes = [{}];
        data = { rows: expectedAssetTypes };
        assetDefinitionsDb.findAssetPropsByTypeID = jest.fn(async () => data);
    });

    it('returns all asset types in DB', async () => {
        await getAssetPropsByTypeID(req, res, next);
        expect(res.json).toHaveBeenCalledWith(data);
    });
});

describe('assetDefinitions.controller.getAssetPropsTypes', () => {
    let req;
    let res;
    let next;
    let expectedAssetTypes;
    let data;

    beforeEach(() => {
        req = { valid : { assetTypeID: 1 } };
    
        res = {
            json: jest.fn()
        };

        next = jest.fn();
        expectedAssetTypes = [{}];
        data = { rows: expectedAssetTypes };
        assetDefinitionsDb.findAssetPropTypes = jest.fn(async () => data);
    });

    it('returns all asset types in DB', async () => {
        await getAssetPropTypes(req, res, next);
        expect(res.json).toHaveBeenCalledWith(data);
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
