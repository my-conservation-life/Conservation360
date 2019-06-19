const assetsDb = require('../db/assets.db');

const find = async (req, res, next) => {
    const projectId = req.valid.project_id;

    try {
        const assets = await assetsDb.find(projectId);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    const asset = req.body;
    try {
        const assetId = await assetsDb.create(asset);
        res.json(assetId);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find,
    create
};