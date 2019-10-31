const db = require('../db');

const findAssetTypes = async (req, res, next) => {
    const predicates = req.query;

    try {
        const assetType = await db.assetDefinitions.findAssetTypes(predicates);
        res.json(assetType);
    }
    catch (e) {
        next(e);
    }
};

const find = async (req, res, next) => {

    const predicates = req.query;

    try {
        const assetDefinitions = await db.assetDefinitions.find(predicates);
        res.json(assetDefinitions);
    } catch (e) {
        next(e);
    }
};

const create = async (req, res, next) => {
    const assetDefinition = req.valid.assetDefinition;
    try {
        const assetTypeId = await db.assetDefinitions.create(assetDefinition);
        res.json(assetTypeId);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    findAssetTypes,
    find,
    create
};