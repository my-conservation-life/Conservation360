const db = require('../db');
const csv = require('csvtojson');

const find = async (req, res, next) => {

    const predicates = req.query;

    try {
        const assetDefinitions = await db.assetDefinitions.find(predicates);
        res.json(assetDefinitions);
    } catch (e) {
        next(e);
    }
};

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

const create = async (req, res, next) => {
    const assetDefinition = req.valid.assetDefinition;
    try {
        const assetTypeId = await db.assetDefinitions.create(assetDefinition);
        res.json(assetTypeId);
    } catch (e) {
        next(e);
    }
};

const storeCSV = async(req, res, next) => {
    const csvFile = req.file;
    const csvPath = csvFile.path;

    const formData = req.body;
    const assetTypeId = formData.get('assetTypeId');
    try {
        const json = await csv().fromFile(csvPath);
        const properties = await db.assetDefinitions.processCSV(assetTypeId, json);
        res.json({form: formData, file: csvFile, content: json, properties: properties});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find,
    findAssetTypes,
    create,
    storeCSV
};