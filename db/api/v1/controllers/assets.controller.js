const assetsDb = require('../db/assets.db');

const find = async (req, res, next) => {
    const projectId = req.valid.project_id;

    try {
        const assets = await assetsDb.find(projectId);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find
};