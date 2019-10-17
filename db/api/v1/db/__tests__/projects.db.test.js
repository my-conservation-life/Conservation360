/**
 * Tests for Projects database layer.
 * 
 * TODO: Insert License
 */

const { find, create } = require('../projects.db');

describe('projects.db.find', () => {

    let query;  // Mock Query to check if queries are formatted properly
    let rows;   // Mock result set

    // TODO: Don't we have to set up and reset database to run this test?

    // Clear variables before each test is executed.
    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));
        global.dbPool = { query };
    });

    it('executes correct query when no parameters are specified', async () => {
        await find(undefined, undefined, undefined);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND id '));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND sponsor_id '));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND LOWER(name) '));
    });

    it('executes correct query when project id is specified', async () => {
        await find(3, undefined, undefined);
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND id'));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND sponsor_id '));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND LOWER(name) '));
        expect(query.mock.calls[0][1]).toEqual([3]);
    });

    it('executes correct query when sponsor_id is specified', async () => {
        await find(undefined, 8, undefined);
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND id'));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND sponsor_id '));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND LOWER(name) '));
        expect(query.mock.calls[0][1]).toEqual([8]);
    });

    it('executes correct query when project name is specified', async () => {
        await find(undefined, undefined, 'Madagascar Reforestation');
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND id'));
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND sponsor_id '));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND LOWER(name) '));
        expect(query.mock.calls[0][1]).toEqual(['Madagascar Reforestation']);
    });

    it('executes correct query when sponsor_id and project name is specified', async () => {
        await find(undefined, 8, 'Madagascar Reforestation');
        expect(query.mock.calls[0][0]).toEqual(expect.not.stringContaining('AND id'));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND sponsor_id '));
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('AND LOWER(name) '));
        expect(query.mock.calls[0][1]).toEqual([8,'Madagascar Reforestation']);
    });

    it('returns an array of project rows', async () => {
        rows =  [
            { id: 1, sponsor_id: 5, name: 'Madagascar Reforestation', description: 'Planting a bunch of trees in Madagascar'},
            { id: 2, sponsor_id: 1, name: 'Lemur Protection', description: 'Save the Lemurs! Help Zooboomafu.'},
        ];

        const actualRows = await find();

        expect(actualRows).toEqual(rows);
    });

    it('throws exception when query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        global.dbPool.query = query;
        await expect(find()).rejects.toThrow();
    });

});

describe('projects.db.create', () => {

    let query; // TODO: what is this?
    let rows;  // TODO: what is this?

    // Clear variables before each test is executed.
    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));
        global.dbPool = { query };
    });

    it('TODO: inserts a new project', async () => {
        expect(false).toBeTruthy();
    });

});
