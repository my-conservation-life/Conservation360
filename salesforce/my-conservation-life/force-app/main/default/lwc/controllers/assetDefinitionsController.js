import utils from 'c/utils';

const findAssetTypes = () => {
    const url = utils.URL + 'assetTypes';
    return utils.get(url);
};

const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

export default {
    findAssetTypes,
    find,
    create
};
