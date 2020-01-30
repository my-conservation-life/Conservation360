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

const fetchAssetPropTypes = (assetTypeID) => {
    const url = utils.URL + 'asset_prop_types';
    return utils.post(url, { assetTypeID: assetTypeID });
};

const fetchAssetPropsByTypeID = (assetTypeID) => {
    const url = utils.URL + 'asset_props_by_type_id';
    return utils.post(url, { assetTypeID: assetTypeID });
};

export default {
    find,
    create,
    findAssetTypes,
    fetchAssetPropTypes,
    fetchAssetPropsByTypeID
};
