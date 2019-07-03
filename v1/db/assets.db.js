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

/**
 * createAssetProperty is used to generate a row in
 * the asset_property table
 * @param {*} client The client being used to access the database
 * @param {*} assetId The asset id that this property will be associated with
 * @param {*} property The object containing the property's information
 */
const createAssetProperty = async (client, assetId, property) => {
    
    // Generate the SQL command
    const query = `
        INSERT INTO asset_property
            (asset_id, property_id, value)
        VALUES
            ($1, $2, $3)
    `;

    // Generate the values to subsitute into the SQL command
    const values = [assetId, property.id, property.value];

    // Execute the SQL command
    return client.query(query, values);

};

/**
 * createAsset is used to generate a row in
 * the asset table
 * @param {*} client The client being used to access the database
 * @param {*} projectId The project id that this asset will be associated with
 * @param {*} assetTypeId The asset definition that this asset will use
 * @param {*} location The lattitude and longitude of this asset
 */
const createAsset = async (client, projectId, assetTypeId, location) => {

    // Generate the SQL command
    const query = `
        INSERT INTO asset
            (project_id, asset_type_id, location)
        VALUES
            ($1, $2, ST_POINT($3, $4))
        RETURNING id
    `;

    // Generate the values to subsitute into the SQL command
    const values = [projectId, assetTypeId, location.lattitude, location.longitude];

    // Execute the SQL command
    return client.query(query, values);

};

/**
 * create is used to generate an asset object
 * This inclueds a row in the asset table and
 * rows in the asset_property table
 * @param {*} asset The object containing the asset's information
 */
const create = async (asset) => {

    // Connect to the database
    const client = await global.dbPool.connect();
    try {
        await utils.db.beginTransaction(client);

        // Create a row for this asset in the asset table
        const data = await createAsset(client, asset.project.id, asset.type.id, asset.location);
        const assetId = data.rows[0].id;

        // Create a row in the asset_property table for each property this asset has
        const propertyPromises = [];
        for (let property of asset.properties) {
            const propertyPromise = createAssetProperty(client, assetId, property);
            propertyPromises.push(propertyPromise);
        }

        // Wait for all transaction to complete
        await Promise.all(propertyPromises);
        await utils.db.commitTransaction(client);

        // Return the id of the generated asset
        return assetId;

    // Toss any encountered errors up the chain
    } catch (error) {
        await utils.db.rollbackTransaction(client);
        throw error;

    // Always terminate the database connection
    } finally {
        client.release();
    }
};

module.exports = {
    find,
    create
};
