const find = async () => {
    const query = `
        SELECT
            name
        FROM
            data_type
    `;

    const db = await global.pool.query(query);
    return db.rows;
};

module.exports = {
    find
};