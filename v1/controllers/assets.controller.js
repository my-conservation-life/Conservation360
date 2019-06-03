const assetsDb = require('../db/assets.db');

const find = async (req, res, next) => {
    const projectIdString = req.query['project_id'];

    try {
        let projectId;
        if (projectIdString) {
            projectId = parseInt(projectIdString, 10);

            if (isNaN(projectId)) {
                throw new Error('Error while parsing the argument for project_id. Expected a number.');
            }
        }

        const assets = await assetsDb.find(projectId);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    find
};