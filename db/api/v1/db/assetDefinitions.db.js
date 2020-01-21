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

const findProperties = async () => {
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
    const properties = (await findProperties()).rows;

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

const createAssetProperty = async (client, assetId, propertyId, value) => {
    
    // Generate the SQL command
    const query = `
        INSERT INTO asset_property
            (asset_id, property_id, value)
        VALUES
            ($1, $2, $3)
    `;

    // Generate the values to subsitute into the SQL command
    const values = [assetId, propertyId, value];

    // Execute the SQL command
    return client.query(query, values);

};

const storeCSV = async(assetTypeId, csvJson) => {
    const propertyArray = (await findPropertiesByAssetTypeId(assetTypeId)).rows;
    const properties = {};

    var i;
    var property = null;
    var propertyName = null;
    for (i = 0; i < propertyArray.length; i++) {
        property = propertyArray[i];
        propertyName = property.name;
        properties[propertyName] = property;
    }

    const client = await global.dbPool.connect();
    var asset = null;
    var assetId = null;
    for (i = 0; i < csvJson.length; i++) {
        asset = csvJson[i];
        assetId = asset.asset_id;

        var assetKeys = Object.keys(asset);
        var value;
        var propertyId;
        for (const key in assetKeys) {
        //     value = asset[key];
        //     propertyId = properties[key].id;
            // await createAssetProperty(client, assetId, propertyId, value);
        }
    }
    return(assetKeys);
};

const updateProperty = async(assetId, assetTypeId, newValue) => {
    const client = await global.dbPool.connect();

    let query = `
        UPDATE asset_property
        SET value=$3
        WHERE
            asset_id=$1 AND
            asset_type_id=$2
    `;

    const  values = [assetId, assetTypeId, newValue];

    return client.query(query, values);
};

module.exports = {
    findPropertiesByAssetTypeId,
    updateProperty,
    findAssetTypes,
    find,
    create,
    storeCSV
};