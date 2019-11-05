import utils from 'c/utils';
import projects from '../projectsController';

const querystring = require('querystring');

const createMockFetchJson = (jsonObject) => jest.fn(() => Promise.resolve({ ok: true, json: () => jsonObject }));

const PROJECTS_ENDPOINT = utils.URL + 'projects';

describe('projects.find', () => {

    const EXPECTED_PROJECTS = [];
    let fetch;

    beforeEach(() => {
        fetch = createMockFetchJson(EXPECTED_PROJECTS);
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

    it('TODO: Write tests', async () => {
        expect(false).toBeTruthy();
    });
});

describe('projects.update', () => {

    it('TODO: Write tests', async () => {
        expect(false).toBeTruthy();
    });
});