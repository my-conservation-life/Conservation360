const db = require("../db");
const utils = require("../utils");

const getAll = async (req, res, next) => {
    const predicates = req.query;

    const assets = await db.assets.getAll(predicates);
    
    res.send(JSON.stringify(assets));
}

const getOne = async (req, res, next) => {
    const id = req.params.id;
    const predicates = req.query;

    const assets = await db.assets.getOne(id, predicates);
    
    res.send(JSON.stringify(assets));
}

module.exports = {
    getAll,
    getOne
}