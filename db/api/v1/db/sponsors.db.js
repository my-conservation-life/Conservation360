// const utils = require('../utils');

/**
 * Query to find all sponsors.
 */
const findSponsors = async () => {
    let query = `
        SELECT
            id,
            name
        FROM
            sponsor
        ORDER BY id
    `;

    return global.dbPool.query(query);
};

module.exports = {
    findSponsors
};
