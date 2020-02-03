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

/**
 * Gets all properties stored in the database
 * 
 * @returns {object} contains all properties found in the database along with other data associated with the query
 */
const findProperties = async () => {
    let query = PROPERTIES_QUERY;

    return global.dbPool.query(query);
};

/**
 * Gets all asset types stored in the database
 * 
 * @returns {object} contains all asset types found in the database along with other data associated with the query
 */
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

/**
 * Gets all properties associated with an asset type using the asset type's ID
 * 
 * @param {Number} assetTypeId ID of the asset type whose properties are being queried
 */
const findPropertiesByAssetTypeId = async(assetTypeId) => {
    let query = PROPERTIES_QUERY;

    const values = [];
    if ((typeof assetTypeId !== 'undefined') & (assetTypeId > 0)) {
        values.push(assetTypeId);
        query = query + ` WHERE asset_type_id = $${values.length}`;
    }

    return global.dbPool.query(query, values);
};

/**
 * Gets the asset associated given with the asset ID
 * 
 * @param {Number} assetId ID of the asset to query for
 */
const findAsset = async (assetId) => {
    const query = `
        SELECT
            *
        FROM
            asset
        WHERE
            id=$1
    `;

    const values = [assetId];

    return global.dbPool.query(query, values);
};

/**
 * Gets the asset property associated with the given asset ID and property ID
 * @param {Number} assetId ID of the asset
 * @param {Number} propertyId ID of the property
 */
const findAssetProperty = async (assetId, propertyId) => {
    const query = `
        SELECT 
            *
        FROM
            asset_property
        WHERE
            asset_id=$1 AND 
            property_id=$2
    `;

    const values = [assetId, propertyId];

    return global.dbPool.query(query, values);
};

/**
 * Creates a new asset property in the DB
 * @param {*} client Node Postgres client
 * @param {Number} assetId asset ID associated with the asset property
 * @param {Number} propertyId property ID associated with the asset property
 * @param {String} value the value of the property 
 */
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

/**
 * Updates an asset property that is already stored in the DB
 * @param {*} client Node Postgres client
 * @param {Number} assetId asset ID associated with the asset property
 * @param {Number} propertyId property ID associated with the asset property
 * @param {String} newValue new value that will replace the asset property's current value
 */
const updateAssetProperty = async(client, assetId, propertyId, newValue) => {

    let query = `
        UPDATE asset_property 
        SET value=$3 
        WHERE 
            asset_id=$1 AND 
            property_id=$2
    `;

    const  values = [assetId, propertyId, newValue];

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

    var asset = null;
    var assetId = null;
    var propertyId;
    var propertyIsRequired;
    var value;
    const client = await global.dbPool.connect();
    try {
        if (csvJson.length === 0) {
            throw 'The selected CSV file has no data to import.';
        }

        asset = csvJson[0];
        if (!('asset_id' in asset)) {
            throw 'The selected CSV file is missing an asset ID column.';
        }
        for (const propertyName in properties) {
            if (!(propertyName in asset)) {
                throw 'The selected CSV file is missing a header (' + propertyName + ')';
            }
        }

        await utils.db.beginTransaction(client);
        for (i = 0; i < csvJson.length; i++) {
            asset = csvJson[i];
            assetId = asset.asset_id;
            if (assetId === '') {
                throw 'The selected CSV file contains a row that is missing an asset ID (' + JSON.stringify(asset) + ')';
            }
            const checkedAsset = (await findAsset(assetId)).rows;
            if (checkedAsset.length === 0) {
                throw 'The selected CSV file contains a row for an asset that is not being tracked (Asset ID '+ assetId + ')';
            }

            for (const propertyName in asset) {
                if (propertyName !== 'asset_id') {
                    if (!(propertyName in properties)) {
                        throw 'The selected CSV file either contains an empty column, is missing a header, or contains a property that is not being tracked (' + propertyName + ')';
                    }

                    property = properties[propertyName];
                    propertyId = property.id;
                    propertyIsRequired = property.required;
                    value = asset[propertyName];
                    if (value === '' && propertyIsRequired) {
                        throw 'The selected CSV file is missing a required value (' + propertyName + ', ' + JSON.stringify(asset) + ')';
                    }
                    else if ((await findAssetProperty(assetId, propertyId)).rows.length > 0) {
                        await updateAssetProperty(client, assetId, propertyId, value);
                    }
                    else {
                        await createAssetProperty(client, assetId, propertyId, value);
                    }
                }
            }
        }
        await utils.db.commitTransaction(client);
    }
    catch (error) {
        await utils.db.rollbackTransaction(client);
        return({success: false, error: error});
    }
    return({success: true});
};

module.exports = {
    findPropertiesByAssetTypeId,
    findAssetTypes,
    find,
    create,
    storeCSV
};