const utils = require('../utils');

const get = async (predicates) => {
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
        return utils.db.createErrorMessage(error)
    }
}

const getAll = async (predicates) => {
    data = await get(predicates)
    return data;
}

const getOne = async (id, predicates) => {
    predicates['id'] = id;
    data = await get(predicates)
    return data;
}

module.exports = {
    getAll,
    getOne
}