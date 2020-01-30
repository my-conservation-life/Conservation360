const db = require('../db');

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

const getAssetTypes = async (req, res, next) => {
    const predicates = req.query;

    try {
        const assetTypes = await db.assetDefinitions.findAssetTypes(predicates);
        res.json(assetTypes);
    } catch (e) {
        next(e);
    }
};

const getAssetPropTypes = async (req, res, next) => {
    try {
        const prop_types = await db.assetDefinitions.findAssetPropTypes(req.valid.assetTypeID);
        res.json(prop_types);
    } catch (e) {
        next(e);
    }
};

const getAssetPropsByTypeID = async (req, res, next) => {
    try {
        const data = await db.assetDefinitions.findAssetPropsByTypeID(req.valid.assetTypeID);
        res.json(data);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    find,
    create,
    getAssetTypes,
    getAssetPropTypes,
    getAssetPropsByTypeID
};
