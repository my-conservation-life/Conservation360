const db = require("../db");

const getAll = (req, res, next) => {
    const query = req.query;
    console.log(query);
    const assets = db.assets.getAll();
    res.send(assets);
}

module.exports = {
    getAll
}