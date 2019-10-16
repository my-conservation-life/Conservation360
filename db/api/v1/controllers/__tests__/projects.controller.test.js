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

    it('TODO: accesses DB and sends JSON response when no project_id is provided', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: accesses DB and sends JSON response when project_id is provided', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: accesses DB and sends JSON response when project name is provided', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: accesses DB and sends JSON response when sponsor_id is provided', async () => {
        expect(false).toBeTruthy();
    });

    it('TODO: ignores unvalidated sponsor_id', async () => {
        expect(false).toBeTruthy();
    });
});

// TODO: Test Create?
describe('projects.controller.create', () => {
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
        projectsDb.create = jest.fn(async () => expected_projects);
    });

    it('TODO: creates a project and responds', async () =>{
        expect(false).toBeTruthy();
    });
});
