import utils from 'c/utils';
import projects from '../projectsController';

const querystring = require('querystring');

const createMockFetch = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

let PROJECTS_URL = utils.URL + 'projects';

describe('projects.find', () => {
    
    const EXPECTED_PROJECTS = [];
    let fetch;

    async function findProjectTestHelper(params, expected){
        const query = querystring.encode(params);
        const projectArray = await projects.find(params);
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_URL + `?${query}`);
        expect(projectArray).toEqual(expected);  
    }

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_PROJECTS);
        global.fetch = fetch;
    });

    it('finds all', async () => {
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_URL);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);
    });

    it('finds without Project ID', async () => {
        // name and sponsor id
        const params = {sponsor_id: '2', name: 'foo'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);   
    });

    it('finds without Sponsor ID', async () => {
        // name and project id
        const params = {id: '2', name: 'foo'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);
    });

    it('finds without Project Name', async () => {
        // sponsor id and project id
        const params = {id: '1', sponsor_id: '2'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);
    });

    it('finds with Project Name only', async () => {
        // name
        const params = {name: 'foo'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);
    });

    it('finds with Sponsor ID only', async () => {
        // sponsor id
        const params = {sponsor_id: '1'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);
    });

    it('finds with Project ID only', async () => {
        // project id
        const params = {id: '2'};
        findProjectTestHelper(params, EXPECTED_PROJECTS);
    });
});

describe('projects.create', () => {

    const EXPECTED_RESPONSE = Promise.resolve();
    let fetch;

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_RESPONSE);
        global.fetch = fetch;
    });

    it('creates with a valid project', async () => {
        const createdId = projects.create({sponsor_id: '1', name: 'MyProject', description: 'foo'});
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_URL);
        expect(createdId).toEqual(EXPECTED_RESPONSE);  
    });
});

describe('projects.update', () => {

    const EXPECTED_ID = 2;
    const EXPECTED_RESPONSE = Promise.resolve();
    const UPDATED_PROJECT = {id: '2', sponsor_id: '1', name: 'foo', description: 'baz'};

    let fetch;

    beforeEach(() => {
        fetch = createMockFetch(EXPECTED_RESPONSE);
        global.fetch = fetch;
    });

    it('updates a valid project', async () => {
        const updatedID = projects.update(EXPECTED_ID, UPDATED_PROJECT);
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_URL + `/${EXPECTED_ID}`);
        expect(updatedID).toEqual(EXPECTED_RESPONSE);  
    });
});
