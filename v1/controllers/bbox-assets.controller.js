const { dbKeyParser } = require('../db');
const { withQueryParam } = require('../utils/request');
const bboxAssetsDb = require('../db/bbox-assets.db');

const get = (req, res, next) => {
    const onProjectIdParse = async (projectId) => {
        try {
            const bbox = await bboxAssetsDb.get(projectId);
            res.json(bbox);
        } catch (error) {
            next(error);
        }
    };

    withQueryParam(req, res, 'project_id', dbKeyParser,
        onProjectIdParse, onProjectIdParse);
};

module.exports = { get };