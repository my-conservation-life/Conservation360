import utils from 'c/utils';
import bboxAssets from '../bboxAssetsController';

const createMockFetchJson = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

const BBOX_ASSETS_ENDPOINT = utils.URL + 'bbox-assets';

describe('bboxAssets.get URL', () => {
    const EXPECTED_BBOX = { latitude_min: 0, latitude_max: 10, longitude_min: 20, longitude_max: 120 };
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchJson(EXPECTED_BBOX);
        global.fetch = fetch;
    });

    it('fetches /bbox-assets with no args', async () => {
        const bbox = await bboxAssets.get();
        expect(fetch.mock.calls[0][0]).toBe(BBOX_ASSETS_ENDPOINT);
        expect(bbox).toEqual(EXPECTED_BBOX);
    });

    it('fetches with project_id query param given valid projectId arg', async () => {
        const bbox = await bboxAssets.get(1);
        expect(fetch.mock.calls[0][0]).toBe(BBOX_ASSETS_ENDPOINT + '?project_id=1');
        expect(bbox).toEqual(EXPECTED_BBOX);
    });

    it('fetches without project_id query param given invalid projectId arg of 0', async () => {
        const bbox = await bboxAssets.get(0);
        expect(fetch.mock.calls[0][0]).toBe(BBOX_ASSETS_ENDPOINT);
        expect(bbox).toEqual(EXPECTED_BBOX);
    });

    it('fetches without project_id query param given a string', async () => {
        const bbox = await bboxAssets.get('2');
        expect(fetch.mock.calls[0][0]).toBe(BBOX_ASSETS_ENDPOINT);
        expect(bbox).toEqual(EXPECTED_BBOX);
    });
});