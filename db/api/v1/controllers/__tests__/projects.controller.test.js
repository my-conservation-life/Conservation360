/**
 * Tests for Projects controller layer.
 * 
 * TODO: Insert License
 */

const { find, create } = require('../projects.controller');
const projectsDb = require('../../db/projects.db');

// Testing the Projets controller Module
describe('projects.controller.find', () => {
    let req;
    let res;
    let next;
    let expected_projects;

    // Reset variables before each test
    beforeEach(() => {
        // Clear the request
        req = {
            valid: {},
            query: {}
        };

        // Clear the response
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();

        expected_projects = [{}];
        projectsDb.find = jest.fn(async () => expected_projects);
    });

    it('accesses DB and sends JSON response when no parameters are provided', async () => {
        await find(req, res, next);
        expect(projectsDb.find).toHaveBeenCalledWith(undefined, undefined, undefined);
        expect(res.json).toHaveBeenCalledWith(expected_projects);
    });

    it('accesses DB and sends JSON response when project id is provided', async () => {
        req.valid['id'] = 2;
        await find(req, res, next);
        expect(projectsDb.find).toHaveBeenCalledWith(2, undefined, undefined);
        expect(res.json).toHaveBeenCalledWith(expected_projects);
    });

    it('TODO: accesses DB and sends JSON response when sponsor_id is provided', async () => {
        req.valid['sponsor_id'] = 8;
        await find(req, res, next);
        expect(projectsDb.find).toHaveBeenCalledWith(undefined, 8, undefined);
        expect(res.json).toHaveBeenCalledWith(expected_projects);
    });

    it('accesses DB and sends JSON response when project name is provided', async () => {
        req.valid['name'] = 'Madagascar Reforestation';
        await find(req, res, next);
        expect(projectsDb.find).toHaveBeenCalledWith(undefined, undefined, 'Madagascar Reforestation');
        expect(res.json).toHaveBeenCalledWith(expected_projects);
    });

    it('accesses DB and sends JSON response when sponsor_id and name is provided', async () => {
        req.valid['sponsor_id'] = 8;
        req.valid['name'] = 'Madagascar Reforestation';
        await find(req, res, next);
        expect(projectsDb.find).toHaveBeenCalledWith(undefined, 8, 'Madagascar Reforestation');
        expect(res.json).toHaveBeenCalledWith(expected_projects);    });

    it('ignores unvalidated id', async () => {
        const getProjectId = jest.fn(() => 'a');
        Object.defineProperty(req.query, 'id', { get: getProjectId });
        await find(req, res, next);
        expect(getProjectId).not.toHaveBeenCalled();    
    });

    it('ignores unvalidated sponsor_id', async () => {
        const getSponsorId = jest.fn(() => 'a');
        Object.defineProperty(req.query, 'sponsor_id', { get: getSponsorId });
        await find(req, res, next);
        expect(getSponsorId).not.toHaveBeenCalled();   
    });

    it('ignores null name', async () => {
        const getName = jest.fn(() => null);
        Object.defineProperty(req.query, 'name', { get: getName });
        await find(req, res, next);
        expect(getName).not.toHaveBeenCalled();  
    });

    it('ignores empty name', async () => {
        const getName = jest.fn(() => '');
        Object.defineProperty(req.query, 'name', { get: getName });
        await find(req, res, next);
        expect(getName).not.toHaveBeenCalled(); 
    });
});

// TODO: Test Create?
describe('projects.controller.create', () => {
    let req;
    let res;
    let next;
    let project;

    // Reset variables before each test
    beforeEach(() => {
        // Clear the request
        req = {
            valid: {},
            body: {}
        };

        // Clear the response
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();

        project = { sponsor_id : '1', name: 'testProject', description: 'A description'};
        projectsDb.create = jest.fn(async () => 4);
    });

    it('accesses DB and sends JSON response when a valid project is provided', async () => {
        req.valid.project = project;
        await create(req, res, next);
        expect(projectsDb.create).toHaveBeenCalledWith(project);
        expect(res.json).toHaveBeenCalledWith(4);
    });

    it('ignores an undefined/invalidated project', async () => {
        const getUndefinedProject = jest.fn(() => undefined);
        Object.defineProperty(req.body, 'project', { get: getUndefinedProject });
        await create(req, res, next);
        expect(projectsDb.create).toHaveBeenCalledWith(undefined);
        expect(getUndefinedProject).not.toHaveBeenCalled();
    });

    it('catches DB access exceptions to pass them to the Express error handler', async () => {
        const DB_ERROR = new Error();
        projectsDb.create = jest.fn(async () => { throw DB_ERROR; });
        await create(req, res, next);
        expect(next).toHaveBeenCalledWith(DB_ERROR);
        expect(res.json).not.toHaveBeenCalled();
    });
});
