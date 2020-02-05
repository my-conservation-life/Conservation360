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
        const assetTypes = await assetDefinitions.findAssetTypes();
        expect(fetch.mock.calls[0][0]).toBe(URL);
        expect(assetTypes).toEqual(EXPECTED_ASSET_TYPES);
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