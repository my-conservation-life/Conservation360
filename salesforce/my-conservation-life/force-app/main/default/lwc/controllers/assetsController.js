import utils from 'c/utils';

const getAll = (parameters) => {
    const url = utils.URL + 'assets' + parameters;
    return utils.get(url);
};

export default {
    getAll
};
