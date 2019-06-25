const QUERY_FIND = `SELECT
sponsor.name AS sponsor_name,
project.name AS project_name,
asset.id AS asset_id,
asset_type.name AS asset_type,
asset_type.description AS asset_description,
ST_X(asset.location) AS latitude,
ST_Y(asset.location) AS longitude
FROM
asset
JOIN project ON asset.project_id = project.id
JOIN sponsor ON project.sponsor_id = sponsor.id
JOIN asset_type ON asset.asset_type_id = asset_type.id`;

const QUERY_FIND_WHERE =
  QUERY_FIND +
  ' WHERE sponsor_id = $1 AND project_id = $2 AND asset_type_id = $3';

/**
 * Find project assets.
 *
 * Returns all assets across all projects unless projectId is given.
 *
 * @param {number} [projectId] - (assumes isValidDbInteger(projectId)): optional: filter assets by this Project ID
 * @returns {object[]|undefined} array of assets with fields (id, project_id, latitude, and longitude), or undefined if projectId is invalid.
 * @throws error if the DB query failed to execute
 */
const find = async (sponsorId, projectId, assetType) => {
    let query = QUERY_FIND_WHERE;
    let values = [];

    if (typeof sponsorId !== 'undefined') {
        if (sponsorId == 0) {
            values += 'TRUE';
        } else values += sponsorId;
    } else if (typeof sponsorId == 'undefined') {
        values += 'TRUE';
    }
    if (typeof projectId !== 'undefined') {
        if (projectId == 0) {
            values += 'TRUE';
        } else values += projectId;
    } else if (typeof projectId == 'undefined') {
        values += 'TRUE';
    }
    if (typeof assetType !== 'undefined') {
        if (assetType == 0) {
            values += 'TRUE';
        } else values += assetType;
    } else if (typeof assetType == 'undefined') {
        values += 'TRUE';
    }

    const result = await global.dbPool.query(query, values);
    return result.rows;
};

module.exports = {
    find
};
