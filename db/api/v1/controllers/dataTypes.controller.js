const db = require('../db');

const getAll = async (req, res) => {
    const data = await db.dataTypes.getAll();

    // Transform data
    const dataTypes = [];
    for (let row of data) {
        dataTypes.push(row.name);
    }
    
    res.send(JSON.stringify(dataTypes));
};


module.exports = {
    getAll
};