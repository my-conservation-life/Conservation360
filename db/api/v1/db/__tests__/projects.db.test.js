/**
 * Tests for Projects database layer.
 */

const { find, create, update } = require('../projects.db');

describe('projects.db.find', () => {
    let query;  // Mock Query to check if queries are formatted properly
    let rows;   // Mock result set

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
        // Expected body of the response object
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
    let query;      // A mock query function
    let release;    // A mock release function
    let rows;       // A mock query return data
    let pId;        // A project ID that is a property of the returned rows data
    let client;     // A mock Client 

    // Reset Mock before each test
    beforeEach(() => {
        pId = 2;
        rows = [{ 'id': pId }];
        query = jest.fn(async () => ({ rows }));
        release = jest.fn(() => { return undefined; });
        global.dbPool.connect = jest.fn(async () => { return client; });
        client = { query, release };
    });

    it('executes correct queries with valid project', async () => {
        const project = {'sponsor_id': '1', 'name': 'Madagascar Reforesting Project', 'description' : 'Replanting Trees in Madagascar'};
        await create(project);
        expect(query).toHaveBeenCalledTimes(3); // Once for Begin Transaction, Once for Create Project, Once for Commit
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('INSERT INTO project'));
        expect(query.mock.calls[2][0]).toEqual(expect.stringContaining('END TRANSACTION'));
    });

    it('returns project id when transaction is successful', async () => {
        const project = {'sponsor_id': '1', 'name': 'Madagascar Reforesting Project', 'description' : 'Replanting Trees in Madagascar'};
        const actualRowId = await create(project);
        expect(actualRowId).toEqual(pId);
    });

    it('throws exception when query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        client.query = query;
        await expect(create()).rejects.toThrow();
    });

    it('releases client after successful create', async () => {
        const project = {'sponsor_id': '1', 'name': 'Madagascar Reforesting Project', 'description' : 'Replanting Trees in Madagascar'};
        await create(project);
        expect(query).toHaveBeenCalledTimes(3); // Once for Begin Transaction, Once for Create Project, Once for Commit
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('INSERT INTO project'));
        expect(query.mock.calls[2][0]).toEqual(expect.stringContaining('END TRANSACTION'));
        expect(release).toHaveBeenCalledTimes(1);
    });

    it('roles back and releases client after query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        client.query = query;
        await expect(create()).rejects.toThrow();
        expect(query).toHaveBeenCalledTimes(2); // call in beginTransaction and rollbackTransaction
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('ROLLBACK'));
        expect(release).toHaveBeenCalledTimes(1);
    });
});

describe('projects.db.update', () => {
    let query;      // A mock query function
    let release;    // A mock release function
    let rows;       // A mock query return data
    let pId;        // A project ID of the project to be updated
    let client;     // A mock Client 

    // Reset Mock before each test
    beforeEach(() => {
        pId = 7;
        rows = [{ 'id': pId }];
        query = jest.fn(async () => ({ rows }));
        release = jest.fn(() => { return undefined; });
        global.dbPool.connect = jest.fn(async () => { return client; });
        client = { query, release };
    });

    it('executes correct queries with valid project', async () => {
        const project = {'sponsor_id': '2', 'name': 'Bison Protection', 'description' : 'Rebuild the midwest bison population!'};
        await update(pId, project);
        expect(query).toHaveBeenCalledTimes(3); // Once for Begin Transaction, Once for Create Project, Once for Commit
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('UPDATE project'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('(sponsor_id, name, description) ='));
        expect(query.mock.calls[2][0]).toEqual(expect.stringContaining('END TRANSACTION'));
    });

    it('returns project id when transaction is successful', async () => {
        const project = {'sponsor_id': '1', 'name': 'Bison Protection', 'description' : 'Rebuild the midwest bison population!'};
        const actualRowId = await update(pId, project);
        expect(actualRowId).toEqual(pId);
    });

    it('throws exception when query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        client.query = query;
        await expect(update()).rejects.toThrow();
    });

    it('releases client after successful create', async () => {
        const project = {'sponsor_id': '1', 'name': 'Bison Protection', 'description' : 'Rebuild the midwest bison population!'};
        await update(pId, project);
        expect(query).toHaveBeenCalledTimes(3); // Once for Begin Transaction, Once for Create Project, Once for Commit
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('UPDATE project'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('(sponsor_id, name, description) ='));
        expect(query.mock.calls[2][0]).toEqual(expect.stringContaining('END TRANSACTION'));
        expect(release).toHaveBeenCalledTimes(1);
    });

    it('roles back and releases client after query throws', async () => {
        query = jest.fn(async () => { throw new Error(); });
        client.query = query;
        await expect(update()).rejects.toThrow();
        expect(query).toHaveBeenCalledTimes(2); // call in beginTransaction and rollbackTransaction
        expect(query.mock.calls[0][0]).toEqual(expect.stringContaining('BEGIN TRANSACTION'));
        expect(query.mock.calls[1][0]).toEqual(expect.stringContaining('ROLLBACK'));
        expect(release).toHaveBeenCalledTimes(1);
    });
});