import utils from 'c/utils';

const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

/**
 * Finds all asset types.
 */
const fetchAssetTypes = () => {
    const url = utils.URL + 'assetTypes';
    return utils.get(url);
};

/**
 * Finds all asset property types for a given asset type ID.
 * @param {*} assetTypeID - the asset type ID
 */
const fetchAssetPropTypes = (assetTypeID) => {
    const url = utils.URL + 'assetPropTypes';
    return utils.post(url, { assetTypeID: assetTypeID });
};

/**
 * Finds all asset properties for all assets for a given asset type ID.
 * @param {*} assetTypeID - the asset type ID
 */
const fetchAssetPropsByTypeID = (assetTypeID) => {
    const url = utils.URL + 'assetPropsByTypeID';
    return utils.post(url, { assetTypeID: assetTypeID });
};

export default {
    find,
    create,
    fetchAssetTypes,
    fetchAssetPropTypes,
    fetchAssetPropsByTypeID
};
