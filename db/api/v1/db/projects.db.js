/**
 * Projects table database interaction layer. These functions are exported to
 * provide the ability to query Project specific data.
 */

const utils = require('../utils');

// A query to select projects from the database
const QUERY_FIND = `
    SELECT 
        id,
        sponsor_id, 
        name, 
        description
    FROM 
        project 
    WHERE 
        TRUE 
`; // The WHERE TRUE is needed for the find function to append WHERE clauses properly

// A query to create a new project in the database
const QUERY_CREATE = `
    INSERT INTO project 
        (sponsor_id, name, description) 
    VALUES
        ($1, $2, $3)
    RETURNING id 
`;

// A query to replace an existing project. 
const QUERY_UPDATE = `
    UPDATE project 
    SET 
        (sponsor_id, name, description) = 
        ($1, $2, $3)
    WHERE 
        id = $4
    RETURNING id 
`;

/**
 * Creates a Project row in the database
 * 
 * @param {*} client - node postgres client
 * @param {*} sponsorId - the ID of the sponsor of the Project
 * @param {*} name - The Name of the Project
 * @param {*} description - The Project's Description
 * 
 * @returns {*} the ID of the created Project
 */
const createProject = async (client, sponsorId, name, description) => {
    const values = [sponsorId, name, description];
    return client.query(QUERY_CREATE, values);
};

/**
 * Updates an existing project. This does a full replace of the old project.
 * 
 * @param {*} client - node postgres client
 * @param {*} projectId - The ID of the Project to Update
 * @param {*} sponsorId - the ID of the sponsor of the Project
 * @param {*} name - The Name of the Project
 * @param {*} description - The Project's Description
 * 
 * @returns {*} the ID of the updated Project
 */
const updateProject = async (client, projectId, sponsorId, name, description) => {
    const values = [sponsorId, name, description, projectId];
    return client.query(QUERY_UPDATE, values);
};

/**
 * Finds projects that match the provided parameters. Gets all projects if all parameters are undefined.
 * 
 * @param {number} id the ID of the Project
 * @param {number} sponsorId the ID of the Sponsor for the Project
 * @param {string} name the name of the Project
 * @returns {object[]|undefined} array of projects with fields (id, sponsor_id, name, and description), or undefined if all params are invalid.
 * @throws error if the DB query failed to execute
 * 
 * @returns {*} an array of projects that match the parameters.
 */
const find = async (id, sponsorId, name) => {
    let query = QUERY_FIND;
    let values = [];
    if ((typeof id !== 'undefined') && (id > 0)) {
        values.push(id);
        query = query + `AND id = $${values.length}` + ' ';
    }
    if ((typeof sponsorId !== 'undefined') && (sponsorId > 0)) {
        values.push(sponsorId);
        query = query + `AND sponsor_id = $${values.length}` + ' ';
    }
    // Name search is case insensitive.
    if ((typeof name !== 'undefined') && (name.length > 0)) {
        values.push(name);
        query = query + `AND LOWER(name) = LOWER($${values.length})` + ' ';
    }

    const result = await global.dbPool.query(query, values);
    return result.rows;
};

/**
 * Creates a Project in the database.
 * 
 * @param {object} project - a valid my conservation life Project
 * @returns {number} the project ID upon successful commit
 * @throws error if a query fails to execute.
 * 
 * @returns {number} the Id of the created project
 */
const create = async (project) => {
    const client = await global.dbPool.connect();

    try {
        await utils.db.beginTransaction(client);
        const data = await createProject(client, project.sponsor_id, project.name, project.description);
        const projectId = data.rows[0].id;
        await utils.db.commitTransaction(client);
        return projectId;
    } catch (error) {
        await utils.db.rollbackTransaction(client);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Updates an existing Project in the database.
 * 
 * @param {number} projectId - the ID of the project to update
 * @param {object} project - a valid my conservation life Project
 * @throws error if a query fails to execute.
 * 
 * @returns {number} the project ID upon successful commit
 */
const update = async (projectId, project) => {
    const client = await global.dbPool.connect();

    try {
        await utils.db.beginTransaction(client);
        const data = await updateProject(client, projectId, project.sponsor_id, project.name, project.description);
        const updatedRow = data.rows[0].id;
        await utils.db.commitTransaction(client);
        return updatedRow;
    } catch (error) {
        await utils.db.rollbackTransaction(client);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    find,
    create,
    update
};
