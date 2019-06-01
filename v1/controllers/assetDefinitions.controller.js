const db = require('../db');

const create = async (req, res) => {
    const assetDefinition = req.body;
    const assetTypeId = await db.assetDefinitions.create(assetDefinition);
    res.send(assetTypeId);
};

module.exports = {
    create
};