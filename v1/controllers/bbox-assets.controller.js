const { dbKeyParser, queryDbResult } = require('../db');
const { withQueryParam } = require('../utils/request');

const get = async (req, res) => {
    const createQuery = (fromTableExpression) => `
        SELECT ST_XMin(bbox) AS latitude_min, ST_XMax(bbox) AS latitude_max, ST_YMin(bbox) AS longitude_min, ST_YMax(bbox) AS longitude_max
        FROM (SELECT ST_Extent(location) AS bbox FROM ${fromTableExpression})
        AS tbbox
    `;

    const withResult = (result) => {
        const bbox = result.rows[0];
        if (bbox) {
            res.json(bbox);
        } else {
            res.status(500).send({ error: 'Unable to query DB for bounding box' });
        }
    };

    withQueryParam(req, res, 'project_id', dbKeyParser,
        (projectId) => {
            const query = createQuery('asset WHERE project_id = $1')
            queryDbResult(res, query, [projectId], withResult);
        },
        () => {
            const query = createQuery('asset');
            queryDbResult(res, query, [], withResult);
        });
};

module.exports = { get };