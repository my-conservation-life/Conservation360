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

const getAssetTypesCSV = async (req, res, next) => {
    try {
        const assetTypesCSV = await db.assetDefinitions.findAssetTypesCSV(req.body.assetTypeID);
        res.json(assetTypesCSV);
    } catch (e) {
        next(e);
    }
};

const getAssetsByTypeID = async (req, res, next) => {
    try {
        const assets = await db.assetDefinitions.findAssetsByTypeID(req.body.assetTypeID);
        res.json(assets);
    } catch (e) {
        next(e);
    }
};

const getAssetProperties = async (req, res, next) => {
    try {
        const asset_properties = await db.assetDefinitions.findAssetPropertiesByID(req.body.assetID);
        res.json(asset_properties);
    } catch (e) {
        next(e);
    }
};

const getAssetPropTypes = async (req, res, next) => {
    try {
        const prop_types = await db.assetDefinitions.findAssetPropTypes(req.body.assetTypeID);
        res.json(prop_types);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    find,
    create,
    getAssetTypes,
    getAssetsByTypeID,
    getAssetTypesCSV,
    getAssetProperties,
    getAssetPropTypes
};
