/**
 * Maps Project related requests to the correct database function and returns a response.
 */

const db = require('../db');
const projectsDb = require('../db/projects.db');

/**
 * Finds a Project in the database.
 * 
 * @param {*} req - The incoming Express request
 * @param {*} res - The outgoing Express Response
 * @param {*} next - The next Express middleware function in the stack
 */
const find = async (req, res, next) => {
    const id = req.valid.id;
    const sponsorId = req.valid.sponsor_id;
    const name = req.valid.name;

    try {
        const projects = await projectsDb.find(id, sponsorId, name);
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new Project in the database.
 * 
 * @param {*} req - The incoming Express request
 * @param {*} res - The outgoing Express Response
 * @param {*} next - The next Express middleware function in the stack
 */
const create = async (req, res, next) => {
    const project = req.valid.project;
    try {
        const projectId = await projectsDb.create(project);
        res.json(projectId);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing Project with 
 * 
 * @param {*} req - The incoming Express request
 * @param {*} res - The outgoing Express Response
 * @param {*} next - The next Express middleware function in the stack
 */
const update = async (req, res, next) => {
    // The ID of the Project to update
    const projectId = req.valid.id;
    // A valid Project to replace the existing one with 
    const project = req.valid.project;
    try {
        const success = await projectsDb.update(projectId, project);
        res.json(success);
    } catch (error) {
        next(error);
    }
};

/**
 * Gets all the projects from the database.
 * @param {*} req - the request
 * @param {*} res - the response
 * @param {*} next - the next middleware function
 */
const getAllProjects = async (req, res, next) => {
    const predicates = req.query;

    try {
        const projects = await db.projects.findAllProjects(predicates);
        res.json(projects);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    find,
    create,
    update,
    getAllProjects
};
