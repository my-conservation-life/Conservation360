const { parseKey } = require('../db');
const bboxAssetsDb = require('../db/bbox-assets.db');

const get = async (req, res, next) => {
    const projectIdString = req.query['project_id'];
    const projectId = parseKey('project_id', projectIdString, res);

    try {
        const bbox = await bboxAssetsDb.get(projectId);
        res.json(bbox);
    } catch (error) {
        next(error);
    }
};

module.exports = { get };