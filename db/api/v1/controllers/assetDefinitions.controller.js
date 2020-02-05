/**
 * Maps asset definition related requests to the correct DB function and returns a response
 */

const db = require('../db');
const csv = require('csvtojson');

/**
 * Finds all asset types stored in the DB
 * 
 * @param {*} req The incoming Express request
 * @param {*} res The outgoing Express request
 * @param {*} next The next Express middleware function in the stack
 */
const findAssetTypes = async (req, res, next) => {
    db.assetDefinitions.findAssetTypes()
        .then(data => {
            const assetTypes = data.rows;
            res.json(assetTypes);
        })
        .catch(e => {
            next(e);
        });
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

/**
 * Converts selected CSV file to JSON and adds the data to the DB
 * 
 * @param {*} req The incoming Express request
 * @param {*} res The outgoing Express request
 * @param {*} next The next Express middleware function in the stack
 */
const storeCSV = async(req, res, next) => {
    const assetTypeId = req.body.assetTypeId;

    const csvFile = req.file;
    const csvPath = csvFile.path;
    try {
        const json = await csv().fromFile(csvPath);
        const result = await db.assetDefinitions.storeCSV(assetTypeId, json);
        res.json({result: result});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    findAssetTypes,
    find,
    create,
    storeCSV
};
