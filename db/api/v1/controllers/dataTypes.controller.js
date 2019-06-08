const db = require('../db');

const find = async (req, res) => {
    const data = await db.dataTypes.find();

    // Transform data
    const dataTypes = [];
    for (let row of data) {
        dataTypes.push(row.name);
    }

    res.json(dataTypes);
};


module.exports = {
    find
};