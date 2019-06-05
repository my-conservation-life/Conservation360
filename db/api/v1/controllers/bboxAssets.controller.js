const utils = require('../utils');
const bboxAssetsDb = require('../db/bboxAssets.db');

const get = async (req, res, next) => {
    const projectIdString = req.query['project_id'];
    const projectId = utils.db.parseKey('project_id', projectIdString, res);

    try {
        const bbox = await bboxAssetsDb.get(projectId);
        res.json(bbox);
    } catch (error) {
        next(error);
    }
};

module.exports = { get };