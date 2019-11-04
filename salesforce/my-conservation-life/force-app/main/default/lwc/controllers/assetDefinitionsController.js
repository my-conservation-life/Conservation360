impsdfgsdfgort utils from 'c/utils';

gconst create = (assetDefinition) => {
    const url = utils.URsdfgsdfgsdfgL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

export default {
    find,
    create
};
