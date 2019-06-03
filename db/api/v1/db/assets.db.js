const { isValidDbInteger } = require('../db');

const QUERY_FIND =
`SELECT id, project_id, asset_type_id, ST_X(location) AS latitude, ST_Y(location) AS longitude
FROM asset`;

const QUERY_FIND_WHERE_PROJECT_ID = QUERY_FIND + ' WHERE project_id = $1';

/**
 * Find project assets.
 * 
 * Returns all assets across all projects unless projectId is given.
 * 
 * @param {number} [projectId] - (projectId > 0) optional: filter assets by this Project ID
 * @returns {object[]} array of assets with fields (id, project_id, latitude, and longitude)
 * @throws error if the DB query failed to execute
 * @throws error if projectId is not valid for the database column type
 */
const find = async (projectId) => {
    let query;
    let values;

    if (typeof projectId !== 'undefined') {
        if (!isValidDbInteger(projectId)) {
            throw new Error('Invalid argument for projectId. Expected a positive integer.');
        }

        query = QUERY_FIND_WHERE_PROJECT_ID;
        values = [projectId];
    } else {
        query = QUERY_FIND;
        values = [];
    }

    const result = await global.dbPool.query(query, values);
    return result.rows;
};

module.exports = {
    find
};