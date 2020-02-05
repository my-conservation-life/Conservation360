/**
 * Tests for Asset Definitions database layer
 */
const { findAssetTypes, findPropertiesByAssetTypeId, findAsset, findAssetProperty, createAssetProperty, updateAssetProperty, storeCSV } = require('../assetDefinitions.db');

describe('assetDefinitions.db.findAssetTypes', () => {
    let rows;
    let query;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async() => rows);
        global.dbPool = { query };
    });

    it(('returns an array containing all asset types'), async() => {
        const actualRows = await findAssetTypes();
        expect(actualRows).toEqual(rows);
    });
});

describe('assetDefinitions.db.findPropertiesByAssetTypeId', () => {
    let rows;
    let query;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async() => rows);
        global.dbPool = { query };
    });

    it('finds all properties associated with the asset type ID given', async () => {
        const actualRows = await findPropertiesByAssetTypeId();
        expect(actualRows).toEqual(rows);
    });
});

describe('assetDefinitions.db.findAssets', () => {
    let rows;
    let query;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async() => rows);
        global.dbPool = { query };
    });

    it('finds all properties associated with the asset type ID given', async () => {
        const actualRows = await findAsset();
        expect(actualRows).toEqual(rows);
    });
});

describe('find asset property with the asset type ID and property ID given', () => {
    let rows;
    let query;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async() => rows);
        global.dbPool = { query };
    });

    it('finds all properties associated with the asset type ID given', async () => {
        const actualRows = await findAssetProperty();
        expect(actualRows).toEqual(rows);
    });
});

describe('assetDefinitions.db.createAssetProperty', () => {
    let rows;
    let query;
    let release;
    let client;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async () => ({ rows }));
        release = jest.fn(() => { return undefined; });
        client = { query, release };
        global.dbPool.connect = jest.fn(async () => { return client; });
    });

    it('creates an asset property', async () => {
        const assetId = 1;
        const propertyId = 1;
        const value = 1;
        await createAssetProperty(client, assetId, propertyId, value);
        expect(query).toHaveBeenCalledTimes(1);
    });
});

describe('assetDefinitions.db.updateAssetProperty', () => {
    let rows;
    let query;
    let release;
    let client;

    beforeEach(() => {
        rows = [{}];
        query = jest.fn(async () => ({ rows }));
        release = jest.fn(() => { return undefined; });
        client = { query, release };
        global.dbPool.connect = jest.fn(async () => { return client; });
    });

    it('updates an asset property', async () => {
        const assetId = 1;
        const propertyId = 1;
        const value = 1;
        await updateAssetProperty(client, assetId, propertyId, value);
        expect(query).toHaveBeenCalledTimes(1);
    });
});

describe('assetDefinitions.db.storeCSV', () => {
    let rows;
    let findPropertiesByAssetTypeId;
    let findAsset;
    let result;
    let query;
    let release;
    let client;

    beforeEach(() => {
        // TODO tests for storeCSV function
        rows = [{}];
        findPropertiesByAssetTypeId = jest.fn(async () => ({rows}));
        findAsset = jest.fn(async () => ({rows}));

        result = {};
        query = jest.fn(async () => ( result ));
        release = jest.fn(async () => { return undefined; });
        client = { query, release };
        global.dbPool.connect = jest.fn(async () => { return client; });
    });

    // it('executes correct queries', async () => {
    //     const assetTypeId = 1;
    //     const data = [
    //         { asset_id: '3', latitude: '-17.66365', longitude: '45.9114', bright_ti4: '334.6', scan: '0.35', track: '0.57', acq_date: '5/28/2019', acq_time: '954', satellite: 'A', instrument: 'VIIRS', confidence: 'n', version: '1.0NRT', bright_ti5: '295.4', frp: '2.7', daynight: 'N' },
    //         { asset_id: '4', latitude: '-19.53818', longitude: '45.04081', bright_ti4: '344.6', scan: '0.42', track: '0.61', acq_date: '5/28/2019', acq_time: '954', satellite: 'B', instrument: 'VIIRS', confidence: 'n', version: '1.0NRT', bright_ti5: '295.8', frp: '4.2', daynight: 'D' },
    //         { asset_id: '5', latitude: '-19.53904', longitude: '45.04072', bright_ti4: '346.1', scan: '0.42', track: '0.61', acq_date: '5/28/2019', acq_time: '954', satellite: 'C', instrument: 'VIIRS', confidence: 'n', version: '1.0NRT', bright_ti5: '296', frp: '3.8', daynight: 'N' }
    //     ];

    //     await storeCSV(assetTypeId, data);
    //     expect(query).toHaveBeenCalledTimes(3);
    //     expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
    //     expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('INSERT INTO asset_property'));
    //     expect(query.mock.calls[2][0]).toEqual(expect.stringContaining('END TRANSACTION'));
    // });
});