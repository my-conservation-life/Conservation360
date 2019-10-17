/**
 * Projects table database interaction layer. These functions are exported to
 * provide the ability to query Project specific data.
 * 
 * TODO: Insert License
 */

const utils = require('../utils');


const QUERY_FIND = `SELECT id, sponsor_id, name, description
FROM projects
WHERE TRUE `;

/**
 * find is used to find Projects.
 * 
 * Returns Projects that match the query parameters.
 * 
 * @param {*} id the ID of the Project
 * @param {*} sponsorId the ID of the Sponsor for the Project
 * @param {*} name the name of the Project
 * @returns {object[]|undefined} array of projects with fields (id, sponsor_id, name, and description), or undefined if all params are invalid.
 * @throws error if the DB query failed to execute
 */
const find = async (id, sponsorId, name/*, region */) => {
    let query = QUERY_FIND;
    let values = [];
    if ((typeof id !== 'undefined') & (id > 0)) {
        values.push(id);
        query = query + `AND id = $${values.length}` + ' ';
    }
    if ((typeof sponsorId !== 'undefined') & (sponsorId > 0)) {
        values.push(sponsorId);
        query = query + `AND sponsor_id = $${values.length}` + ' ';
    }
    // Name search is case insensitive.
    if ((typeof name !== 'undefined') & (name.length > 0)) {
        values.push(name);
        query = query + `AND LOWER(name) = LOWER($${values.length})` + ' ';
    }

    const result = await global.dbPool.query(query, values);
    return result.rows;
};

/**
 * Creates a Project
 */
const create = async () => {
    // TODO: implm
};

module.exports = {
    find,
    create
};
