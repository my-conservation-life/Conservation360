import utils from 'c/utils';
import projects from '../projectsController';

const querystring = require('querystring');

const createMockFetchFindJson = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));
const createMockFetchCreateJson = (projectId) => jest.fn(() => Promise.resolve({ ok: true, json: () => projectId }));
const createMockFetchUpdateJson = (projectId, jsonProject) => jest.fn(() => Promise.resolve({ ok: true, json: () => projectId}));

const PROJECTS_ENDPOINT = utils.URL + 'projects';

describe('projects.find', () => {
    
    const EXPECTED_PROJECTS = [];
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchFindJson(EXPECTED_PROJECTS);
        global.fetch = fetch;
    });

    it('finds all', async () => {
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);
    });

    it('finds without Project ID', async () => {
        // name and sponsor id
        const query = querystring.encode({name: 'foo', sponsor_id: '2'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);    
    });

    it('finds without Sponsor ID', async () => {
        // name and project id
        const query = querystring.encode({name: 'foo', id: '2'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);
    });

    it('finds without Project Name', async () => {
        // sponsor id and project id
        const query = querystring.encode({id: '1', sponsor_id: '2'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);   
    });

    it('finds with Project Name only', async () => {
        // name
        const query = querystring.encode({name: 'foo'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);  
    });

    it('finds with Sponsor ID only', async () => {
        // sponsor id
        const query = querystring.encode({sponsor_id: '1'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);  
    });

    it('finds with Project ID only', async () => {
        // project id
        const query = querystring.encode({id: '2'});
        const assetArray = await projects.find();
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `?${query}`);
        expect(assetArray).toEqual(EXPECTED_PROJECTS);  
    });
});

describe('projects.create', () => {

    const EXPECTED_ID = 4;
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchCreateJson(EXPECTED_ID);
        global.fetch = fetch;
    });

    it('creates with a valid project', async () => {
        const createdId = projects.create({sponsor_id: '1', name: 'MyProject', description: 'foo'});
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT);
        expect(createdId).toEqual(EXPECTED_ID);  
    });
});

describe('projects.update', () => {

    const EXPECTED_ID = 2;
    const UPDATED_PROJECT = {id: '2', sponsor_id: '1', name: 'foo', description: 'baz'};

    let fetch;

    beforeEach(() => {
        fetch = createMockFetchCreateJson(EXPECTED_ID, UPDATED_PROJECT);
        global.fetch = fetch;
    });

    it('updates a valid project', async () => {
        const updatedID = projects.update(EXPECTED_ID, UPDATED_PROJECT);
        expect(fetch.mock.calls[0][0]).toBe(PROJECTS_ENDPOINT + `${EXPECTED_ID}`);
        expect(updatedID.toString()).toEqual(EXPECTED_ID.toString());  
    });
});