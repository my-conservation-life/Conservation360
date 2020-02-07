/**
 * Maps Temporal Request Params to the correct db querry
 */

const temporalDb = require('../db/temporal.db');

const temporalSearch = async (req, res, next) => {
    const asset_id = req.valid.asset_id;
    const sponsor_id = req.valid.sponsor_id;
    const project_id = req.valid.project_id;
    const asset_type_id = req.valid.asset_type_id;
    const start_date = req.valid.start_date;
    const end_date = req.valid.end_date;

    try {
        const ret = await temporalDb.temporalSearch(asset_id, sponsor_id, project_id,
            asset_type_id, start_date, end_date);
        res.json(ret);
    } catch (e) {
        next(e);
    }
};

module.exports = { 
    temporalSearch 
};
