const bboxAssetsDb = require('../db/bboxAssets.db');

const get = async (req, res, next) => {
    const projectId = req.valid.project_id;

    try {
        const bbox = await bboxAssetsDb.get(projectId);
        res.json(bbox);
    } catch (error) {
        next(error);
    }
};

module.exports = { get };