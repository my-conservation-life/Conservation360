const { find } = require('../dataTypes.db');

describe('dataTypes.db.find', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.pool = {
            query
        };
    });

    it('executes correct DB query', async () => {
        await find();

        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('data_type'));
    });

    it('returns an array of dataType rows', async () => {
        rows = [
            { name: '1' },
            { name: '2' }
        ];

        const actualRows = await find();

        expect(actualRows).toEqual(rows);
    });
});