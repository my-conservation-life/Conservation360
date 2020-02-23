import utils from 'c/utils';
import assetDefinitions from '../assetDefinitionsController';

const createMockFetch = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

describe('assetDefinitions.findAssetTypes', () => {
    const EXPECTED_ASSET_TYPES = [];
    let fetch;

    let URL = utils.URL + 'assetTypes';

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_ASSET_TYPES);
        global.fetch = fetch;
    });

    it('finds all asset types stored in the DB', async () => {
        const assetTypes = await assetDefinitions.fetchAssetTypes();
        expect(fetch.mock.calls[0][0]).toBe(URL);
        expect(assetTypes).toEqual(EXPECTED_ASSET_TYPES);
    });
});

describe('assetDefinitions.findAssetPropTypes', () => {
    const EXPECTED_ASSET_PROP_TYPES = [];
    let fetch;

    let URL = utils.URL + 'assetPropTypes'

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_ASSET_PROP_TYPES);
        global.fetch = fetch;
    });

    it('finds all the asset properties for a given asset type', async () => {
        const assetPropTypes = await assetDefinitions.fetchAssetPropTypes(1);
        expect(fetch.mock.calls[0][0]).toBe(URL);
        expect(fetch.mock.calls[0][1]).toEqual(expect.objectContaining(1));
        expect(assetPropTypes).toEqual(EXPECTED_ASSET_PROP_TYPES);
    });
});

describe('assetDefinitions.findAssetPropsByTypeID', () => {
    const EXPECTED_ASSET_PROPERTIES = [];
    let fetch;

    let URL = utils.URL + 'assetPropsByTypeID';

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_ASSET_PROPERTIES);
        global.fetch = fetch;
    });

    it('finds all the asset properties for a given type of asset', async () => {
        const assetPropsByTypeID = await assetDefinitions.fetchAssetPropsByTypeID(1);
        expect(fetch.mock.calls[0][0]).toBe(URL);
        expect(assetPropsByTypeID).toEqual(EXPECTED_ASSET_PROPERTIES);
    });
});

describe('assetDefinitions.sendCSV', () => {
    const EXPECTED_RESPONSE = Promise.resolve();
    let fetch;

    let URL = utils.URL + 'csv';

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_RESPONSE);
        global.fetch = fetch;
    });

    it('adds CSV data', async () => {
        const assetTypeId = 1;
        const csv = new File([], '../csvs/trees.csv', {
            type: 'application/vnd.ms-excel'
        });

        const response = assetDefinitions.sendCSV(assetTypeId, csv);
        expect(fetch.mock.calls[0][0]).toBe(URL);
        expect(response).toEqual(EXPECTED_RESPONSE); 
    });
}); 
