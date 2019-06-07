const QUERY_FIND =
`SELECT id, project_id, asset_type_id, ST_X(location) AS latitude, ST_Y(location) AS longitude
FROM asset`;

const QUERY_FIND_WHERE_PROJECT_ID = QUERY_FIND + ' WHERE project_id = $1';

/**
 * Find project assets.
 * 
 * Returns all assets across all projects unless projectId is given.
 * 
 * @param {number} [projectId] - (assumes isValidDbInteger(projectId)): optional: filter assets by this Project ID
 * @returns {object[]|undefined} array of assets with fields (id, project_id, latitude, and longitude), or undefined if projectId is invalid.
 * @throws error if the DB query failed to execute
 */
const find = async (projectId) => {
    let query;
    let values;

    if (typeof projectId !== 'undefined') {
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
