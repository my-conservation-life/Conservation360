import utils from 'c/utils';


const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

const findAssetTypes = () => {
    const url = utils.URL + 'asset_types';
    return utils.get(url);
};

const fetchAssetTypesCSV = (assetTypeID) => {
    const url = utils.URL + 'asset_type_CSV';
    return utils.post(url, { assetTypeID: assetTypeID });
};

const fetchAssetsByTypeID = (assetTypeID) => {
    const url = utils.URL + 'assets_by_type_id';
    return utils.post(url, { assetTypeID: assetTypeID });
};

const fetchAssetProperties = (assetID) => {
    const url = utils.URL + 'asset_properties';
    return utils.post(url, { assetID: assetID });
};

const fetchAssetPropTypes = (assetTypeID) => {
    const url = utils.URL + 'asset_prop_types';
    return utils.post(url, { assetTypeID: assetTypeID });
};

export default {
    find,
    create,
    findAssetTypes,
    fetchAssetTypesCSV,
    fetchAssetsByTypeID,
    fetchAssetProperties,
    fetchAssetPropTypes
};
