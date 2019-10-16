/**
 * Tests for the Projects enpoint layer.
 * 
 * TODO: Insert License
 */

const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/projects';

describe('GET/POST Projects', () => {

    // Projects Test Setup
    beforeAll(async () => {
        // jest.setTimeout(30000); // What is this and why are we doing it
        await setup();

        // Add test data to the database.
        // TODO: add a new sql file that has project descriptions
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    // Clean up after the tests.
    afterAll(async () => {
        await teardown();
    });

    // Test the endpoint's response code
    it('TODO: returns HTTP 200 response', (/*done*/) => {
        // TODO: Should this be async and return request(app)
        // request(app)
        //     .get(ENDPOINT)
        //     .expect(200)
        //     .then((response) => {
        //         expect(response.body).toEqual([]);
        //         done();
        //     });

        expect(false).toBeTruthy();
    });

    // Test getting all Projects from the database
    it('TODO: able to get all Projects', async () => {
        expect(false).toBeTruthy();
    });

    // Test getting a Project by Sponsor ID
    it('TODO: able to filter by Sponsor ID', async () => {
        expect(false).toBeTruthy();
    });

    // Test getting a Project by Project Name
    it('TODO: able to filter by Project Name', async () => {
        expect(false).toBeTruthy();
    });

    // Test Creating a new Project
    it('TODO: able to create a new Project', async () => {
        expect(false).toBeTruthy();
    });


});
