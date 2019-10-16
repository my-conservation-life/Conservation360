/**
 * Tests for Projects database layer.
 * 
 * TODO: Insert License
 */

const { find, create } = require('../projects.db');

describe('projects.db.find', () => {

    let query; // TODO: what is this?
    let rows;  // TODO: what is this?

    // Clear variables before each test is executed.
    beforeEach(() => {
        rows = [];
        query = jest.fn(async () => ({ rows }));
        global.dbPool = { query };
    });

    it('TODO: executes correct query for all assets', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: executes query for projects of specific sponsor', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: executes query for projects with specific project_id', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: throws exception when query execution fails', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: throws exception when query executes but has now rows in result', async () => {
        expect(false).toBeTruthy();
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
