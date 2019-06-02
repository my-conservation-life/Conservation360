const db = require('../db');

const getAll = async (req, res) => {
    const predicates = req.query;

    const assets = await db.assets.getAll(predicates);
    
    res.send(JSON.stringify(assets));
};

const getOne = async (req, res) => {
    const id = req.params.id;
    const predicates = req.query;

    const asset = await db.assets.getOne(id, predicates);
    
    res.send(JSON.stringify(asset));
};

module.exports = {
    getAll,
    getOne
};