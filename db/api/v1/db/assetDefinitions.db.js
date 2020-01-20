const utils = require('../utils');

const PROPERTIES_QUERY = `
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

const findAssetProperties = async () => {
    let query = PROPERTIES_QUERY;

    return global.dbPool.query(query);
};

const findPropertiesByAssetTypeId = async(assetTypeId) => {
    let query = PROPERTIES_QUERY;

    const values = [];
    if ((typeof assetTypeId !== 'undefined') & (assetTypeId > 0)) {
        values.push(assetTypeId);
        query = query + ` WHERE asset_type_id = $${values.length}`;
    }

    return global.dbPool.query(query, values);
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

const processCSV = async(assetTypeId, csvJson) => {
    const properties = (await findPropertiesByAssetTypeId(assetTypeId)).rows;
    return(properties);
};

module.exports = {
    find,
    create,
    processCSV
};