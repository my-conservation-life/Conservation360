
const find = async () => {
    
    const query = `
        SELECT
            name
        FROM
            data_type
    `;

    const db = await global.dbPool.query(query);
    
    return db.rows;
};

module.exports = {
    find
};