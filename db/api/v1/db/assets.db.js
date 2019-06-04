const utils = require('../utils');

const get = async predicates => {
    try {
        let query = `
            SELECT
                id,
                project_id,
                asset_type_id,
                ST_X(location) AS latitude,
                ST_Y(location) AS longitude
            FROM
                asset
        `;

        const { whereClause, values } = utils.db.createWhereClause(predicates);
        query += whereClause;

        return pool.query(query, values);
    } catch (error) {
        return utils.db.createErrorMessage(error);
    }
};

const getAll = async predicates => {
    const db = await get(predicates);
    return db.rows;
};

const getOne = async (id, predicates) => {
    predicates['id'] = id;
    const db = await get(predicates);

    let asset = null;
    if (db.rows.length > 0) asset = db.rows[0];

    return asset;
};

module.exports = {
    getAll,
    getOne
};
