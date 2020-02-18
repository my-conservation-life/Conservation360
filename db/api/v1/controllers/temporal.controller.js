/**
 * Maps Temporal Request Params to the correct db querry
 */

const temporalDb = require('../db/temporal.db');

const temporalSearch = async (req, res, next) => {
    const asset_id = req.valid.asset_id;
    const sponsor_name = req.valid.sponsor_name;
    const project_name = req.valid.project_name;
    const asset_type_name = req.valid.asset_type_name;
    const start_date = req.valid.start_date;
    const end_date = req.valid.end_date;
    const geometry = req.valid.geometry;

    try {
        const ret = await temporalDb.temporalSearch(geometry, asset_id, sponsor_name, project_name,
            asset_type_name, start_date, end_date);
        res.json(ret);
    } catch (e) {
        next(e);
    }
};

module.exports = { 
    temporalSearch 
};
