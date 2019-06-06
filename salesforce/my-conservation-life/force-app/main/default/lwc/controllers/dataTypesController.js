import utils from 'c/utils';

const find = () => {
    const url = utils.URL + 'dataTypes';
    return utils.get(url);
};

export default {
    find
};
