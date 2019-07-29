/**
 * @param {number} latitude latitude of the asset
 * @param {number} longitude longitude of the asset
 * @param {number} [projectId] project ID of the asset
 */
const createTestAsset = async (latitude, longitude, projectId = 1) =>
    global.dbPool.query(
        `INSERT INTO asset (project_id, asset_type_id, location)
         VALUES ($1, 1, ST_POINT($2, $3))`,
        [projectId, latitude, longitude]
    );

module.exports = { createTestAsset };