const { find } = require('../assets.db');

describe('assets.db.find', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        }
    });


    it('executes correct DB query when no projectId is specified', async () => {
        await find();

        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('WHERE '));
    });

    it('executes correct DB query when projectId is specified', async () => {
        await find(1);

        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('WHERE project_id = $1'));
        expect(query.mock.calls[0][1]).toEqual([1]);
    });

    it('returns an array of asset rows', async () => {
        rows = [
            { id: 1, project_id: 1, latitude: 2, longitude: 3 },
            { id: 2, project_id: 3, latitude: -20, longitude: -100 }
        ];

        const actualRows = await find();

        expect(actualRows).toEqual(rows);
    });

    it('throws when projectId equals 0', async () => {
        await expect(find(0)).rejects.toThrow('Invalid argument');
    });

    it('throws when DB query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        global.dbPool.query = query;

        await expect(find()).rejects.toThrow();
    });
});