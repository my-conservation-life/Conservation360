/**
 * Tests for the Projects enpoint layer.
 * 
 * TODO: Insert License
 */

const request = require('supertest');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/projects';

const EXPECTED_PROJECT1 = { id: 1, sponsor_id: 1, name: 'Madagascar Reforesting Project', description: 'Replating Trees in Madacascar'};
const EXPECTED_PROJECT2 = { id: 2, sponsor_id: 1, name: 'Lemur Protection', description: 'Save the Lemurs! Long live Zooboomafu!'};
const EXPECTED_PROJECT3 = { id: 3, sponsor_id: 2, name: 'Bison Protection', description: 'Rebuilding the Bison population in North America.'};

describe('GET/POST Projects', () => {
    // Projects Test Setup
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();
        // Load in Test SQL file
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    // Clean up after the tests are finished.
    afterAll(async () => {
        await teardown();
    });

    // TODO: add this to a Test Util File (copied from assets.test.js)
    function contains(arr, key, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] === val) return true;
        }
        return false;
    }

    // Test the endpoint's response code
    it('returns HTTP 200 response', () => {
        // TODO: Should this be async?
        return request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT1), 
                        expect.objectContaining(EXPECTED_PROJECT2), 
                        expect.objectContaining(EXPECTED_PROJECT3)
                    ])
                );
            });
    });

    // Test getting all Projects from the database
    it('able to get all Projects', async () => {
        await request(app)
            .get(ENDPOINT)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT1),
                        expect.objectContaining(EXPECTED_PROJECT2),
                        expect.objectContaining(EXPECTED_PROJECT3)
                    ])
                );

                expect(res.body).toHaveLength(3);
            });
    });

    // Test getting a Project by Sponsor ID
    it('able to filter by Sponsor ID', async () => {
        await request(app)
            .get(ENDPOINT + '?sponsor_id=2')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT3)
                    ])
                );
                expect(res.body).toHaveLength(1);
            });
    });

    // Test getting a Project by Project Name
    it('able to filter by Project Name', async () => {
        await request(app)
            .get(ENDPOINT + '?name=Lemur%20Protection')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT2)
                    ])
                );
                expect(res.body).toHaveLength(1);
            });
    });

    // Test getting a Project by Project Name is case insensitive
    it('filters by Project Name is case insensitive', async () => {
        await request(app)
            .get(ENDPOINT + '?name=lEmUR%20PRoTECtIon')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT2)
                    ])
                );
                expect(res.body).toHaveLength(1);
            });
    });

    // Test getting a Project by Sponsor ID and Project Name
    it('able to filter by Sponsor ID and Project Name', async () => {
        await request(app)
            .get(ENDPOINT + '?sponsor_id=1&name=Madagascar%20Reforesting%20Project')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(EXPECTED_PROJECT1)
                    ])
                );
                expect(res.body).toHaveLength(1);
            });
    });

    // Test Creating a new Project
    it('TODO: able to create a new Project', async () => {
        expect(false).toBeTruthy();
    });


});
