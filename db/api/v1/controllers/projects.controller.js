/**
 * Maps Project related requests to the correct database function and returns a response.
 * 
 * TODO: License?
 */

const projectsDb = require('../db/projects.db');

/**
 * Finds a Project in the database.
 * 
 * @param {*} req - The incoming Express request
 * @param {*} res - The outgoing Express Response
 * @param {*} next - The next Express middleware function in the stack
 */
const find = async (req, res, next) => {
    // const sponsor_name = req.valid.sponsor_name;
    const id = req.valid.id;
    const sponsorId = req.valid.sponsor_id;
    const name = req.valid.name;
    // const region = req.valid.region;

    try {
        const projects = await projectsDb.find(id, sponsorId, name/*, region */);
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

    // Parse parameters
    // const project = req.body;

    try {
        // const projects = await projectsDb.create(project); // TODO: implm
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find,
    create
};
