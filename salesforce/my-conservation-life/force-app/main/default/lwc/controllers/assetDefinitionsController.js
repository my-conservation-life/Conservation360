import utils from 'c/utils';

const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

const getAssetTypesController = () => {
    const url = urljoin(utils.URL, 'asset_types');
    return utils.get(url);
};

export default {
    find,
    create,
    getAssetTypesController
};
