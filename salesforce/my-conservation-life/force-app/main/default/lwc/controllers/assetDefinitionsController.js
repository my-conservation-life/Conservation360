import utils from 'c/utils';
// var urljoin = require('url-join');


const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

const getAssetTypes = () => {
    // const url = urljoin(utils.URL, 'getAssetTypes');
    const url = utils.URL + 'assetTypes';
    return utils.get(url);
};

export default {
    find,
    create,
    getAssetTypes
};
