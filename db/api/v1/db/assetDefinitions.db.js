const utils = require('../utils');

const findAssetTypes = async () => {
    let query = `
        SELECT
            id,
            name,
            description
        FROM
            asset_type
    `;

    return global.dbPool.query(query);
};

const findAssetsByTypeID = async (assetTypeID) => {
    let query = `
        SELECT
            id
        FROM
            asset
        WHERE
            asset_type_id = $1
    `;

    const params = [assetTypeID];

    return global.dbPool.query(query, params);
};

const findAssetPropertiesByID = async (assetID) => {
    let query = `
        SELECT
            value, property_id
        FROM
            asset_property
        WHERE
            asset_id = $1
        ORDER BY
            property_id
    `;

    const params = [assetID];

    return global.dbPool.query(query, params);
};

const findAssetTypesCSV = async (assetTypeID) => {
    // TODO
    let query = `
        SELECT
            *
        FROM
            asset_type
        WHERE
            id = $1
    `;
    const params = [assetTypeID];

    return global.dbPool.query(query, params);
};

const findAssetPropTypes = async (assetTypeID) => {
    let query = `
        SELECT
            id, name
        FROM
            property
        WHERE
            asset_type_id = $1
        ORDER BY id
    `;

    const params = [assetTypeID];

    return global.dbPool.query(query, params);
};

const findAssetProperties = async () => {
    let query = `
        SELECT
            id,
            asset_type_id,
            name,
            data_type,
            required,
            is_private
        FROM
            property
    `;

    return global.dbPool.query(query);
};

const findAssetPropsByTypeID = async (assetTypeID) => {
    let query = `
        SELECT
	        asset.id as id, asset_property.value as value, asset_property.property_id as property_id
        FROM
	        asset

        INNER JOIN
	        asset_property
        ON
	        asset_property.asset_id=asset.id
        WHERE
	        asset_type_id = 1
    `;

    const params = [assetTypeID];

    return global.dbPool.query(query, params);
};

/**
 * Creates an asset type row in the database.
 * 
 * @param {*} client - node postgres client
 * @param {string} name - the asset type's name
 * @param {string} description - the asset type's description
 * @returns {object} an object containing the newly created asset type's id
 */
const createAssetType = async (client, name, description) => {
    const query = `
        INSERT INTO asset_type
            (name, description)
        VALUES
            ($1, $2)
        RETURNING id
    `;
    const values = [name, description];

    return client.query(query, values);
};

/**
 * Creates a property row in the database based on a asset type's id.
 * 
 * @param {*} client - node postgres client
 * @param {string} assetTypeId - the asset type's id to assign this property to
 * @param {object} property - an object containing name, data_type, required, and is_private
 */
const createProperty = async (client, assetTypeId, property) => {
    const query = `
        INSERT INTO property
            (asset_type_id, name, data_type, required, is_private)
        VALUES
            ($1, $2, $3, $4, $5)
    `;
    const values = [assetTypeId, property.name, property.data_type, property.required, property.is_private];

    return client.query(query, values);
};

const find = async () => {

    const types = (await findAssetTypes()).rows;
    const properties = (await findAssetProperties()).rows;

    const assetDefinitions = [];
    for (let type of types) {
        const assetDefinition = {
            assetType: type,
            properties: []
        };
        for (let property of properties) {
            if (type.id === property.asset_type_id) {
                assetDefinition.properties.push(property);
            }
        }
        assetDefinitions.push(assetDefinition);
    }

    return assetDefinitions;
};

/**
 * Creates a asset definition in the database.
 * Creates asset types and properties within one transaction.
 * 
 * @param {object} assetDefinition - a valid my conservation life asset definition
 */
const create = async (assetDefinition) => {
    const client = await global.dbPool.connect();

    try {
        await utils.db.beginTransaction(client);

        const data = await createAssetType(client, assetDefinition.name, assetDefinition.description);
        const assetTypeId = data.rows[0].id;

        const propertyPromises = [];
        for (let property of assetDefinition.properties) {
            const propertyPromise = createProperty(client, assetTypeId, property);
            propertyPromises.push(propertyPromise);
        }

        await Promise.all(propertyPromises);
        await utils.db.commitTransaction(client);

        return assetTypeId;
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
    findAssetTypes,
    findAssetsByTypeID,
    findAssetTypesCSV,
    findAssetPropertiesByID,
    findAssetPropTypes,
    findAssetPropsByTypeID
};
