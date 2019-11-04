/**
 * Tests for the Projects enpoint layer.
 */

const request = require('supertest');
const querystring = require('querystring');
const app = require('../../app');
const { setup, teardown, loadSQL } = require('../setup');

const ENDPOINT = '/api/v1/projects';

const EXPECTED_PROJECT1 = { id: 1, sponsor_id: 1, name: 'Madagascar Reforesting Project', description: 'Replanting Trees in Madagascar' };
const EXPECTED_PROJECT2 = { id: 2, sponsor_id: 1, name: 'Lemur Protection', description: 'Save the Lemurs! Long live Zooboomafu!' };
const EXPECTED_PROJECT3 = { id: 3, sponsor_id: 2, name: 'Bison Protection', description: 'Rebuilding the Bison population in North America.' };

describe('GET Projects', () => {
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

    it('returns HTTP 200 response', () => {
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

    it('able to filter by Sponsor ID', async () => {
        const idQuery = querystring.encode({sponsor_id: '2'});
        await request(app)
            .get(ENDPOINT + `?${idQuery}`)
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

    it('returns bad request (HTTP 400) when finding with an invalid argument', async () => {
        const badIdQuery = querystring.encode({sponsor_id: 'a'});
        await request(app)
            .get(ENDPOINT + `?${badIdQuery}`)
            .expect(400)
            .then((res) => {
                expect(res.body['errors']).toHaveLength(1);
                expect(res.body['errors'][0]).toHaveProperty('problem', 'Failed to validate the argument "a" for the parameter "sponsor_id"');
                expect(res.body['errors'][0]).toHaveProperty('reason', 'Expected a number between 1 and 2147483647');
            });
    });

    it('able to filter by Project Name', async () => {
        const nameQuery = querystring.encode({name: 'Lemur Protection'});
        await request(app)
            .get(ENDPOINT + `?${nameQuery}`)
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

    it('filters by Project Name is case insensitive', async () => {
        const nameQuery = querystring.encode({name: 'lEmUR PRoTECtIon'});
        await request(app)
            .get(ENDPOINT + `?${nameQuery}`)
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

    it('able to filter by Sponsor ID and Project Name', async () => {
        const comboQuery = querystring.encode({sponsor_id: '1', name: 'Madagascar Reforesting Project' });
        await request(app)
            .get(ENDPOINT + `?${comboQuery}`)
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
});

describe('POST Project', () => {
    // Projects Test Setup
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    // Clean up after the tests are finished.
    afterAll(async () => {
        await teardown();
    });

    it('returns HTTP 200 and creates a new Project', async () => {
        const project1 = {
            'project': {
                'sponsor_id': '1',
                'name': 'tname',
                'description': 'tdesc'
            }
        };

        let expected_id;

        // We should get the ID of the project just created
        await request(app)
            .post(ENDPOINT)
            .send(project1)
            .expect(200)
            .then((response) => {
                const data = response.body;
                expected_id = data;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('number');
            });

        // Use the ID to find the record and validate that the project has the correct information
        const idQuery = querystring.encode({id: expected_id});
        await request(app)
            .get(ENDPOINT + `?${idQuery}`)
            .expect(200)
            .then((res) => {
                let expected_new_project = {
                    id: expected_id,
                    sponsor_id: parseInt(project1.project.sponsor_id, 10),
                    name: project1.project.name,
                    description: project1.project.description
                };

                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(expected_new_project)
                    ])
                );
                expect(res.body).toHaveLength(1);
            });

    });

    it('returns a bad request (HTTP 400) when creating with an invalid argument ', async () => {
        const project1 = {
            'project': {
                'sponsor_id': 'a',
                'name': 'tname',
                'description': 'tdesc'
            }
        };

        await request(app)
            .post(ENDPOINT)
            .send(project1)
            .expect(400)
            .then((res) => {
                // Check to see that we got an error
                expect(res.body['errors']).toHaveLength(1);
                expect(res.body['errors'][0]).toHaveProperty('problem', 'Failed to validate the argument "[object Object]" for the parameter "project"');
                expect(res.body['errors'][0]).toHaveProperty('reason', 'Expected a number between 1 and 2147483647');
            });
    });
});

describe('PUT Projects', () => {
    // The ID of the project we are manipulating
    let expected_id;

    const projectBefore = {
        'project': {
            'sponsor_id': '1',
            'name': 'nameBefore',
            'description': 'descriptionBefore'
        }
    };

    const projectAfter = {
        'project': {
            'sponsor_id': '2',
            'name': 'nameAfter',
            'description': 'descriptionAfter'
        }
    };

    // Projects Test Setup
    beforeAll(async () => {
        jest.setTimeout(30000);
        await setup();
        await loadSQL('../schema/sample-data-emptyProjects.sql');
    });

    // Clean up after the tests are finished.
    afterAll(async () => {
        await teardown();
    });

    it('returns HTTP 200 and updates an existing Project', async () => {
        // Insert a new project into the database and get its ID
        await request(app)
            .post(ENDPOINT)
            .send(projectBefore)
            .expect(200)
            .then((response) => {
                const data = response.body;
                expected_id = data;
                expect(data).toBeTruthy();
                expect(typeof data).toBe('number');
            });

        // Make sure the Insertion was successful
        const idQuery = querystring.encode({id: expected_id});
        await request(app)
            .get(ENDPOINT + `?${idQuery}`)
            .expect(200)
            .then((res) => {
                let expected_new_project = {
                    id: expected_id,
                    sponsor_id: parseInt(projectBefore.project.sponsor_id, 10),
                    name: projectBefore.project.name,
                    description: projectBefore.project.description
                };

                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(expected_new_project)
                    ])
                );

                expect(res.body).toHaveLength(1);
            });

        // Update Project with New information
        await request(app)
            .put(ENDPOINT + `/${expected_id}`)
            .send(projectAfter)
            .expect(200)
            .then((response) => {
                const data = response.body;
                expect(data).toBe(expected_id);
                expect(typeof data).toBe('number');
            });

        // Make sure the update was successful
        await request(app)
            .get(ENDPOINT + `?${idQuery}`)
            .expect(200)
            .then((res) => {
                let expected_updated_project = {
                    id: expected_id,
                    sponsor_id: parseInt(projectAfter.project.sponsor_id, 10),
                    name: projectAfter.project.name,
                    description: projectAfter.project.description
                };

                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(expected_updated_project)
                    ])
                );

                expect(res.body).toHaveLength(1);
            });
    });

    it('returns a bad request (HTTP 400) when updating with an invaid project ', async () => {
        // A Project that should fail validation
        const badProject = {
            'project': {
                'sponsor_id': 'a',
                'name': 'badName',
                'description': 'badDescription'
            }
        };

        // Update an existing project that should fail validation
        await request(app)
            .put(ENDPOINT + `/${expected_id}`)
            .send(badProject)
            .expect(400)
            .then((res) => {
                // Check to see that we got an error
                expect(res.body['errors']).toHaveLength(1);
                expect(res.body['errors'][0]).toHaveProperty('problem', 'Failed to validate the argument "[object Object]" for the parameter "project"');
                expect(res.body['errors'][0]).toHaveProperty('reason', 'Expected a number between 1 and 2147483647');
            });

        // Make sure the project has not been updated
        const idQuery = querystring.encode({id: expected_id});
        await request(app)
            .get(ENDPOINT + `?${idQuery}`)
            .expect(200)
            .then((res) => {
                let expected_updated_project = {
                    id: expected_id,
                    sponsor_id: parseInt(projectAfter.project.sponsor_id, 10),
                    name: projectAfter.project.name,
                    description: projectAfter.project.description
                };

                expect(res.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(expected_updated_project)
                    ])
                );

                expect(res.body).toHaveLength(1);
            });
    });

    it('returns a bad request (HTTP 400) when updating with an id param', async () => {
        const project1 = {
            'project': {
                'sponsor_id': 'a',
                'name': 'tname',
                'description': 'tdesc'
            }
        };

        await request(app)
            .put(ENDPOINT + '/a')
            .send(project1)
            .expect(400)
            .then((res) => {
                // Check to see that we got an error
                expect(res.body['errors']).toHaveLength(1);
                expect(res.body['errors'][0]).toHaveProperty('problem', 'Failed to validate the argument "a" for the parameter "id"');
                expect(res.body['errors'][0]).toHaveProperty('reason', 'Expected a number between 1 and 2147483647');
            });
    });
});
