const db = require('../db');

const create = async (req, res) => {
    const assetDefinition = req.body;
    const assetTypeId = await db.assetDefinitions.create(assetDefinition);
    res.send(JSON.stringify(assetTypeId));
};

module.exports = {
    create
};