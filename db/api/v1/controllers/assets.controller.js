const assetsDb = require('../db/assets.db');
const { isValidDbInteger, DB_INTEGER_MAX } = require('../db');

const find = async (req, res, next) => {
    const projectIdString = req.query['project_id'];

    try {
        let projectId;
        if (projectIdString) {
            projectId = parseInt(projectIdString, 10);

            if (isNaN(projectId) || !isValidDbInteger(projectId)) {
                res.status(500).send(`Invalid argument for project_id. Expected a number between 1 and ${DB_INTEGER_MAX} but got '${projectIdString}'`);
                return;
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