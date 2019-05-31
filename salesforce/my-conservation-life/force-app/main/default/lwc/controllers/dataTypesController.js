import utils from 'c/utils';

const getAll = () => {
    const url = utils.URL + 'dataTypes';
    return utils.get(url);
}

export default {
    getAll
}