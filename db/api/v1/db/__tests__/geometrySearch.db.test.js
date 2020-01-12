const { envelopeFind } = require('../geometrySearch.db');

describe('geometrySearch.db.envelopeFind', () => {
    let query;
    let rows;

    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));

        global.dbPool = {
            query
        };
    });

    it('executes the correct DB query', async () => {
        await envelopeFind(10, 11, 20, 21);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('ST_Within(a.location, ST_MakeEnvelope(%1, %2, %3, %4))'));
        expect(query.mock.calls[0][1]).toEqual(expect.arrayContaining([10, 11, 20, 21]));
    });
});
