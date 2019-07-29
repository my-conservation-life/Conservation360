const { find } = require('../assets.db');

describe('assets.db.find', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        };
    });


    it('executes correct DB query when no projectId is specified', async () => {
        await find(undefined, undefined, undefined);

        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND project_id '));
    });

    it('executes correct DB query when projectId is specified', async () => {
        await find(undefined, 54, undefined);

        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND project_id'));
        expect(query.mock.calls[0][1]).toEqual([54]);
    });

    it('returns an array of asset rows', async () => {
        rows = [
            { id: 1, project_id: 1, latitude: 2, longitude: 3 },
            { id: 2, project_id: 3, latitude: -20, longitude: -100 }
        ];

        const actualRows = await find();

        expect(actualRows).toEqual(rows);
    });

    it('throws when DB query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        global.dbPool.query = query;

        await expect(find()).rejects.toThrow();
    });
});