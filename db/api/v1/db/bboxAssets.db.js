const DATABASE_QUERY_FAILED_MESSAGE = 'Database query for the bounding box failed';

/**
 * Get the bounding box for all assets,
 * or for the assets of a given project.
 * 
 * @param {number} [projectId] - filter assets by project ID, if specified
 * @returns {Promise<Bbox>} bounding box of the specified assets
 * @throws {string} throws an error when the database query returns no results
 */
const get = async (projectId) => {
    const createQuery = (fromTableExpression) => `
        SELECT ST_XMin(bbox) AS latitude_min, ST_XMax(bbox) AS latitude_max, ST_YMin(bbox) AS longitude_min, ST_YMax(bbox) AS longitude_max
        FROM (SELECT ST_Extent(location) AS bbox FROM ${fromTableExpression})
        AS tbbox
        `;

    const query = createQuery('asset' + ((projectId) ? ' WHERE project_id = $1' : ''));

    let result;
    try {
        result = await global.dbPool.query(query, ((projectId) ? [projectId] : []));
    } catch (error) {
        throw new Error(DATABASE_QUERY_FAILED_MESSAGE);
    }

    const bbox = result.rows[0];
    if (bbox) {
        return bbox;
    } else {
        throw new Error(DATABASE_QUERY_FAILED_MESSAGE);
    }
};

module.exports = { get };