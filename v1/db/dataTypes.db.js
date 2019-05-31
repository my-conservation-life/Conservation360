const utils = require('../utils');

const getAll = async (predicates) => {
    try {
        const query = `
            SELECT
                name
            FROM
                data_type
        `;

        const db = await pool.query(query);
        return db.rows;
    } catch (error) {
        return utils.db.createErrorMessage(error);
    }
}

module.exports = {
    getAll
}