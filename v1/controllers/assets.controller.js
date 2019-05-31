const db = require('../db');

const getAll = async (req, res, next) => {
    const predicates = req.query;

    const assets = await db.assets.getAll(predicates);
    
    res.send(JSON.stringify(assets));
}

const getOne = async (req, res, next) => {
    const id = req.params.id;
    const predicates = req.query;

    const data = await db.assets.getOne(id, predicates);
    const asset = data[0];
    
    res.send(JSON.stringify(asset));
}

module.exports = {
    getAll,
    getOne
}