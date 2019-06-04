import { API_URL } from '../config';
import assets from '../assetsController';

const createMockFetchJson = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

const ASSETS_ENDPOINT = API_URL + 'assets';

describe('assets.find', () => {
    const EXPECTED_ASSETS = [];
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchJson(EXPECTED_ASSETS);
        global.fetch = fetch;
    });


    it('fetches without projectId', async () => {
        const assetArray = await assets.find();
        expect(fetch).toHaveBeenCalledWith(ASSETS_ENDPOINT);
        expect(assetArray).toEqual(EXPECTED_ASSETS);
    });

    it('fetches with projectId', async () => {
        const assetArray = await assets.find(2);
        expect(fetch).toHaveBeenCalledWith(ASSETS_ENDPOINT + '?project_id=2');
        expect(assetArray).toEqual(EXPECTED_ASSETS);
    });

    it('fetches all assets when projectId is a string', async () => {
        const assetsArray = await assets.find('3');
        expect(fetch).toHaveBeenCalledWith(ASSETS_ENDPOINT);
        expect(assetsArray).toEqual(EXPECTED_ASSETS);
    });

    it('fetches all assets when projectId is 0', async () => {
        const assetsArray = await assets.find(0);
        expect(fetch).toHaveBeenCalledWith(ASSETS_ENDPOINT);
        expect(assetsArray).toEqual(EXPECTED_ASSETS);
    });
});