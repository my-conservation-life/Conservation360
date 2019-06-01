const { queryDB, isValidDbInteger } = require('../db');

const find = async (req, res) => {
    const projectIdString = req.query['project_id'];

    const query = `
        SELECT id, project_id, asset_type_id, ST_X(location) AS latitude, ST_Y(location) AS longitude
        FROM asset`;

    if (projectIdString) {
        const projectId = Number.parseInt(projectIdString, 10);
        if (projectId && isValidDbInteger(projectId)) {
            queryDB(res, query + ' WHERE project_id = $1', [projectId]);
        } else {
            res.status(500).send({ error: 'Invalid argument for the project_id parameter. Expected a positive integer.' });
        }
    } else {
        queryDB(res, query);
    }
};

module.exports = {
    find
};