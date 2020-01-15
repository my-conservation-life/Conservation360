const utils = require('../utils');

// const fastCSV = require('fast-csv');

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
JOIN asset_type ON asset.asset_type_id = asset_type.id
WHERE TRUE `;

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
    let query = QUERY_FIND;
    let values = [];
    if ((typeof sponsorId !== 'undefined') & (sponsorId > 0)) {
        values.push(sponsorId);
        query = query + `AND sponsor_id = $${values.length}` + ' ';
    }
    if ((typeof projectId !== 'undefined') & (projectId > 0)) {
        values.push(projectId);
        query = query + `AND project_id = $${values.length}` + ' ';
    }
    if ((typeof assetType !== 'undefined') & (assetType > 0)) {
        values.push(assetType);
        query = query + `AND asset_type_id = $${values.length}` + ' ';
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

const storeCSV = async(csvPath) => {
    const rows = [];

    // fastCSV.parseFile(csvPath)
    //     .on('error', function(error) {
    //         return(error);
    //     })
    //     .on('data', function(data) {
    //         rows.push(data);
    //     })
    //     .on('end', function() {
    //         console.log(rows);
    //     });
    return(rows);
};

module.exports = {
    find,
    create,
    storeCSV
};
