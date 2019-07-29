import utils from 'c/utils';
import assets from '../assetsController';

const createMockFetchJson = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

const ASSETS_ENDPOINT = utils.URL + 'assets';

describe('assets.find', () => {
    const EXPECTED_ASSETS = [];
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchJson(EXPECTED_ASSETS);
        global.fetch = fetch;
    });


    it('fetches without projectId', async () => {
        const assetArray = await assets.find();
        expect(fetch.mock.calls[0][0]).toBe(ASSETS_ENDPOINT);
        expect(assetArray).toEqual(EXPECTED_ASSETS);
    });

    it('fetches with projectId', async () => {
        const assetArray = await assets.find({ projectId: 2 });
        expect(fetch.mock.calls[0][0]).toBe(ASSETS_ENDPOINT + '?project_id=2');
        expect(assetArray).toEqual(EXPECTED_ASSETS);
    });

    it('fetches all assets when projectId is a string', async () => {
        const assetsArray = await assets.find({ projectId: '3' });
        expect(fetch.mock.calls[0][0]).toBe(ASSETS_ENDPOINT);
        expect(assetsArray).toEqual(EXPECTED_ASSETS);
    });
});