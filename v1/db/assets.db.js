const utils = require('../utils');

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

const createAssetProperty = async (client, assetId, property) => {
    const query = `
        INSERT INTO asset_property
            (asset_id, property_id, value)
        VALUES
            ($1, $2, $3)
    `;
    const values = [assetId, property.id, property.value];

    return client.query(query, values);
};

const createAsset = async (client, projectId, assetTypeId, location) => {

    const query = `
        INSERT INTO asset
            (project_id, asset_type_id, location)
        VALUES
            ($1, $2, ST_POINT($3, $4))
        RETURNING id
    `;
    const values = [projectId, assetTypeId, location.lattitude, location.longitude];

    return client.query(query, values);
};

const create = async (asset) => {
    const client = await global.pool.connect();

    try {
        await utils.db.beginTransaction(client);

        const data = await createAsset(client, asset.project.id, asset.type.id, asset.location);
        const assetId = data.rows[0].id;

        const propertyPromises = [];
        for (let property of asset.properties) {
            const propertyPromise = createAssetProperty(client, assetId, property);
            propertyPromises.push(propertyPromise);
        }

        await Promise.all(propertyPromises);
        await utils.db.commitTransaction(client);

        return assetId;
    } catch (error) {
        await utils.db.rollbackTransaction(client);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    find,
    create
};
