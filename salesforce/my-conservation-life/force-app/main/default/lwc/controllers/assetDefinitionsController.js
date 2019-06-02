import utils from 'c/utils';

const getAll = (parameters) => {
    const url = utils.URL + 'assetDefinitions' + parameters;
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

export default {
    getAll,
    create
};
