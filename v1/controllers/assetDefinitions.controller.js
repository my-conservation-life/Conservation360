const db = require('../db');

const create = async (req, res, next) => {
    const assetDefinition = req.body;
    const message = await db.assetDefinitions.create(assetDefinition);
    res.send(message);
}

module.exports = {
    create
}