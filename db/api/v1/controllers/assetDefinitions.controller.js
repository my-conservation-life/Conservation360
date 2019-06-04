const db = require('../db');

const getAll = async (req, res) => {

    const predicates = req.query;

    const assetDefinitions = await db.assetDefinitions.getAll(predicates);

    res.send(JSON.stringify(assetDefinitions));
};

const create = async (req, res) => {
    const assetDefinition = req.body;
    const assetTypeId = await db.assetDefinitions.create(assetDefinition);
    res.send(JSON.stringify(assetTypeId));
};

module.exports = {
    getAll,
    create
};