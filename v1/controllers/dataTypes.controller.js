const db = require('../db');

/**
 * Queries the database for dataTypes.
 * Converts dataTypes into flat array.
 * 
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
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