const assetsDb = require('../db/assets.db');

const find = async (req, res, next) => {
    const sponsorId = req.valid.sponsor_id;
    const projectId = req.valid.project_id;
    const assetId = req.valid.asset_type_id;
    const donorCodes = req.valid.donor_code;

    try {
        const assets = await assetsDb.find(sponsorId, projectId, assetId, donorCodes);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

/**
 * create is used to create a new instance of an asset in the database.
 * An asset includes an asset instance as well an instance of each
 * associated asset_property
 * @param {*} req The incoming post request
 * @param {*} res The outgoing response
 * @param {*} next
 */
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
    create,
};
