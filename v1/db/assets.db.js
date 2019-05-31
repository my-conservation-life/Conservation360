const utils = require("../utils");

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

        const db = await pool.query(query, values);
        return db.rows;
    } catch (error) {
        return utils.db.createErrorMessage(error)
    }
}

const getAll = async (predicates) => {
    data = await get(predicates)
    return data;
}

const getOne = async (id, predicates) => {
    predicates["id"] = id;
    data = await get(predicates)
    return data[0];
}

module.exports = {
    getAll,
    getOne
}