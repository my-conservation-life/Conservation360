const { get } = require('../bbox-assets.db');

const MOCK_BBOX = {
    latitude_min: -20,
    latitude_max: -18,
    longitude_min: 45,
    longitude_max: 48
};

describe('bbox-assets.db.get', () => {
    beforeEach(() => {
        global.dbPool = {
            query: jest.fn(() => ({
                rows: [MOCK_BBOX]
            }))
        }
    });

    it('executes correct query for all assets', async () => {
        const bbox = await get();
        expect(global.dbPool.query).toHaveBeenCalledTimes(1);
        expect(global.dbPool.query.mock.calls[0][0]).toEqual(expect.stringContaining('FROM asset'));
        expect(global.dbPool.query.mock.calls[0][0]).toEqual(expect.not.stringContaining('WHERE'));
    });

    it('executes query for assets of specific project', async () => {
        const bbox = await get(3);
        expect(global.dbPool.query).toHaveBeenCalledTimes(1);
        expect(global.dbPool.query.mock.calls[0][0]).toEqual(expect.stringContaining('FROM asset WHERE project_id = $1'));
    });

    it('returns bbox without projectId arg', async () => {
        const bbox = await get();
        expect(bbox).toEqual(MOCK_BBOX);
    });

    it('returns bbox with projectId arg', async () => {
        const bbox = await get(1);
        expect(bbox).toEqual(MOCK_BBOX);
    });

    it('throws when query execution fails', async () => {
        global.dbPool.query = jest.fn(async () => { throw 'DB error'; });
        await expect(get()).rejects.toThrow();
    });

    it('throws when query works but no rows in result', async () => {
        global.dbPool.query = jest.fn(async () => ({ rows: [] }));
        await expect(get()).rejects.toThrow();
    });
});