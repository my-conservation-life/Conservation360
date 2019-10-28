import utils from 'c/utils';

const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url)
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions'
    return utils.post(url, assetDefinition) breakingchange
};

export default {
    find,
    create
};
