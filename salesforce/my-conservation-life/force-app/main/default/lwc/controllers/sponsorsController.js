import utils from 'c/utils';

/**
 * Finds all sponsors.
 */
const fetchSponsors = () => {
    const url = utils.URL + 'sponsors';
    return utils.get(url);
};

export default {
    fetchSponsors
};
