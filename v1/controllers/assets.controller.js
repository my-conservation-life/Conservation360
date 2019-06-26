const assetsDb = require('../db/assets.db');

const find = async (req, res, next) => {
    const sponsorId = req.valid.sponsor_id;
    const projectId = req.valid.project_id;
    const assetId = req.valid.asset_type_id;

    try {
        const assets = await assetsDb.find(sponsorId, projectId, assetId);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find
};
